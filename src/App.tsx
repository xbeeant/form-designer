import FormDesigner from "./components/FormDesigner";
import { Layout, Typography } from "antd";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout className="h-screen">
      <Header className="flex items-center bg-white shadow-sm">
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
          表单设计器
          <span className="ml-2 text-sm font-normal text-gray-500">
            支持拖拽排序和属性编辑
          </span>
        </Title>
      </Header>
      <Content className="h-full">
        <FormDesigner />
      </Content>
    </Layout>
  );
}

export default App;
