import React, { useState } from 'react';
import { Card, Input, Button, Row, Col, Space, Typography, message, Tabs, Alert, Collapse } from 'antd';
import { CopyOutlined, DatabaseOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface TableInfo {
  tableName: string;
  className: string;
  variableName: string;
  columns: Array<{
    name: string;
    type: string;
    javaType: string;
    fieldName: string;
    isPrimaryKey: boolean;
  }>;
}

interface Templates {
  controller: string;
  service: string;
  dao: string;
  dto: string;
  mybatisXml: string;
}

const DEFAULT_TEMPLATES: Templates = {
  controller: `package com.example.controller;

import com.example.service.{ClassName}Service;
import com.example.dto.{ClassName}Dto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/{variableName}")
public class {ClassName}Controller {
    
    @Autowired
    private {ClassName}Service {variableName}Service;
    
    @GetMapping
    public List<{ClassName}Dto> get{ClassName}List({ClassName}Dto searchDto) {
        return {variableName}Service.get{ClassName}List(searchDto);
    }
    
    @GetMapping("/{id}")
    public {ClassName}Dto get{ClassName}(@PathVariable Long id) {
        return {variableName}Service.get{ClassName}(id);
    }
    
    @PostMapping
    public int create{ClassName}(@RequestBody {ClassName}Dto {variableName}Dto) {
        return {variableName}Service.create{ClassName}({variableName}Dto);
    }
    
    @PutMapping("/{id}")
    public int update{ClassName}(@PathVariable Long id, @RequestBody {ClassName}Dto {variableName}Dto) {
        {variableName}Dto.setId(id);
        return {variableName}Service.update{ClassName}({variableName}Dto);
    }
    
    @DeleteMapping("/{id}")
    public int delete{ClassName}(@PathVariable Long id) {
        return {variableName}Service.delete{ClassName}(id);
    }
}`,

  service: `package com.example.service;

import com.example.dao.{ClassName}Dao;
import com.example.dto.{ClassName}Dto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class {ClassName}Service {
    
    @Autowired
    private {ClassName}Dao {variableName}Dao;
    
    public List<{ClassName}Dto> get{ClassName}List({ClassName}Dto searchDto) {
        return {variableName}Dao.select{ClassName}List(searchDto);
    }
    
    public {ClassName}Dto get{ClassName}(Long id) {
        return {variableName}Dao.select{ClassName}(id);
    }
    
    public int create{ClassName}({ClassName}Dto {variableName}Dto) {
        return {variableName}Dao.insert{ClassName}({variableName}Dto);
    }
    
    public int update{ClassName}({ClassName}Dto {variableName}Dto) {
        return {variableName}Dao.update{ClassName}({variableName}Dto);
    }
    
    public int delete{ClassName}(Long id) {
        return {variableName}Dao.delete{ClassName}(id);
    }
}`,

  dao: `package com.example.dao;

import com.example.dto.{ClassName}Dto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface {ClassName}Dao {
    
    List<{ClassName}Dto> select{ClassName}List({ClassName}Dto searchDto);
    
    {ClassName}Dto select{ClassName}(Long id);
    
    int insert{ClassName}({ClassName}Dto {variableName}Dto);
    
    int update{ClassName}({ClassName}Dto {variableName}Dto);
    
    int delete{ClassName}(Long id);
}`,

  dto: `package com.example.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class {ClassName}Dto {
{fields}
}`,

  mybatisXml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.dao.{ClassName}Dao">

    <resultMap id="{variableName}ResultMap" type="com.example.dto.{ClassName}Dto">
{resultMapFields}
    </resultMap>

    <select id="select{ClassName}List" parameterType="com.example.dto.{ClassName}Dto" resultMap="{variableName}ResultMap">
        SELECT {selectFields}
        FROM {tableName}
        <where>
{whereConditions}
        </where>
        ORDER BY {primaryKey} DESC
    </select>

    <select id="select{ClassName}" parameterType="Long" resultMap="{variableName}ResultMap">
        SELECT {selectFields}
        FROM {tableName}
        WHERE {primaryKey} = #{id}
    </select>

    <insert id="insert{ClassName}" parameterType="com.example.dto.{ClassName}Dto">
        INSERT INTO {tableName} (
{insertFields}
        ) VALUES (
{insertValues}
        )
    </insert>

    <update id="update{ClassName}" parameterType="com.example.dto.{ClassName}Dto">
        UPDATE {tableName}
        <set>
{updateFields}
        </set>
        WHERE {primaryKey} = #{id}
    </update>

    <delete id="delete{ClassName}" parameterType="Long">
        DELETE FROM {tableName}
        WHERE {primaryKey} = #{id}
    </delete>

</mapper>`
};

const SpringCrudGeneratorPage: React.FC = () => {
  const [ddlInput, setDdlInput] = useState<string>('');
  const [templates, setTemplates] = useState<Templates>(DEFAULT_TEMPLATES);
  const [generatedCode, setGeneratedCode] = useState<Templates>({
    controller: '',
    service: '',
    dao: '',
    dto: '',
    mybatisXml: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const parseDDL = (ddl: string): TableInfo | null => {
    try {
      const tableMatch = ddl.match(/CREATE\s+TABLE\s+(?:`)?(\w+)(?:`)?/i);
      if (!tableMatch) return null;

      const tableName = tableMatch[1];
      const className = toPascalCase(tableName);
      const variableName = toCamelCase(tableName);
      
      const columns: TableInfo['columns'] = [];
      
      const columnSection = ddl.match(/\(([\s\S]*)\)/);
      if (!columnSection) return null;

      const lines = columnSection[1].split('\n').map(line => line.trim());
      let primaryKey = '';
      
      // Find primary key
      for (const line of lines) {
        if (line.includes('PRIMARY KEY')) {
          const pkMatch = line.match(/PRIMARY\s+KEY\s*\((?:`)?(\w+)(?:`)?\)/i);
          if (pkMatch) primaryKey = pkMatch[1];
        }
      }
      
      // Parse columns
      for (const line of lines) {
        if (!line || line.startsWith('PRIMARY') || line.startsWith('KEY') || 
            line.startsWith('INDEX') || line.startsWith('UNIQUE') || 
            line.startsWith('CONSTRAINT') || line.startsWith('FOREIGN')) continue;

        const columnMatch = line.match(/^`?(\w+)`?\s+(\w+(?:\([^)]+\))?)/);
        if (columnMatch) {
          const name = columnMatch[1];
          const type = columnMatch[2].toUpperCase();
          
          columns.push({
            name,
            type,
            javaType: getJavaType(type),
            fieldName: toCamelCase(name),
            isPrimaryKey: name === primaryKey
          });
        }
      }

      return { tableName, className, variableName, columns };
    } catch (error) {
      console.error('DDL parsing error:', error);
      return null;
    }
  };

  const getJavaType = (sqlType: string): string => {
    const type = sqlType.toUpperCase();
    if (type.includes('INT')) return 'Long';
    if (type.includes('DECIMAL') || type.includes('NUMERIC')) return 'BigDecimal';
    if (type.includes('FLOAT') || type.includes('DOUBLE')) return 'Double';
    if (type.includes('DATE') || type.includes('TIME')) return 'LocalDateTime';
    if (type.includes('BOOLEAN') || type.includes('BOOL')) return 'Boolean';
    return 'String';
  };

  const toCamelCase = (str: string): string => {
    return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  };

  const toPascalCase = (str: string): string => {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const generateCode = () => {
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

      // Generate DTO fields
      const dtoFields = tableInfo.columns.map(col => {
        const javaType = col.javaType === 'BigDecimal' ? 'BigDecimal' : col.javaType;
        return `    private ${javaType} ${col.fieldName};`;
      }).join('\n');

      // Generate MyBatis XML fields
      const resultMapFields = tableInfo.columns.map(col => 
        `        <result column="${col.name}" property="${col.fieldName}" />`
      ).join('\n');

      const selectFields = tableInfo.columns.map(col => col.name).join(', ');
      
      const insertFields = tableInfo.columns
        .filter(col => !col.isPrimaryKey)
        .map(col => `            ${col.name}`)
        .join(',\n');
      
      const insertValues = tableInfo.columns
        .filter(col => !col.isPrimaryKey)
        .map(col => `            #{${col.fieldName}}`)
        .join(',\n');

      const updateFields = tableInfo.columns
        .filter(col => !col.isPrimaryKey)
        .map(col => `            <if test="${col.fieldName} != null">${col.name} = #{${col.fieldName}},</if>`)
        .join('\n');

      const whereConditions = tableInfo.columns
        .filter(col => col.javaType === 'String')
        .map(col => `            <if test="${col.fieldName} != null and ${col.fieldName} != ''">\n                AND ${col.name} LIKE CONCAT('%', #{${col.fieldName}}, '%')\n            </if>`)
        .join('\n');

      const primaryKey = tableInfo.columns.find(col => col.isPrimaryKey)?.name || 'id';

      // Replace placeholders in templates
      const replacePlaceholders = (template: string): string => {
        return template
          .replace(/{ClassName}/g, tableInfo.className)
          .replace(/{className}/g, tableInfo.className)
          .replace(/{variableName}/g, tableInfo.variableName)
          .replace(/{tableName}/g, tableInfo.tableName)
          .replace(/{fields}/g, dtoFields)
          .replace(/{resultMapFields}/g, resultMapFields)
          .replace(/{selectFields}/g, selectFields)
          .replace(/{insertFields}/g, insertFields)
          .replace(/{insertValues}/g, insertValues)
          .replace(/{updateFields}/g, updateFields)
          .replace(/{whereConditions}/g, whereConditions)
          .replace(/{primaryKey}/g, primaryKey);
      };

      setGeneratedCode({
        controller: replacePlaceholders(templates.controller),
        service: replacePlaceholders(templates.service),
        dao: replacePlaceholders(templates.dao),
        dto: replacePlaceholders(templates.dto),
        mybatisXml: replacePlaceholders(templates.mybatisXml)
      });

      message.success('Spring CRUD 코드가 생성되었습니다!');
    } catch (error) {
      message.error('코드 생성 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    if (code) {
      navigator.clipboard.writeText(code);
      message.success('클립보드에 복사되었습니다!');
    }
  };

  const clearAll = () => {
    setDdlInput('');
    setGeneratedCode({
      controller: '',
      service: '',
      dao: '',
      dto: '',
      mybatisXml: ''
    });
  };

  const exampleDDL = `CREATE TABLE user_info (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);`;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <CodeOutlined /> Spring CRUD Generator
      </Title>
      <Text type="secondary">
        DDL을 입력하면 Spring MVC의 Controller, Service, DAO, DTO, MyBatis XML을 자동으로 생성합니다.
      </Text>

      <Alert
        message="템플릿 커스터마이징"
        description="아래 템플릿 섹션에서 각 파일의 템플릿을 수정할 수 있습니다. {ClassName}, {variableName}, {tableName} 등의 플레이스홀더가 자동으로 치환됩니다."
        type="info"
        showIcon
        style={{ marginTop: '16px', marginBottom: '16px' }}
      />

      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title={<><DatabaseOutlined /> DDL 입력</>} 
            extra={
              <Space>
                <Button 
                  size="small" 
                  onClick={() => setDdlInput(exampleDDL)}
                >
                  예제 사용
                </Button>
                <Button 
                  type="primary" 
                  icon={<CodeOutlined />}
                  onClick={generateCode}
                  loading={loading}
                >
                  코드 생성
                </Button>
                <Button onClick={clearAll}>
                  전체 지우기
                </Button>
              </Space>
            }
          >
            <TextArea
              rows={10}
              value={ddlInput}
              onChange={(e) => setDdlInput(e.target.value)}
              placeholder="CREATE TABLE 문을 입력하세요..."
              style={{ fontFamily: 'monospace' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title={<><FileTextOutlined /> 생성된 코드</>}>
            <Tabs defaultActiveKey="controller">
              <TabPane tab="Controller" key="controller">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.controller)}
                      disabled={!generatedCode.controller}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.controller}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="Service" key="service">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.service)}
                      disabled={!generatedCode.service}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.service}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="DAO" key="dao">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.dao)}
                      disabled={!generatedCode.dao}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.dao}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="DTO" key="dto">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.dto)}
                      disabled={!generatedCode.dto}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.dto}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="MyBatis XML" key="mybatisXml">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.mybatisXml)}
                      disabled={!generatedCode.mybatisXml}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.mybatisXml}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Collapse>
            <Panel header="템플릿 설정" key="templates">
              <Tabs>
                <TabPane tab="Controller Template" key="controllerTemplate">
                  <TextArea
                    rows={15}
                    value={templates.controller}
                    onChange={(e) => setTemplates({...templates, controller: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>
                
                <TabPane tab="Service Template" key="serviceTemplate">
                  <TextArea
                    rows={15}
                    value={templates.service}
                    onChange={(e) => setTemplates({...templates, service: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>
                
                <TabPane tab="DAO Template" key="daoTemplate">
                  <TextArea
                    rows={15}
                    value={templates.dao}
                    onChange={(e) => setTemplates({...templates, dao: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>
                
                <TabPane tab="DTO Template" key="dtoTemplate">
                  <TextArea
                    rows={15}
                    value={templates.dto}
                    onChange={(e) => setTemplates({...templates, dto: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>
                
                <TabPane tab="MyBatis XML Template" key="mybatisXmlTemplate">
                  <TextArea
                    rows={20}
                    value={templates.mybatisXml}
                    onChange={(e) => setTemplates({...templates, mybatisXml: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>
              </Tabs>
              <Alert
                message="플레이스홀더 설명"
                description={
                  <ul>
                    <li>{'{ClassName}'} - PascalCase 클래스명 (예: UserInfo)</li>
                    <li>{'{variableName}'} - camelCase 변수명 (예: userInfo)</li>
                    <li>{'{tableName}'} - 테이블명 (예: user_info)</li>
                    <li>{'{fields}'} - DTO 필드 목록</li>
                    <li>{'{primaryKey}'} - 기본키 컬럼명</li>
                    <li>MyBatis XML 전용: {'{selectFields}'}, {'{insertFields}'}, {'{insertValues}'}, {'{updateFields}'}, {'{whereConditions}'}</li>
                  </ul>
                }
                type="info"
                style={{ marginTop: '16px' }}
              />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default SpringCrudGeneratorPage;