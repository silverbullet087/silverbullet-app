import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Menu} from "antd";
import {BarChartOutlined, BookOutlined, FileImageOutlined, HomeOutlined, TranslationOutlined, CodeOutlined, DatabaseOutlined} from "@ant-design/icons";

const SidebarMenu: React.FC = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState("home");
    const history = useHistory();

    const handleMenuItemClick = (e: any) => {
        setSelectedMenuItem(e.key);

        switch (e.key) {
            case "home":
                history.push("/");
                break;
            case "viewer":
                history.push("/viewer");
                break;
            case "bookmarks":
                history.push("/bookmarks");
                break;
            case "chartSample":
                history.push("/chartSample");
                break;
            case "srtTranslationTool":
                history.push("/srtTranslationTool");
                break;
            case "codeGenerator":
                history.push("/codeGenerator");
                break;
            case "ddlToJson":
                history.push("/ddlToJson");
                break;
            case "selectToJavaDto":
                history.push("/selectToJavaDto");
                break;

            default:
                break;
        }
    };

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenuItem]}
            onClick={handleMenuItemClick}
        >
            <Menu.Item key="home" icon={<HomeOutlined/>}>
                홈
            </Menu.Item>
            <Menu.Item key="viewer" icon={<FileImageOutlined/>}>
                만화책 뷰어
            </Menu.Item>
            <Menu.Item key="bookmarks" icon={<BookOutlined/>}>
                북마크
            </Menu.Item>
            <Menu.Item key="chartSample" icon={<BarChartOutlined/>}>
                차트 샘플
            </Menu.Item>
            <Menu.Item key="srtTranslationTool" icon={<TranslationOutlined/>}>
                자막 번역 도구
            </Menu.Item>
            <Menu.Item key="codeGenerator" icon={<CodeOutlined />}>
                코드 생성 툴
            </Menu.Item>
            <Menu.Item key="ddlToJson" icon={<DatabaseOutlined />}>
                DDL to JSON
            </Menu.Item>
            <Menu.Item key="selectToJavaDto" icon={<CodeOutlined />}>
                SELECT to Java DTO
            </Menu.Item>
        </Menu>
    );
};

export default SidebarMenu;
