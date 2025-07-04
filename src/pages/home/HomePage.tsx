import React, {useState} from 'react';
import {Button, Card, Descriptions, Layout, Modal, Typography} from 'antd';
import ThemedTitle from "../../components/ThemedTitle";
import TypeIt from "typeit-react";

const {Header, Content} = Layout;
const {Title, Paragraph} = Typography;

const HomePage = () => {
    const services = [
        {
            title: '만화책 뷰어',
            description: 'DevLifeBoost에서 제공하는 만화책 뷰어는 웹기반으로 개발되어 아이폰, 아이패드 등 모바일 기기와 메타 프로 VR에서 만화책을 볼 수 있습니다. Webp 움직이는 이미지도 지원하고, 사용자는 압축 파일로 되어 있는 만화책을 앱을 통해 쉽게 열람할 수 있습니다. 또한, VR에서는 브라우저 창의 크기를 자유롭게 조절하고, 동시에 여러 창을 띄울 수 있어 해당 웹 만화책 뷰어로 새로운 만화책 보기 경험을 제공합니다. 웹 기반으로 제작되었기 때문에, 어떤 기기에서든 이용 가능합니다.'
        },
        {
            title: '북마크',
            description: 'DevLifeBoost의 북마크 기능은 인터넷 연결이 불가능한 환경에서도 사용이 가능하게 만들어졌습니다. 이 기능은 PWA로 구성되어 PC에 설치가 가능하며, 빌드한 파일을 PC에 저장해서 인터넷이 연결되지 않는 환경에서도 사용할 수 있습니다. 이를 통해 개인화된 북마크 화면을 제공하며, 크롬, 엣지 등의 다양한 브라우저에서도 동일한 화면에 동일한 북마크를 이용할 수 있습니다. 회사 내부에 인터넷이 연결 되지 않는 환경에서 내부망 북마크를 사용 가능합니다.'
        },
        {
            title: '차트 샘플',
            description: '차트 샘플 기능은 HTML로 만든 차트 샘플을 임시로 업로드하고 공유하는 데 사용됩니다. 만약 차트 내용이 만족스럽다면 토이 프로젝트 사이트에 반영할 수 있으며, 이 기능을 통해 주변 지인들에게 사이트 반영 전 해당 차트를 보여줄 수 있습니다.'
        },
        {
            title: '자막 번역 도구',
            description: 'DevLifeBoost의 자막 번역 도구는 파파고, deepl, 구글 번역 등의 번역 서비스에서 제공하는 5,000자 제한을 넘는 번역을 사용할 때 사용합니다. 이 도구는 웹사이트에 자막 내용을 임시로 업로드하고, 웹 브라우저의 번역 기능을 이용하여 글자 수 제한 없이 번역합니다. 번역한 내용은 자막 파일로 받을 수 있어, 매우 편리합니다.'
        },
        {
            title: '코드 생성기',
            description: '코드 생성기는 Java, TypeScript 등의 코드를 생성하는 도구입니다. create DDL SQL을 입력하면, Java DTO 클래스를 생성하고. TypeScript interface을 생성합니다.'
        },
        {
            title: 'DDL to JSON',
            description: '데이터베이스 테이블 DDL을 입력하면 JSON 샘플 데이터를 자동으로 생성하는 도구입니다. 각 컬럼의 데이터 타입에 맞는 샘플 값을 생성하며, 단일 객체와 배열 형태 모두 제공합니다. INT, VARCHAR, DATE, BOOLEAN, JSON 등 다양한 데이터 타입을 지원하고, NULL 값과 기본값도 고려하여 실제와 유사한 테스트 데이터를 생성합니다. 생성된 JSON은 API 개발이나 프론트엔드 개발 시 목업 데이터로 활용할 수 있습니다.'
        },
        {
            title: 'SELECT to Java DTO',
            description: 'SELECT 쿼리를 입력하면 Java DTO 클래스를 자동으로 생성하는 도구입니다. 쿼리의 SELECT 절을 분석하여 필드명과 타입을 추론하고, Lombok 어노테이션이나 getter/setter 메소드를 자동으로 생성합니다. 컬럼명은 자동으로 camelCase로 변환되며, 컬럼명에 따라 적절한 Java 타입(String, Long, BigDecimal, LocalDateTime, Boolean 등)을 추론합니다. 또한 Bean Validation 어노테이션 추가 옵션도 제공하여, 바로 사용 가능한 DTO 클래스를 생성할 수 있습니다.'
        },
        {
            title: 'Spring CRUD Generator',
            description: 'DDL을 입력하면 Spring MVC 기반의 전체 CRUD 코드를 자동으로 생성하는 도구입니다. Controller, Service, DAO, DTO, MyBatis XML 파일을 한번에 생성하며, RESTful API 엔드포인트(리스트 조회, 상세 조회, 등록, 수정, 삭제)가 포함됩니다. 기본 템플릿을 제공하며, 프로젝트에 맞게 템플릿을 커스터마이징할 수 있습니다. 테이블명과 컬럼명을 분석하여 적절한 클래스명, 변수명, 필드명으로 자동 변환하고, MyBatis 동적 쿼리도 자동으로 생성됩니다.'
        },
        {
            title: 'JSP jQuery Template',
            description: 'JSP + jQuery 개발 시 반복적인 코드 작성을 자동화하는 도구입니다. 10가지 기본 템플릿(기본 레이아웃, 목록 페이지, 폼, AJAX 함수, 모달 등)을 제공하며, 키워드 기반으로 템플릿을 커스터마이징할 수 있습니다. 체크박스로 필요한 템플릿만 선택하고, 키워드를 설정하면 자동으로 코드가 생성됩니다. 템플릿은 localStorage에 저장되어 개인화된 설정을 유지할 수 있으며, 단순 반복 업무를 크게 줄일 수 있습니다.'
        },
        {
            title: 'Spring MVC Generator',
            description: 'DDL을 입력하면 Spring MVC 패턴의 전체 계층 구조를 자동 생성하는 고급 도구입니다. API Controller, View Controller, Action Controller 3종의 컨트롤러와 Query/Command 분리된 Service, DTO(검증 어노테이션 포함), VO, MapStruct 매퍼, DAO, MyBatis XML, 그리고 JUnit 테스트 코드까지 총 11개 파일을 한번에 생성합니다. 템플릿 설정을 JSON으로 내보내기/불러오기할 수 있어 팀 단위로 표준화된 코드 템플릿을 공유하고 관리할 수 있으며, localStorage를 활용한 개인화 설정도 지원합니다.'
        }
    ];

    return (
        <Layout>
            <div style={{marginBottom: '10px'}}>
                <ThemedTitle title={'DevLifeBoost'}/>
                <Title level={4}>
                    <TypeIt
                        getBeforeInit={(instance) => {
                            instance
                                .type("<strong>'Dev'</strong>").pause(506)
                                .type("는 개발자를,").pause(450)
                                .type(" <strong>'Life'</strong>").pause(844)
                                .type("sms dlf").pause(335).delete(7).pause(450)
                                .type("는 일상 생활을, ").pause(450)
                                .type("<strong>'Boost'</strong>").pause(536)
                                .type("sms gidtkddlsk rotjsdmf").pause(450)
                                .pause(750).delete(23).pause(500)
                                .type("는 향상이나 개선을 의미합니다. ").pause(400)
                                .type("해당 사이트는 개발자의 일상 생활을 향상시키는 도구를 제공합니다.").pause(600)
                            ;

                            // Remember to return it!
                            return instance;
                        }}

                    >
                    </TypeIt>
                </Title>
            </div>
            <div>
                <Title level={2}>
                    일상을 향상시키는 다양한 도구들
                </Title>

                <div>
                    {services.map((service, index) => (
                        <Card title={service.title} style={{marginBottom: '20px'}} key={index}>
                            <p>{service.description}</p>
                        </Card>
                    ))}
                </div>

            </div>
        </Layout>
    );
};

export default HomePage;
