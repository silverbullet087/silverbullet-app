import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Space, Typography, message, Tabs, Checkbox, Collapse, Alert, Modal } from 'antd';
import { CopyOutlined, CodeOutlined, SettingOutlined, SaveOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { confirm } = Modal;

interface Template {
  id: number;
  name: string;
  content: string;
  enabled: boolean;
}

interface ReplaceKeyword {
  keyword: string;
  replacement: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 1,
    name: "기본 JSP 레이아웃",
    enabled: true,
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{TITLE}</title>
    <script src="/js/jquery-3.6.0.min.js"></script>
    <script src="/js/common.js"></script>
    <link rel="stylesheet" href="/css/common.css">
</head>
<body>
    <div class="container">
        <h1>{PAGE_TITLE}</h1>
        <div class="content">
            <!-- Content goes here -->
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 2,
    name: "목록 페이지 템플릿",
    enabled: true,
    content: `<div class="search-area">
    <form id="{FORM_ID}">
        <table class="search-table">
            <tr>
                <th>{SEARCH_LABEL}</th>
                <td><input type="text" name="{SEARCH_FIELD}" id="{SEARCH_FIELD}" /></td>
                <td>
                    <button type="button" onclick="{SEARCH_FUNCTION}()">검색</button>
                    <button type="reset">초기화</button>
                </td>
            </tr>
        </table>
    </form>
</div>

<div class="list-area">
    <table id="{TABLE_ID}" class="data-table">
        <thead>
            <tr>
                <th>순번</th>
                <th>{COLUMN_NAME}</th>
                <th>등록일</th>
            </tr>
        </thead>
        <tbody>
            <!-- Data will be loaded here -->
        </tbody>
    </table>
</div>`
  },
  {
    id: 3,
    name: "상세/등록 폼 템플릿",
    enabled: true,
    content: `<form id="{FORM_ID}">
    <input type="hidden" name="{ID_FIELD}" id="{ID_FIELD}" />
    
    <table class="form-table">
        <tr>
            <th class="required">{FIELD_LABEL}</th>
            <td>
                <input type="text" name="{FIELD_NAME}" id="{FIELD_NAME}" required />
            </td>
        </tr>
        <tr>
            <th>설명</th>
            <td>
                <textarea name="{DESCRIPTION_FIELD}" id="{DESCRIPTION_FIELD}" rows="3"></textarea>
            </td>
        </tr>
    </table>
    
    <div class="btn-area">
        <button type="button" onclick="{SAVE_FUNCTION}()">저장</button>
        <button type="button" onclick="{CANCEL_FUNCTION}()">취소</button>
    </div>
</form>`
  },
  {
    id: 4,
    name: "jQuery AJAX 목록 조회",
    enabled: true,
    content: `function {SEARCH_FUNCTION}() {
    var searchData = $("#{FORM_ID}").serialize();
    
    $.ajax({
        url: "/{API_PATH}/list",
        type: "GET",
        data: searchData,
        success: function(response) {
            if (response.success) {
                draw{TABLE_NAME}List(response.data);
            } else {
                alert("조회 중 오류가 발생했습니다.");
            }
        },
        error: function() {
            alert("시스템 오류가 발생했습니다.");
        }
    });
}

function draw{TABLE_NAME}List(dataList) {
    var tbody = $("#{TABLE_ID} tbody");
    tbody.empty();
    
    if (dataList.length === 0) {
        tbody.append("<tr><td colspan='3'>조회된 데이터가 없습니다.</td></tr>");
        return;
    }
    
    $.each(dataList, function(index, item) {
        var row = "<tr>";
        row += "<td>" + (index + 1) + "</td>";
        row += "<td><a href='javascript:view{ENTITY_NAME}(" + item.{ID_FIELD} + ")'>" + item.{DISPLAY_FIELD} + "</a></td>";
        row += "<td>" + formatDate(item.createdAt) + "</td>";
        row += "</tr>";
        tbody.append(row);
    });
}`
  },
  {
    id: 5,
    name: "jQuery AJAX 저장/수정",
    enabled: true,
    content: `function {SAVE_FUNCTION}() {
    if (!validate{FORM_NAME}()) {
        return;
    }
    
    var formData = $("#{FORM_ID}").serialize();
    var isUpdate = $("#{ID_FIELD}").val() !== "";
    var url = isUpdate ? "/{API_PATH}/update" : "/{API_PATH}/create";
    var method = isUpdate ? "PUT" : "POST";
    
    $.ajax({
        url: url,
        type: method,
        data: formData,
        success: function(response) {
            if (response.success) {
                alert(isUpdate ? "수정되었습니다." : "등록되었습니다.");
                {AFTER_SAVE_ACTION}
            } else {
                alert(response.message || "저장 중 오류가 발생했습니다.");
            }
        },
        error: function() {
            alert("시스템 오류가 발생했습니다.");
        }
    });
}

function validate{FORM_NAME}() {
    var {FIELD_NAME} = $("#{FIELD_NAME}").val().trim();
    
    if ({FIELD_NAME} === "") {
        alert("{FIELD_LABEL}을(를) 입력해주세요.");
        $("#{FIELD_NAME}").focus();
        return false;
    }
    
    return true;
}`
  },
  {
    id: 6,
    name: "jQuery AJAX 상세 조회",
    enabled: true,
    content: `function view{ENTITY_NAME}(id) {
    $.ajax({
        url: "/{API_PATH}/" + id,
        type: "GET",
        success: function(response) {
            if (response.success) {
                fill{FORM_NAME}(response.data);
                show{ENTITY_NAME}Modal();
            } else {
                alert("조회 중 오류가 발생했습니다.");
            }
        },
        error: function() {
            alert("시스템 오류가 발생했습니다.");
        }
    });
}

function fill{FORM_NAME}(data) {
    $("#{ID_FIELD}").val(data.{ID_FIELD});
    $("#{FIELD_NAME}").val(data.{FIELD_NAME});
    $("#{DESCRIPTION_FIELD}").val(data.{DESCRIPTION_FIELD});
    
    // 읽기 전용으로 설정 (수정 모드에서는 제거)
    $("#{FORM_ID} input, #{FORM_ID} textarea").prop("readonly", true);
}`
  },
  {
    id: 7,
    name: "jQuery AJAX 삭제",
    enabled: true,
    content: `function delete{ENTITY_NAME}(id) {
    if (!confirm("정말 삭제하시겠습니까?")) {
        return;
    }
    
    $.ajax({
        url: "/{API_PATH}/" + id,
        type: "DELETE",
        success: function(response) {
            if (response.success) {
                alert("삭제되었습니다.");
                {SEARCH_FUNCTION}(); // 목록 새로고침
            } else {
                alert(response.message || "삭제 중 오류가 발생했습니다.");
            }
        },
        error: function() {
            alert("시스템 오류가 발생했습니다.");
        }
    });
}`
  },
  {
    id: 8,
    name: "모달 팝업 템플릿",
    enabled: true,
    content: `<div id="{MODAL_ID}" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3>{MODAL_TITLE}</h3>
            <span class="close" onclick="close{MODAL_NAME}()">&times;</span>
        </div>
        <div class="modal-body">
            <!-- Modal content goes here -->
        </div>
        <div class="modal-footer">
            <button type="button" onclick="{CONFIRM_FUNCTION}()">확인</button>
            <button type="button" onclick="close{MODAL_NAME}()">취소</button>
        </div>
    </div>
</div>

<script>
function show{MODAL_NAME}() {
    $("#{MODAL_ID}").show();
}

function close{MODAL_NAME}() {
    $("#{MODAL_ID}").hide();
    $("#{FORM_ID}")[0].reset();
}
</script>`
  },
  {
    id: 9,
    name: "페이징 처리 템플릿",
    enabled: true,
    content: `<div class="pagination">
    <span class="page-info">
        총 <strong>{TOTAL_COUNT}</strong>건 (페이지 <strong>{CURRENT_PAGE}</strong> / <strong>{TOTAL_PAGES}</strong>)
    </span>
    <div class="page-links">
        <a href="javascript:goPage(1)" class="first">처음</a>
        <a href="javascript:goPage({PREV_PAGE})" class="prev">이전</a>
        
        <span class="page-numbers">
            <!-- Page numbers will be generated here -->
        </span>
        
        <a href="javascript:goPage({NEXT_PAGE})" class="next">다음</a>
        <a href="javascript:goPage({TOTAL_PAGES})" class="last">마지막</a>
    </div>
</div>

<script>
function goPage(page) {
    $("#currentPage").val(page);
    {SEARCH_FUNCTION}();
}

function drawPagination(pageInfo) {
    var pagination = $(".pagination");
    // 페이징 정보 업데이트
    pagination.find(".page-info").html(
        "총 <strong>" + pageInfo.totalCount + "</strong>건 " +
        "(페이지 <strong>" + pageInfo.currentPage + "</strong> / <strong>" + pageInfo.totalPages + "</strong>)"
    );
}
</script>`
  },
  {
    id: 10,
    name: "공통 유틸리티 함수",
    enabled: true,
    content: `// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return "";
    var date = new Date(dateString);
    return date.getFullYear() + "-" + 
           String(date.getMonth() + 1).padStart(2, "0") + "-" + 
           String(date.getDate()).padStart(2, "0");
}

// 날짜시간 포맷팅
function formatDateTime(dateString) {
    if (!dateString) return "";
    var date = new Date(dateString);
    return formatDate(dateString) + " " + 
           String(date.getHours()).padStart(2, "0") + ":" + 
           String(date.getMinutes()).padStart(2, "0");
}

// 숫자 콤마 포맷팅
function formatNumber(num) {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 폼 초기화
function reset{FORM_NAME}() {
    $("#{FORM_ID}")[0].reset();
    $("#{FORM_ID} input[type='hidden']").val("");
}

// 로딩 표시
function showLoading() {
    // 로딩 스피너 표시
}

function hideLoading() {
    // 로딩 스피너 숨김
}`
  }
];

const EXAMPLE_KEYWORDS: ReplaceKeyword[] = [
  { keyword: "{TITLE}", replacement: "사용자 관리" },
  { keyword: "{PAGE_TITLE}", replacement: "사용자 목록" },
  { keyword: "{FORM_ID}", replacement: "userForm" },
  { keyword: "{TABLE_ID}", replacement: "userTable" },
  { keyword: "{ENTITY_NAME}", replacement: "User" },
  { keyword: "{API_PATH}", replacement: "api/users" },
  { keyword: "{ID_FIELD}", replacement: "userId" },
  { keyword: "{FIELD_NAME}", replacement: "userName" },
  { keyword: "{FIELD_LABEL}", replacement: "사용자명" },
  { keyword: "{SEARCH_FIELD}", replacement: "searchKeyword" },
  { keyword: "{SEARCH_LABEL}", replacement: "사용자명" },
  { keyword: "{SEARCH_FUNCTION}", replacement: "searchUsers" },
  { keyword: "{SAVE_FUNCTION}", replacement: "saveUser" },
  { keyword: "{CANCEL_FUNCTION}", replacement: "cancelUser" },
  { keyword: "{TABLE_NAME}", replacement: "User" },
  { keyword: "{DISPLAY_FIELD}", replacement: "userName" },
  { keyword: "{FORM_NAME}", replacement: "UserForm" },
  { keyword: "{AFTER_SAVE_ACTION}", replacement: "searchUsers();" },
  { keyword: "{DESCRIPTION_FIELD}", replacement: "description" },
  { keyword: "{MODAL_ID}", replacement: "userModal" },
  { keyword: "{MODAL_NAME}", replacement: "UserModal" },
  { keyword: "{MODAL_TITLE}", replacement: "사용자 정보" },
  { keyword: "{CONFIRM_FUNCTION}", replacement: "saveUser" },
  { keyword: "{COLUMN_NAME}", replacement: "사용자명" },
  { keyword: "{TOTAL_COUNT}", replacement: "totalCount" },
  { keyword: "{CURRENT_PAGE}", replacement: "currentPage" },
  { keyword: "{TOTAL_PAGES}", replacement: "totalPages" },
  { keyword: "{PREV_PAGE}", replacement: "prevPage" },
  { keyword: "{NEXT_PAGE}", replacement: "nextPage" }
];

const JspJqueryTemplateGeneratorPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [keywords, setKeywords] = useState<ReplaceKeyword[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [keywordInput, setKeywordInput] = useState<string>('');

  // localStorage에서 템플릿 불러오기
  useEffect(() => {
    const savedTemplates = localStorage.getItem('jspJqueryTemplates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('템플릿 로드 오류:', error);
      }
    }
  }, []);

  // 템플릿을 localStorage에 저장
  const saveTemplates = () => {
    try {
      localStorage.setItem('jspJqueryTemplates', JSON.stringify(templates));
      message.success('템플릿이 저장되었습니다.');
    } catch (error) {
      message.error('템플릿 저장 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 초기화
  const resetTemplates = () => {
    confirm({
      title: '템플릿 초기화',
      icon: <ExclamationCircleOutlined />,
      content: '모든 템플릿을 기본값으로 초기화하시겠습니까?',
      okText: '초기화',
      cancelText: '취소',
      onOk() {
        setTemplates(DEFAULT_TEMPLATES);
        localStorage.removeItem('jspJqueryTemplates');
        message.success('템플릿이 초기화되었습니다.');
      }
    });
  };

  // 키워드 파싱
  const parseKeywords = (input: string): ReplaceKeyword[] => {
    const lines = input.split('\n').filter(line => line.trim());
    const result: ReplaceKeyword[] = [];
    
    for (const line of lines) {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const keyword = parts[0].trim();
        const replacement = parts.slice(1).join('=').trim();
        result.push({ keyword, replacement });
      }
    }
    
    return result;
  };

  // 코드 생성
  const generateCode = () => {
    if (keywords.length === 0) {
      message.warning('키워드를 입력해주세요.');
      return;
    }

    const enabledTemplates = templates.filter(t => t.enabled);
    if (enabledTemplates.length === 0) {
      message.warning('최소 하나의 템플릿을 선택해주세요.');
      return;
    }

    let result = '';
    
    enabledTemplates.forEach((template, index) => {
      if (index > 0) result += '\n\n' + '='.repeat(50) + '\n';
      result += `<!-- ${template.name} -->\n\n`;
      
      let content = template.content;
      
      // 키워드 치환
      keywords.forEach(({ keyword, replacement }) => {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, replacement);
      });
      
      result += content;
    });

    setGeneratedCode(result);
    message.success('코드가 생성되었습니다!');
  };

  // 템플릿 체크박스 변경
  const handleTemplateCheck = (templateId: number, checked: boolean) => {
    setTemplates(prev => 
      prev.map(t => t.id === templateId ? { ...t, enabled: checked } : t)
    );
  };

  // 템플릿 내용 변경
  const handleTemplateChange = (templateId: number, content: string) => {
    setTemplates(prev => 
      prev.map(t => t.id === templateId ? { ...t, content } : t)
    );
  };

  // 예제 키워드 적용
  const applyExampleKeywords = () => {
    const exampleKeywordText = EXAMPLE_KEYWORDS
      .map(k => `${k.keyword}=${k.replacement}`)
      .join('\n');
    setKeywordInput(exampleKeywordText);
    setKeywords(EXAMPLE_KEYWORDS);
    message.success('예제 키워드가 적용되었습니다.');
  };

  // 키워드 입력 처리
  const handleKeywordInputChange = (value: string) => {
    setKeywordInput(value);
    setKeywords(parseKeywords(value));
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      message.success('클립보드에 복사되었습니다!');
    }
  };

  const clearAll = () => {
    setKeywordInput('');
    setKeywords([]);
    setGeneratedCode('');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <CodeOutlined /> JSP + jQuery Template Generator
      </Title>
      <Text type="secondary">
        JSP + jQuery 개발 시 반복적인 코드 작성을 자동화하는 도구입니다. 템플릿을 선택하고 키워드를 치환하여 코드를 생성합니다.
      </Text>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="키워드 설정"
            extra={
              <Space>
                <Button size="small" onClick={applyExampleKeywords}>
                  예제 적용
                </Button>
                <Button size="small" onClick={clearAll}>
                  초기화
                </Button>
              </Space>
            }
          >
            <Alert
              message="키워드 입력 형식"
              description="키워드=치환값 형태로 한 줄씩 입력하세요. 예: {TITLE}=사용자 관리"
              type="info"
              style={{ marginBottom: '16px' }}
            />
            <TextArea
              rows={12}
              value={keywordInput}
              onChange={(e) => handleKeywordInputChange(e.target.value)}
              placeholder="{TITLE}=사용자 관리&#10;{ENTITY_NAME}=User&#10;{API_PATH}=api/users&#10;..."
              style={{ fontFamily: 'monospace' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text strong>파싱된 키워드: </Text>
              <Text>{keywords.length}개</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="템플릿 선택"
            extra={
              <Space>
                <Button 
                  icon={<SaveOutlined />} 
                  size="small" 
                  onClick={saveTemplates}
                >
                  저장
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  size="small" 
                  onClick={resetTemplates}
                >
                  초기화
                </Button>
              </Space>
            }
          >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {templates.map(template => (
                <div key={template.id} style={{ marginBottom: '8px' }}>
                  <Checkbox
                    checked={template.enabled}
                    onChange={(e) => handleTemplateCheck(template.id, e.target.checked)}
                  >
                    {template.name}
                  </Checkbox>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<CodeOutlined />}
                onClick={generateCode}
                size="large"
              >
                코드 생성
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card 
            title="생성된 코드"
            extra={
              <Button 
                icon={<CopyOutlined />} 
                onClick={copyToClipboard}
                disabled={!generatedCode}
              >
                복사
              </Button>
            }
          >
            <TextArea
              rows={20}
              value={generatedCode}
              readOnly
              placeholder="키워드를 설정하고 템플릿을 선택한 후 '코드 생성' 버튼을 클릭하세요."
              style={{ fontFamily: 'monospace' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Collapse>
            <Panel header={<><SettingOutlined /> 템플릿 편집</>} key="templates">
              <Tabs>
                {templates.map(template => (
                  <TabPane tab={template.name} key={template.id.toString()}>
                    <TextArea
                      rows={15}
                      value={template.content}
                      onChange={(e) => handleTemplateChange(template.id, e.target.value)}
                      style={{ fontFamily: 'monospace' }}
                    />
                  </TabPane>
                ))}
              </Tabs>
              <Alert
                message="템플릿 편집 안내"
                description="템플릿을 수정한 후 반드시 '저장' 버튼을 클릭하여 localStorage에 저장하세요."
                type="warning"
                style={{ marginTop: '16px' }}
              />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default JspJqueryTemplateGeneratorPage;