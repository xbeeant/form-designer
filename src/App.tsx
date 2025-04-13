import FormDesigner from "./components/FormDesigner";
import { Layout } from "antd";
import "./App.css";

const { Content } = Layout;

function App() {
  return (
    <Layout className="h-screen">
      <Content className="h-full">
        <FormDesigner />
      </Content>
    </Layout>
  );
}

export default App;
