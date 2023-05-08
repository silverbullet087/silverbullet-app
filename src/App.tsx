import React, {useState} from "react";
import {Layout, Menu} from "antd";
import {
    FileImageOutlined,
    HomeOutlined,
    BookOutlined,
} from "@ant-design/icons";
import Viewer from "./components/Viewer/Viewer";
import BookmarkPage from "./components/BookmarkGrid/BookmarkPage";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useHistory,
} from "react-router-dom";
import SidebarMenu from "./components/menu/SidebarMenu";
import ChartSamplePage from "./components/ChartSample/ChartSamplePage";

const {Header, Content, Sider} = Layout;

function App() {
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
            default:
                break;
        }
    };

    return (
        <Router>
            <Layout style={{minHeight: "100vh"}}>
                <Sider breakpoint="lg" collapsedWidth="0">
                    <div style={{height: "32px", margin: "16px"}}/>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedMenuItem]}
                        onClick={handleMenuItemClick}
                    >
                        <SidebarMenu/>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: "#fff", padding: 0}}/>
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
    );
}

export default App;
