import React, { useState } from 'react';
import { Card, Input, Button, Row, Col, Space, Typography, message, Tooltip, Select, Checkbox } from 'antd';
import { CopyOutlined, DatabaseOutlined, CodeOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface ColumnInfo {
  name: string;
  alias?: string;
  type?: string;
}

const SelectToJavaDtoPage: React.FC = () => {
  const [selectQuery, setSelectQuery] = useState<string>('');
  const [javaDtoCode, setJavaDtoCode] = useState<string>('');
  const [className, setClassName] = useState<string>('ResultDto');
  const [packageName, setPackageName] = useState<string>('com.example.dto');
  const [useLombok, setUseLombok] = useState<boolean>(true);
  const [useValidation, setUseValidation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const parseSelectQuery = (query: string): ColumnInfo[] => {
    try {
      // Remove comments
      const cleanQuery = query.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Extract SELECT part
      const selectMatch = cleanQuery.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
      if (!selectMatch) return [];

      const selectPart = selectMatch[1];
      const columns: ColumnInfo[] = [];

      // Split by comma, but handle nested functions
      const parts = [];
      let current = '';
      let depth = 0;
      
      for (let i = 0; i < selectPart.length; i++) {
        const char = selectPart[i];
        if (char === '(') depth++;
        if (char === ')') depth--;
        
        if (char === ',' && depth === 0) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) parts.push(current.trim());

      // Parse each column
      for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart || trimmedPart === '*') continue;

        // Handle column with alias (col AS alias or col alias)
        const aliasMatch = trimmedPart.match(/(?:.*\s+AS\s+(\w+)|.*\s+(\w+))$/i);
        let columnName = trimmedPart;
        let alias = '';

        if (aliasMatch) {
          alias = aliasMatch[1] || aliasMatch[2];
          // Check if it's actually an alias (not a function name)
          const beforeAlias = trimmedPart.substring(0, trimmedPart.lastIndexOf(alias)).trim();
          if (beforeAlias && !beforeAlias.match(/\b(SELECT|FROM|WHERE|GROUP|ORDER|HAVING|LIMIT)\b/i)) {
            columnName = beforeAlias.replace(/\s+AS\s*$/i, '').trim();
          } else {
            alias = '';
          }
        }

        // Extract actual column name
        const colMatch = columnName.match(/(\w+)\.(\w+)$/); // table.column
        const finalColumnName = colMatch ? colMatch[2] : columnName.match(/(\w+)$/)?.[1] || columnName;

        columns.push({
          name: finalColumnName,
          alias: alias || finalColumnName
        });
      }

      return columns;
    } catch (error) {
      console.error('Query parsing error:', error);
      return [];
    }
  };

  const inferJavaType = (columnName: string): string => {
    const name = columnName.toLowerCase();
    
    // Boolean types
    if (name.includes('is_') || name.includes('has_') || name.includes('flag') || 
        name.includes('active') || name.includes('enabled') || name.includes('deleted')) {
      return 'Boolean';
    }
    
    // Integer types
    if (name.includes('id') || name.includes('count') || name.includes('quantity') || 
        name.includes('age') || name.includes('year') || name.includes('month') || 
        name.includes('day') || name.includes('size') || name.includes('index')) {
      return 'Long';
    }
    
    // BigDecimal types
    if (name.includes('price') || name.includes('amount') || name.includes('cost') || 
        name.includes('rate') || name.includes('salary') || name.includes('fee')) {
      return 'BigDecimal';
    }
    
    // Date/Time types
    if (name.includes('date') || name.includes('_at') || name.includes('time') || 
        name.includes('created') || name.includes('updated') || name.includes('modified')) {
      return 'LocalDateTime';
    }
    
    // Default to String
    return 'String';
  };

  const toCamelCase = (str: string): string => {
    return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  };

  const toPascalCase = (str: string): string => {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const generateJavaDto = () => {
    if (!selectQuery.trim()) {
      message.warning('SELECT 쿼리를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const columns = parseSelectQuery(selectQuery);
      
      if (columns.length === 0) {
        message.error('쿼리에서 컬럼을 파싱할 수 없습니다. SELECT 문법을 확인해주세요.');
        setLoading(false);
        return;
      }

      let imports = new Set<string>();
      let fields: string[] = [];

      // Add standard imports
      if (useLombok) {
        imports.add('import lombok.Getter;');
        imports.add('import lombok.Setter;');
        imports.add('import lombok.NoArgsConstructor;');
        imports.add('import lombok.AllArgsConstructor;');
        imports.add('import lombok.Builder;');
      }

      // Analyze columns and generate fields
      for (const column of columns) {
        const fieldName = toCamelCase(column.alias || column.name);
        const javaType = inferJavaType(column.name);

        // Add imports for special types
        if (javaType === 'LocalDateTime') {
          imports.add('import java.time.LocalDateTime;');
        } else if (javaType === 'BigDecimal') {
          imports.add('import java.math.BigDecimal;');
        }

        // Add validation annotations if needed
        let validationAnnotations = '';
        if (useValidation) {
          if (javaType === 'String' && !column.name.toLowerCase().includes('optional')) {
            imports.add('import javax.validation.constraints.NotBlank;');
            validationAnnotations = '    @NotBlank\n';
          } else if (!column.name.toLowerCase().includes('optional')) {
            imports.add('import javax.validation.constraints.NotNull;');
            validationAnnotations = '    @NotNull\n';
          }
        }

        fields.push(`${validationAnnotations}    private ${javaType} ${fieldName};`);
      }

      // Generate DTO class
      let dtoCode = `package ${packageName};\n\n`;
      
      // Add imports
      const sortedImports = Array.from(imports).sort();
      for (const imp of sortedImports) {
        dtoCode += `${imp}\n`;
      }
      
      dtoCode += '\n';

      // Add class annotations
      if (useLombok) {
        dtoCode += '@Getter\n';
        dtoCode += '@Setter\n';
        dtoCode += '@NoArgsConstructor\n';
        dtoCode += '@AllArgsConstructor\n';
        dtoCode += '@Builder\n';
      }

      dtoCode += `public class ${className} {\n\n`;

      // Add fields
      for (const field of fields) {
        dtoCode += `${field}\n\n`;
      }

      // If not using Lombok, generate getters and setters
      if (!useLombok) {
        for (const column of columns) {
          const fieldName = toCamelCase(column.alias || column.name);
          const javaType = inferJavaType(column.name);
          const methodName = toPascalCase(column.alias || column.name);

          // Getter
          dtoCode += `    public ${javaType} get${methodName}() {\n`;
          dtoCode += `        return ${fieldName};\n`;
          dtoCode += `    }\n\n`;

          // Setter
          dtoCode += `    public void set${methodName}(${javaType} ${fieldName}) {\n`;
          dtoCode += `        this.${fieldName} = ${fieldName};\n`;
          dtoCode += `    }\n\n`;
        }
      }

      dtoCode += '}';

      setJavaDtoCode(dtoCode);
      message.success('Java DTO 클래스가 생성되었습니다!');
    } catch (error) {
      message.error('Java DTO 생성 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (javaDtoCode) {
      navigator.clipboard.writeText(javaDtoCode);
      message.success('클립보드에 복사되었습니다!');
    }
  };

  const clearAll = () => {
    setSelectQuery('');
    setJavaDtoCode('');
    setClassName('ResultDto');
  };

  const exampleQuery = `SELECT 
    u.user_id,
    u.username,
    u.email,
    u.created_at,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_amount) AS total_spent,
    u.is_active
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.user_id, u.username, u.email, u.created_at, u.is_active`;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DatabaseOutlined /> SELECT to Java DTO Converter
      </Title>
      <Text type="secondary">
        SELECT 쿼리를 입력하면 Java DTO 클래스를 자동으로 생성합니다.
      </Text>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Text>패키지명</Text>
                  <Input 
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="com.example.dto"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>클래스명</Text>
                  <Input 
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="ResultDto"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text>옵션</Text>
                  <div style={{ marginTop: '5px' }}>
                    <Checkbox 
                      checked={useLombok}
                      onChange={(e) => setUseLombok(e.target.checked)}
                    >
                      Lombok 사용
                    </Checkbox>
                    <Checkbox 
                      checked={useValidation}
                      onChange={(e) => setUseValidation(e.target.checked)}
                      style={{ marginLeft: '16px' }}
                    >
                      Validation 추가
                    </Checkbox>
                  </div>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<><DatabaseOutlined /> SELECT 쿼리 입력</>} 
            extra={
              <Tooltip title="예제 쿼리 사용">
                <Button 
                  size="small" 
                  onClick={() => setSelectQuery(exampleQuery)}
                >
                  예제
                </Button>
              </Tooltip>
            }
          >
            <TextArea
              rows={20}
              value={selectQuery}
              onChange={(e) => setSelectQuery(e.target.value)}
              placeholder="SELECT 쿼리를 입력하세요..."
              style={{ fontFamily: 'monospace' }}
            />
            <Space style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                icon={<CodeOutlined />}
                onClick={generateJavaDto}
                loading={loading}
                size="large"
              >
                Java DTO 생성
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
            title={<><CodeOutlined /> Java DTO 클래스</>}
            extra={
              <Tooltip title="클립보드에 복사">
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={copyToClipboard}
                  disabled={!javaDtoCode}
                  size="small"
                >
                  복사
                </Button>
              </Tooltip>
            }
          >
            <TextArea
              rows={20}
              value={javaDtoCode}
              readOnly
              placeholder="생성된 Java DTO 클래스가 여기에 표시됩니다..."
              style={{ fontFamily: 'monospace' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>사용 방법</Title>
        <ol>
          <li>패키지명과 클래스명을 설정하세요.</li>
          <li>Lombok 사용 여부와 Validation 추가 여부를 선택하세요.</li>
          <li>왼쪽 입력창에 SELECT 쿼리를 입력하세요.</li>
          <li>"Java DTO 생성" 버튼을 클릭하면 자동으로 DTO 클래스가 생성됩니다.</li>
          <li>컬럼명은 자동으로 camelCase로 변환되며, 타입은 컬럼명에서 추론됩니다.</li>
          <li>"복사" 버튼으로 결과를 클립보드에 복사할 수 있습니다.</li>
        </ol>
        <Title level={4} style={{ marginTop: '16px' }}>타입 추론 규칙</Title>
        <ul>
          <li>id, count, quantity, age, year 등 → Long</li>
          <li>price, amount, cost, rate, fee 등 → BigDecimal</li>
          <li>date, time, created_at, updated_at 등 → LocalDateTime</li>
          <li>is_, has_, flag, active, enabled 등 → Boolean</li>
          <li>기타 → String</li>
        </ul>
      </Card>
    </div>
  );
};

export default SelectToJavaDtoPage;