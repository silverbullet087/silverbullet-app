import React, { useState } from 'react';
import { Card, Input, Button, Row, Col, Space, Typography, message, Tooltip } from 'antd';
import { CopyOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  comment?: string;
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
}

const DdlToJsonPage: React.FC = () => {
  const [ddlInput, setDdlInput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const parseDDL = (ddl: string): TableInfo | null => {
    try {
      const tableMatch = ddl.match(/CREATE\s+TABLE\s+(?:`)?(\w+)(?:`)?/i);
      if (!tableMatch) return null;

      const tableName = tableMatch[1];
      const columns: ColumnInfo[] = [];

      const columnSection = ddl.match(/\(([\s\S]*)\)/);
      if (!columnSection) return null;

      const lines = columnSection[1].split('\n').map(line => line.trim());
      
      for (const line of lines) {
        if (!line || line.startsWith('PRIMARY') || line.startsWith('KEY') || 
            line.startsWith('INDEX') || line.startsWith('UNIQUE') || 
            line.startsWith('CONSTRAINT') || line.startsWith('FOREIGN')) continue;

        const columnMatch = line.match(/^`?(\w+)`?\s+(\w+(?:\([^)]+\))?)/);
        if (columnMatch) {
          const name = columnMatch[1];
          const type = columnMatch[2].toUpperCase();
          const nullable = !line.toUpperCase().includes('NOT NULL');
          
          const defaultMatch = line.match(/DEFAULT\s+([^,\s]+)/i);
          const defaultValue = defaultMatch ? defaultMatch[1].replace(/'/g, '') : undefined;
          
          const commentMatch = line.match(/COMMENT\s+'([^']+)'/i);
          const comment = commentMatch ? commentMatch[1] : undefined;

          columns.push({ name, type, nullable, defaultValue, comment });
        }
      }

      return { name: tableName, columns };
    } catch (error) {
      console.error('DDL parsing error:', error);
      return null;
    }
  };

  const generateSampleValue = (column: ColumnInfo): any => {
    const type = column.type.toUpperCase();
    
    if (column.defaultValue && column.defaultValue !== 'NULL') {
      if (column.defaultValue === 'CURRENT_TIMESTAMP') return new Date().toISOString();
      return column.defaultValue;
    }
    
    if (column.nullable && Math.random() < 0.3) return null;
    
    if (type.includes('INT') || type.includes('NUMERIC') || type.includes('DECIMAL')) {
      if (type.includes('BIGINT')) return Math.floor(Math.random() * 1000000);
      if (type.includes('SMALLINT')) return Math.floor(Math.random() * 100);
      if (type.includes('TINYINT')) return Math.floor(Math.random() * 10);
      return Math.floor(Math.random() * 10000);
    }
    
    if (type.includes('FLOAT') || type.includes('DOUBLE')) {
      return parseFloat((Math.random() * 1000).toFixed(2));
    }
    
    if (type.includes('BOOLEAN') || type.includes('BOOL')) {
      return Math.random() < 0.5;
    }
    
    if (type.includes('DATE') || type.includes('TIME')) {
      if (type === 'DATE') return new Date().toISOString().split('T')[0];
      if (type === 'TIME') return new Date().toTimeString().split(' ')[0];
      return new Date().toISOString();
    }
    
    if (type.includes('JSON')) {
      return { key: "value", nested: { data: "example" } };
    }
    
    if (type.includes('TEXT') || type.includes('BLOB')) {
      return `Sample ${column.name} text content`;
    }
    
    if (type.includes('VARCHAR') || type.includes('CHAR')) {
      const lengthMatch = type.match(/\((\d+)\)/);
      const maxLength = lengthMatch ? parseInt(lengthMatch[1]) : 50;
      const sampleText = `Sample ${column.name}`;
      return sampleText.substring(0, maxLength);
    }
    
    if (type.includes('ENUM')) {
      const enumMatch = type.match(/ENUM\(([^)]+)\)/i);
      if (enumMatch) {
        const values = enumMatch[1].split(',').map(v => v.trim().replace(/'/g, ''));
        return values[Math.floor(Math.random() * values.length)];
      }
    }
    
    return `sample_${column.name}`;
  };

  const generateJSON = () => {
    if (!ddlInput.trim()) {
      message.warning('DDL을 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      const tableInfo = parseDDL(ddlInput);
      
      if (!tableInfo) {
        message.error('DDL 파싱에 실패했습니다. 올바른 CREATE TABLE 문법인지 확인해주세요.');
        setLoading(false);
        return;
      }

      const sampleData: any = {};
      const sampleArray: any[] = [];

      for (const column of tableInfo.columns) {
        sampleData[column.name] = generateSampleValue(column);
      }

      for (let i = 0; i < 3; i++) {
        const rowData: any = {};
        for (const column of tableInfo.columns) {
          rowData[column.name] = generateSampleValue(column);
        }
        sampleArray.push(rowData);
      }

      const output = {
        tableName: tableInfo.name,
        singleObject: sampleData,
        arrayOfObjects: sampleArray,
        columns: tableInfo.columns.map(col => ({
          name: col.name,
          type: col.type,
          nullable: col.nullable,
          ...(col.defaultValue && { defaultValue: col.defaultValue }),
          ...(col.comment && { comment: col.comment })
        }))
      };

      setJsonOutput(JSON.stringify(output, null, 2));
      message.success('JSON 샘플이 생성되었습니다!');
    } catch (error) {
      message.error('JSON 생성 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput);
      message.success('클립보드에 복사되었습니다!');
    }
  };

  const clearAll = () => {
    setDdlInput('');
    setJsonOutput('');
  };

  const exampleDDL = `CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  age INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  bio TEXT COMMENT '사용자 소개',
  PRIMARY KEY (id)
);`;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DatabaseOutlined /> DDL to JSON Converter
      </Title>
      <Text type="secondary">
        데이터베이스 테이블 DDL을 입력하면 JSON 샘플 데이터를 자동으로 생성합니다.
      </Text>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<><DatabaseOutlined /> DDL 입력</>} 
            extra={
              <Tooltip title="예제 DDL 사용">
                <Button 
                  size="small" 
                  onClick={() => setDdlInput(exampleDDL)}
                >
                  예제
                </Button>
              </Tooltip>
            }
          >
            <TextArea
              rows={20}
              value={ddlInput}
              onChange={(e) => setDdlInput(e.target.value)}
              placeholder="CREATE TABLE 문을 입력하세요..."
              style={{ fontFamily: 'monospace' }}
            />
            <Space style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                icon={<FileTextOutlined />}
                onClick={generateJSON}
                loading={loading}
                size="large"
              >
                JSON 생성
              </Button>
              <Button 
                onClick={clearAll}
                size="large"
              >
                전체 지우기
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<><FileTextOutlined /> JSON 출력</>}
            extra={
              <Tooltip title="클립보드에 복사">
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={copyToClipboard}
                  disabled={!jsonOutput}
                  size="small"
                >
                  복사
                </Button>
              </Tooltip>
            }
          >
            <TextArea
              rows={20}
              value={jsonOutput}
              readOnly
              placeholder="생성된 JSON이 여기에 표시됩니다..."
              style={{ fontFamily: 'monospace' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>사용 방법</Title>
        <ol>
          <li>왼쪽 입력창에 CREATE TABLE DDL을 입력하세요.</li>
          <li>"JSON 생성" 버튼을 클릭하면 자동으로 샘플 데이터가 생성됩니다.</li>
          <li>생성된 JSON은 단일 객체와 배열 형태 모두 포함됩니다.</li>
          <li>각 컬럼의 데이터 타입에 맞는 샘플 값이 자동으로 생성됩니다.</li>
          <li>"복사" 버튼으로 결과를 클립보드에 복사할 수 있습니다.</li>
        </ol>
        <Title level={4} style={{ marginTop: '16px' }}>지원하는 데이터 타입</Title>
        <ul>
          <li>숫자형: INT, BIGINT, SMALLINT, TINYINT, FLOAT, DOUBLE, DECIMAL</li>
          <li>문자형: VARCHAR, CHAR, TEXT, BLOB</li>
          <li>날짜/시간: DATE, TIME, DATETIME, TIMESTAMP</li>
          <li>기타: BOOLEAN, JSON, ENUM</li>
        </ul>
      </Card>
    </div>
  );
};

export default DdlToJsonPage;