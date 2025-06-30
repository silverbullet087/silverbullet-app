import React, {useState} from "react";
import {ConfigProvider, Layout, Menu, Space, Switch as AntSwitch, theme} from "antd";
import BookmarkPage from "./pages/BookmarkGrid/BookmarkPage";
import Viewer from "./pages/Viewer/Viewer";
import {BrowserRouter as Router, Route, Switch, useHistory} from "react-router-dom";
import SidebarMenu from "./pages/menu/SidebarMenu";
import ChartSamplePage from "./pages/ChartSample/ChartSamplePage";
import Title from "antd/lib/typography/Title";
import SrtTranslationToolPage from "./pages/SrtTranslationTool/SrtTranslationToolPage";
import CodeGeneratorPage from "./pages/CodeGenerator/CodeGeneratorPage";
import HomePage from "./pages/home/HomePage";
import DdlToJsonPage from "./pages/ddlToJson/DdlToJsonPage";
import SelectToJavaDtoPage from "./pages/selectToJavaDto/SelectToJavaDtoPage";
import SpringCrudGeneratorPage from "./pages/springCrudGenerator/SpringCrudGeneratorPage";
import TypeIt from "typeit-react";

const {Header, Content, Sider} = Layout;

const DEFAULT_LIGHT_COLOR_PRIMARY = '#673ab7';
const DEFAULT_DARK_COLOR_PRIMARY = '#9c27b0';

function App() {

    const [selectedMenuItem, setSelectedMenuItem] = useState("home");
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem("darkTheme") === null ? false : JSON.parse(localStorage.getItem("darkTheme") ?? ''));

    const history = useHistory();

    const [colorPrimary, setColorPrimary] = useState(localStorage.getItem("colorPrimary") === null ? DEFAULT_LIGHT_COLOR_PRIMARY : localStorage.getItem("colorPrimary") ?? DEFAULT_LIGHT_COLOR_PRIMARY);

    const handleThemeChange = (checked: boolean) => {
        setDarkTheme(checked);
        setColorPrimary(checked ? DEFAULT_DARK_COLOR_PRIMARY : DEFAULT_LIGHT_COLOR_PRIMARY);
        localStorage.setItem("darkTheme", checked.toString());
        localStorage.setItem("colorPrimary", checked ? DEFAULT_DARK_COLOR_PRIMARY : DEFAULT_LIGHT_COLOR_PRIMARY);
    };

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
            case "springCrudGenerator":
                history.push("/springCrudGenerator");
                break;
            default:
                break;
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: colorPrimary,
                    colorBgBase: darkTheme ? "#303030" : "#fafafa",
                },
                algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Router>
                <Layout style={{minHeight: "100vh"}}>
                    <Sider breakpoint="lg" collapsedWidth="0" theme={darkTheme ? "dark" : "light"}>
                        <div style={{height: "32px", margin: "16px"}}>
                            <a href="/">
                                <Title level={3} style={{color: darkTheme ? "#fff" : "#001529"}}>
                                    <TypeIt
                                        getBeforeInit={(instance) => {
                                            instance
                                                .delete(13, {instant: true})
                                                .type("ㅇㄷㅍ")
                                                .pause(400)
                                                .delete(3)
                                                .type("Dev")
                                                .pause(360)
                                                .type("Life")
                                                .pause(560)
                                                .pause(520/7)
                                                .type("B")
                                                .pause(210/7)
                                                .type("o")
                                                .pause(72/8)
                                                .type("o")
                                                .pause(410/7)
                                                .type("s")
                                                .pause(80/8)
                                                .type("t")
                                            ;

                                            // Remember to return it!
                                            return instance;
                                        }}

                                    >
                                    </TypeIt>

                                    {/*DevLifeBoost*/}
                                </Title>
                            </a>
                        </div>
                        <Menu
                            theme={darkTheme ? "dark" : "light"}
                            mode="inline"
                            selectedKeys={[selectedMenuItem]}
                            onClick={handleMenuItemClick}
                        >
                            <SidebarMenu/>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header
                            style={{
                                padding: "0 16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: colorPrimary ?? DEFAULT_LIGHT_COLOR_PRIMARY,
                            }}
                        >
                            <Space
                                size="large"
                                style={{width: "100%", justifyContent: "space-between"}}
                            >
                                <Title
                                    level={3}
                                    style={{color: darkTheme ? "#fff" : "#001529"}}
                                ></Title>
                                <AntSwitch
                                    checkedChildren="Dark"
                                    unCheckedChildren="Light"
                                    onChange={handleThemeChange}
                                    defaultChecked={darkTheme}
                                />
                            </Space>
                        </Header>
                        <Content style={{margin: "24px 16px 0"}}>
                            <div style={{padding: 24, minHeight: 360}}>
                                <Switch>
                                    <Route exact path="/" component={HomePage}/>
                                    <Route path="/viewer" component={Viewer}/>
                                    <Route path="/bookmarks" component={BookmarkPage}/>
                                    <Route path="/chartSample" component={ChartSamplePage}/>
                                    <Route path="/srtTranslationTool" component={SrtTranslationToolPage}/>
                                    <Route path="/codeGenerator" component={CodeGeneratorPage}/>
                                    <Route path="/ddlToJson" component={DdlToJsonPage}/>
                                    <Route path="/selectToJavaDto" component={SelectToJavaDtoPage}/>
                                    <Route path="/springCrudGenerator" component={SpringCrudGeneratorPage}/>
                                </Switch>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
        </ConfigProvider>

    );
}

export default App;
