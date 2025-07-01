import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Space, Typography, message, Tabs, Alert, Collapse, Upload, Modal } from 'antd';
import { CopyOutlined, DatabaseOutlined, CodeOutlined, FileTextOutlined, DownloadOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

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

interface GeneratedFiles {
  apiController: string;
  viewController: string;
  actionController: string;
  dto: string;
  mapstruct: string;
  vo: string;
  queryService: string;
  commandService: string;
  dao: string;
  mybatisXml: string;
  test: string;
}

interface Templates {
  apiController: string;
  viewController: string;
  actionController: string;
  dto: string;
  mapstruct: string;
  vo: string;
  queryService: string;
  commandService: string;
  dao: string;
  mybatisXml: string;
  test: string;
}

const DEFAULT_TEMPLATES: Templates = {
  apiController: `package com.example.controller.api;

import com.example.service.{ClassName}QueryService;
import com.example.dto.{ClassName}Dto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/{variableName}")
public class {ClassName}ApiController {
    
    @Autowired
    private {ClassName}QueryService {variableName}QueryService;
    
    @GetMapping
    public ResponseEntity<List<{ClassName}Dto>> get{ClassName}List({ClassName}Dto searchDto) {
        List<{ClassName}Dto> list = {variableName}QueryService.get{ClassName}List(searchDto);
        return ResponseEntity.ok(list);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<{ClassName}Dto> get{ClassName}(@PathVariable Long id) {
        {ClassName}Dto dto = {variableName}QueryService.get{ClassName}(id);
        return ResponseEntity.ok(dto);
    }
}`,

  viewController: `package com.example.controller.view;

import com.example.service.{ClassName}QueryService;
import com.example.dto.{ClassName}Dto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/{variableName}")
public class {ClassName}ViewController {
    
    @Autowired
    private {ClassName}QueryService {variableName}QueryService;
    
    @GetMapping("/list")
    public String {variableName}List(Model model, {ClassName}Dto searchDto) {
        model.addAttribute("searchDto", searchDto);
        return "{variableName}/list";
    }
    
    @GetMapping("/detail/{id}")
    public String {variableName}Detail(@PathVariable Long id, Model model) {
        {ClassName}Dto dto = {variableName}QueryService.get{ClassName}(id);
        model.addAttribute("{variableName}", dto);
        return "{variableName}/detail";
    }
    
    @GetMapping("/form")
    public String {variableName}Form(@RequestParam(required = false) Long id, Model model) {
        {ClassName}Dto dto = new {ClassName}Dto();
        if (id != null) {
            dto = {variableName}QueryService.get{ClassName}(id);
        }
        model.addAttribute("{variableName}", dto);
        return "{variableName}/form";
    }
}`,

  actionController: `package com.example.controller.action;

import com.example.service.{ClassName}CommandService;
import com.example.dto.{ClassName}Dto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import javax.validation.Valid;

@Controller
@RequestMapping("/{variableName}")
public class {ClassName}ActionController {
    
    @Autowired
    private {ClassName}CommandService {variableName}CommandService;
    
    @PostMapping("/save")
    public String save{ClassName}(@Valid @ModelAttribute {ClassName}Dto dto, 
                                  BindingResult bindingResult,
                                  RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "{variableName}/form";
        }
        
        try {
            if (dto.getId() == null) {
                {variableName}CommandService.create{ClassName}(dto);
                redirectAttributes.addFlashAttribute("message", "등록되었습니다.");
            } else {
                {variableName}CommandService.update{ClassName}(dto);
                redirectAttributes.addFlashAttribute("message", "수정되었습니다.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "처리 중 오류가 발생했습니다.");
            return "redirect:/{variableName}/form";
        }
        
        return "redirect:/{variableName}/list";
    }
    
    @PostMapping("/delete/{id}")
    public String delete{ClassName}(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            {variableName}CommandService.delete{ClassName}(id);
            redirectAttributes.addFlashAttribute("message", "삭제되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "삭제 중 오류가 발생했습니다.");
        }
        return "redirect:/{variableName}/list";
    }
}`,

  dto: `package com.example.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class {ClassName}Dto {
{dtoFields}
}`,

  mapstruct: `package com.example.mapper;

import com.example.dto.{ClassName}Dto;
import com.example.vo.{ClassName}Vo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface {ClassName}Mapper {
    
    {ClassName}Mapper INSTANCE = Mappers.getMapper({ClassName}Mapper.class);
    
    {ClassName}Dto toDto({ClassName}Vo vo);
    
    {ClassName}Vo toVo({ClassName}Dto dto);
    
    List<{ClassName}Dto> toDtoList(List<{ClassName}Vo> voList);
    
    List<{ClassName}Vo> toVoList(List<{ClassName}Dto> dtoList);
}`,

  vo: `package com.example.vo;

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
public class {ClassName}Vo {
{voFields}
}`,

  queryService: `package com.example.service;

import com.example.dao.{ClassName}Dao;
import com.example.dto.{ClassName}Dto;
import com.example.vo.{ClassName}Vo;
import com.example.mapper.{ClassName}Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class {ClassName}QueryService {
    
    @Autowired
    private {ClassName}Dao {variableName}Dao;
    
    @Autowired
    private {ClassName}Mapper {variableName}Mapper;
    
    public List<{ClassName}Dto> get{ClassName}List({ClassName}Dto searchDto) {
        {ClassName}Vo searchVo = {variableName}Mapper.toVo(searchDto);
        List<{ClassName}Vo> voList = {variableName}Dao.select{ClassName}List(searchVo);
        return {variableName}Mapper.toDtoList(voList);
    }
    
    public {ClassName}Dto get{ClassName}(Long id) {
        {ClassName}Vo vo = {variableName}Dao.select{ClassName}(id);
        return {variableName}Mapper.toDto(vo);
    }
}`,

  commandService: `package com.example.service;

import com.example.dao.{ClassName}Dao;
import com.example.dto.{ClassName}Dto;
import com.example.vo.{ClassName}Vo;
import com.example.mapper.{ClassName}Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class {ClassName}CommandService {
    
    @Autowired
    private {ClassName}Dao {variableName}Dao;
    
    @Autowired
    private {ClassName}Mapper {variableName}Mapper;
    
    public int create{ClassName}({ClassName}Dto dto) {
        {ClassName}Vo vo = {variableName}Mapper.toVo(dto);
        return {variableName}Dao.insert{ClassName}(vo);
    }
    
    public int update{ClassName}({ClassName}Dto dto) {
        {ClassName}Vo vo = {variableName}Mapper.toVo(dto);
        return {variableName}Dao.update{ClassName}(vo);
    }
    
    public int delete{ClassName}(Long id) {
        return {variableName}Dao.delete{ClassName}(id);
    }
}`,

  dao: `package com.example.dao;

import com.example.vo.{ClassName}Vo;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface {ClassName}Dao {
    
    List<{ClassName}Vo> select{ClassName}List({ClassName}Vo searchVo);
    
    {ClassName}Vo select{ClassName}(Long id);
    
    int insert{ClassName}({ClassName}Vo vo);
    
    int update{ClassName}({ClassName}Vo vo);
    
    int delete{ClassName}(Long id);
}`,

  mybatisXml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.dao.{ClassName}Dao">

    <resultMap id="{variableName}ResultMap" type="com.example.vo.{ClassName}Vo">
{resultMapFields}
    </resultMap>

    <select id="select{ClassName}List" parameterType="com.example.vo.{ClassName}Vo" resultMap="{variableName}ResultMap">
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

    <insert id="insert{ClassName}" parameterType="com.example.vo.{ClassName}Vo">
        INSERT INTO {tableName} (
{insertFields}
        ) VALUES (
{insertValues}
        )
    </insert>

    <update id="update{ClassName}" parameterType="com.example.vo.{ClassName}Vo">
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

</mapper>`,

  test: `package com.example.service;

import com.example.dto.{ClassName}Dto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
public class {ClassName}ServiceTest {
    
    @Autowired
    private {ClassName}QueryService queryService;
    
    @Autowired
    private {ClassName}CommandService commandService;
    
    @Test
    @DisplayName("{ClassName} 생성 테스트")
    void create{ClassName}Test() {
        // given
        {ClassName}Dto dto = {ClassName}Dto.builder()
{testDataFields}
                .build();
        
        // when
        int result = commandService.create{ClassName}(dto);
        
        // then
        assertThat(result).isEqualTo(1);
    }
    
    @Test
    @DisplayName("{ClassName} 조회 테스트")
    void get{ClassName}Test() {
        // given
        {ClassName}Dto dto = {ClassName}Dto.builder()
{testDataFields}
                .build();
        commandService.create{ClassName}(dto);
        
        // when
        List<{ClassName}Dto> list = queryService.get{ClassName}List(new {ClassName}Dto());
        
        // then
        assertThat(list).isNotEmpty();
    }
    
    @Test
    @DisplayName("{ClassName} 수정 테스트")
    void update{ClassName}Test() {
        // given
        {ClassName}Dto dto = {ClassName}Dto.builder()
{testDataFields}
                .build();
        commandService.create{ClassName}(dto);
        
        List<{ClassName}Dto> list = queryService.get{ClassName}List(new {ClassName}Dto());
        {ClassName}Dto savedDto = list.get(0);
        
        // when
        savedDto.set{firstStringField}("수정된 값");
        int result = commandService.update{ClassName}(savedDto);
        
        // then
        assertThat(result).isEqualTo(1);
    }
    
    @Test
    @DisplayName("{ClassName} 삭제 테스트")
    void delete{ClassName}Test() {
        // given
        {ClassName}Dto dto = {ClassName}Dto.builder()
{testDataFields}
                .build();
        commandService.create{ClassName}(dto);
        
        List<{ClassName}Dto> list = queryService.get{ClassName}List(new {ClassName}Dto());
        Long id = list.get(0).getId();
        
        // when
        int result = commandService.delete{ClassName}(id);
        
        // then
        assertThat(result).isEqualTo(1);
    }
}`
};

const LOCALSTORAGE_KEY = 'springMvcGeneratorTemplates';

const SpringMvcGeneratorPage: React.FC = () => {
  const [ddlInput, setDdlInput] = useState<string>('');
  const [templates, setTemplates] = useState<Templates>(DEFAULT_TEMPLATES);
  const [generatedCode, setGeneratedCode] = useState<GeneratedFiles>({
    apiController: '',
    viewController: '',
    actionController: '',
    dto: '',
    mapstruct: '',
    vo: '',
    queryService: '',
    commandService: '',
    dao: '',
    mybatisXml: '',
    test: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  // localStorage에서 템플릿 불러오기
  useEffect(() => {
    const savedTemplates = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        setTemplates(parsedTemplates);
      } catch (error) {
        console.error('Failed to load templates from localStorage:', error);
      }
    }
  }, []);

  // 템플릿 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

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

      // Generate DTO fields with validation annotations
      const dtoFields = tableInfo.columns.map(col => {
        const javaType = col.javaType;
        let field = `    private ${javaType} ${col.fieldName};`;
        
        // Add validation annotations
        if (col.isPrimaryKey) {
          field = `    private ${javaType} id;`;
        } else if (javaType === 'String') {
          field = `    @NotBlank(message = "${col.fieldName}은(는) 필수입니다.")\n    private ${javaType} ${col.fieldName};`;
        } else if (javaType === 'Long' || javaType === 'Integer') {
          field = `    @NotNull(message = "${col.fieldName}은(는) 필수입니다.")\n    @Min(value = 0, message = "${col.fieldName}은(는) 0 이상이어야 합니다.")\n    private ${javaType} ${col.fieldName};`;
        } else if (javaType !== 'LocalDateTime') {
          field = `    @NotNull(message = "${col.fieldName}은(는) 필수입니다.")\n    private ${javaType} ${col.fieldName};`;
        }
        
        return field;
      }).join('\n');

      // Generate VO fields (without validation)
      const voFields = tableInfo.columns.map(col => {
        if (col.isPrimaryKey) {
          return `    private ${col.javaType} id;`;
        }
        return `    private ${col.javaType} ${col.fieldName};`;
      }).join('\n');

      // Generate MyBatis XML fields
      const resultMapFields = tableInfo.columns.map(col => {
        if (col.isPrimaryKey) {
          return `        <id column="${col.name}" property="id" />`;
        }
        return `        <result column="${col.name}" property="${col.fieldName}" />`;
      }).join('\n');

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
        .filter(col => col.javaType === 'String' && !col.isPrimaryKey)
        .map(col => `            <if test="${col.fieldName} != null and ${col.fieldName} != ''">\n                AND ${col.name} LIKE CONCAT('%', #{${col.fieldName}}, '%')\n            </if>`)
        .join('\n');

      const primaryKey = tableInfo.columns.find(col => col.isPrimaryKey)?.name || 'id';

      // Generate test data fields
      const testDataFields = tableInfo.columns
        .filter(col => !col.isPrimaryKey && col.javaType !== 'LocalDateTime')
        .map(col => {
          if (col.javaType === 'String') {
            return `                .${col.fieldName}("test_${col.fieldName}")`;
          } else if (col.javaType === 'Long' || col.javaType === 'Integer') {
            return `                .${col.fieldName}(1L)`;
          } else if (col.javaType === 'Boolean') {
            return `                .${col.fieldName}(true)`;
          } else {
            return `                .${col.fieldName}(null)`;
          }
        })
        .join('\n');

      // Find first string field for update test
      const firstStringField = tableInfo.columns
        .find(col => col.javaType === 'String' && !col.isPrimaryKey)?.fieldName || 'name';

      // Replace placeholders in templates
      const replacePlaceholders = (template: string): string => {
        return template
          .replace(/{ClassName}/g, tableInfo.className)
          .replace(/{className}/g, tableInfo.className)
          .replace(/{variableName}/g, tableInfo.variableName)
          .replace(/{tableName}/g, tableInfo.tableName)
          .replace(/{dtoFields}/g, dtoFields)
          .replace(/{voFields}/g, voFields)
          .replace(/{resultMapFields}/g, resultMapFields)
          .replace(/{selectFields}/g, selectFields)
          .replace(/{insertFields}/g, insertFields)
          .replace(/{insertValues}/g, insertValues)
          .replace(/{updateFields}/g, updateFields)
          .replace(/{whereConditions}/g, whereConditions)
          .replace(/{primaryKey}/g, primaryKey)
          .replace(/{testDataFields}/g, testDataFields)
          .replace(/{firstStringField}/g, toPascalCase(firstStringField));
      };

      setGeneratedCode({
        apiController: replacePlaceholders(templates.apiController),
        viewController: replacePlaceholders(templates.viewController),
        actionController: replacePlaceholders(templates.actionController),
        dto: replacePlaceholders(templates.dto),
        mapstruct: replacePlaceholders(templates.mapstruct),
        vo: replacePlaceholders(templates.vo),
        queryService: replacePlaceholders(templates.queryService),
        commandService: replacePlaceholders(templates.commandService),
        dao: replacePlaceholders(templates.dao),
        mybatisXml: replacePlaceholders(templates.mybatisXml),
        test: replacePlaceholders(templates.test)
      });

      message.success('Spring MVC 코드가 생성되었습니다!');
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
      apiController: '',
      viewController: '',
      actionController: '',
      dto: '',
      mapstruct: '',
      vo: '',
      queryService: '',
      commandService: '',
      dao: '',
      mybatisXml: '',
      test: ''
    });
  };

  const exportTemplates = () => {
    const dataStr = JSON.stringify(templates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'spring-mvc-templates.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    message.success('템플릿 설정이 다운로드되었습니다.');
  };

  const importTemplates: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTemplates = JSON.parse(content);
        setTemplates(importedTemplates);
        message.success('템플릿 설정을 불러왔습니다.');
        onSuccess?.({});
      } catch (error) {
        message.error('템플릿 파일을 읽을 수 없습니다.');
        onError?.(error as Error);
      }
    };
    reader.readAsText(file as Blob);
  };

  const resetTemplates = () => {
    Modal.confirm({
      title: '템플릿 초기화',
      content: '모든 템플릿 설정을 기본값으로 초기화하시겠습니까?',
      okText: '초기화',
      cancelText: '취소',
      onOk() {
        setTemplates(DEFAULT_TEMPLATES);
        localStorage.removeItem(LOCALSTORAGE_KEY);
        message.success('템플릿이 초기화되었습니다.');
      }
    });
  };

  const exampleDDL = `CREATE TABLE user_info (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    user_role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);`;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <CodeOutlined /> Spring MVC Generator
      </Title>
      <Text type="secondary">
        DDL을 입력하면 Spring MVC 패턴의 Controller (API/View/Action), Service (Query/Command), DAO, DTO, VO, MapStruct, MyBatis XML, Test 코드를 자동으로 생성합니다.
      </Text>

      <Alert
        message="템플릿 커스터마이징"
        description="아래 템플릿 설정에서 각 파일의 템플릿을 수정할 수 있습니다. 수정된 템플릿은 자동으로 localStorage에 저장되며, JSON 파일로 내보내기/불러오기가 가능합니다."
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
            <Tabs defaultActiveKey="apiController">
              <TabPane tab="API Controller" key="apiController">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.apiController)}
                      disabled={!generatedCode.apiController}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.apiController}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="View Controller" key="viewController">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.viewController)}
                      disabled={!generatedCode.viewController}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.viewController}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="Action Controller" key="actionController">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.actionController)}
                      disabled={!generatedCode.actionController}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.actionController}
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

              <TabPane tab="MapStruct" key="mapstruct">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.mapstruct)}
                      disabled={!generatedCode.mapstruct}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.mapstruct}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="VO" key="vo">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.vo)}
                      disabled={!generatedCode.vo}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.vo}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>
              
              <TabPane tab="Query Service" key="queryService">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.queryService)}
                      disabled={!generatedCode.queryService}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.queryService}
                    readOnly
                    style={{ fontFamily: 'monospace' }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="Command Service" key="commandService">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.commandService)}
                      disabled={!generatedCode.commandService}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.commandService}
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

              <TabPane tab="Test" key="test">
                <Card 
                  size="small"
                  extra={
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedCode.test)}
                      disabled={!generatedCode.test}
                      size="small"
                    >
                      복사
                    </Button>
                  }
                >
                  <TextArea
                    rows={20}
                    value={generatedCode.test}
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
            <Panel 
              header="템플릿 설정" 
              key="templates"
              extra={
                <Space onClick={(e) => e.stopPropagation()}>
                  <Button 
                    icon={<DownloadOutlined />} 
                    size="small"
                    onClick={exportTemplates}
                  >
                    내보내기
                  </Button>
                  <Upload
                    customRequest={importTemplates}
                    showUploadList={false}
                    accept=".json"
                  >
                    <Button icon={<UploadOutlined />} size="small">
                      불러오기
                    </Button>
                  </Upload>
                  <Button 
                    icon={<ClearOutlined />} 
                    size="small"
                    danger
                    onClick={resetTemplates}
                  >
                    초기화
                  </Button>
                </Space>
              }
            >
              <Tabs>
                <TabPane tab="API Controller" key="apiControllerTemplate">
                  <TextArea
                    rows={15}
                    value={templates.apiController}
                    onChange={(e) => setTemplates({...templates, apiController: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>

                <TabPane tab="View Controller" key="viewControllerTemplate">
                  <TextArea
                    rows={15}
                    value={templates.viewController}
                    onChange={(e) => setTemplates({...templates, viewController: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>

                <TabPane tab="Action Controller" key="actionControllerTemplate">
                  <TextArea
                    rows={15}
                    value={templates.actionController}
                    onChange={(e) => setTemplates({...templates, actionController: e.target.value})}
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

                <TabPane tab="MapStruct Template" key="mapstructTemplate">
                  <TextArea
                    rows={15}
                    value={templates.mapstruct}
                    onChange={(e) => setTemplates({...templates, mapstruct: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>

                <TabPane tab="VO Template" key="voTemplate">
                  <TextArea
                    rows={15}
                    value={templates.vo}
                    onChange={(e) => setTemplates({...templates, vo: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>
                
                <TabPane tab="Query Service" key="queryServiceTemplate">
                  <TextArea
                    rows={15}
                    value={templates.queryService}
                    onChange={(e) => setTemplates({...templates, queryService: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>

                <TabPane tab="Command Service" key="commandServiceTemplate">
                  <TextArea
                    rows={15}
                    value={templates.commandService}
                    onChange={(e) => setTemplates({...templates, commandService: e.target.value})}
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
                
                <TabPane tab="MyBatis XML" key="mybatisXmlTemplate">
                  <TextArea
                    rows={20}
                    value={templates.mybatisXml}
                    onChange={(e) => setTemplates({...templates, mybatisXml: e.target.value})}
                    style={{ fontFamily: 'monospace' }}
                  />
                </TabPane>

                <TabPane tab="Test Template" key="testTemplate">
                  <TextArea
                    rows={20}
                    value={templates.test}
                    onChange={(e) => setTemplates({...templates, test: e.target.value})}
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
                    <li>{'{dtoFields}'} - DTO 필드 목록 (@Valid 어노테이션 포함)</li>
                    <li>{'{voFields}'} - VO 필드 목록</li>
                    <li>{'{primaryKey}'} - 기본키 컬럼명</li>
                    <li>{'{testDataFields}'} - 테스트용 데이터 필드</li>
                    <li>{'{firstStringField}'} - 첫 번째 String 타입 필드명 (PascalCase)</li>
                    <li>MyBatis XML 전용: {'{selectFields}'}, {'{insertFields}'}, {'{insertValues}'}, {'{updateFields}'}, {'{whereConditions}'}, {'{resultMapFields}'}</li>
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

export default SpringMvcGeneratorPage;