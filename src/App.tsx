import React, {useState} from "react";
import {Layout, Menu, Space, Button, ConfigProvider, theme, Switch as AntSwitch} from "antd";
import Viewer from "./components/Viewer/Viewer";
import BookmarkPage from "./components/BookmarkGrid/BookmarkPage";
import {BrowserRouter as Router, Route, Switch, useHistory} from "react-router-dom";
import SidebarMenu from "./components/menu/SidebarMenu";
import ChartSamplePage from "./components/ChartSample/ChartSamplePage";
import Title from "antd/lib/typography/Title";

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
            default:
                break;
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: colorPrimary,
                },
                algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Router>
                <Layout style={{minHeight: "100vh"}}>
                    <Sider breakpoint="lg" collapsedWidth="0" theme={darkTheme ? "dark" : "light"}>
                        <div style={{height: "32px", margin: "16px"}}>
                            <Title level={3} style={{color: darkTheme ? "#fff" : "#001529"}}>
                                GOMI-APP
                            </Title>
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
                                    <Route exact path="/" component={BookmarkPage}/>
                                    <Route path="/viewer" component={Viewer}/>
                                    <Route path="/bookmarks" component={BookmarkPage}/>
                                    <Route path="/chartSample" component={ChartSamplePage}/>
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
