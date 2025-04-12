import React, { useState } from "react";
import { Button, Modal, Radio, Space, Typography, message } from "antd";
import {
  SaveOutlined,
  EyeOutlined,
  CopyOutlined,
  ClearOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { FormSchema } from "./types";

const { Title, Paragraph } = Typography;

interface ToolbarProps {
  formSchema: FormSchema;
  onChangeLayout: (layout: "horizontal" | "vertical") => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  formSchema,
  onChangeLayout,
  onClear,
}) => {
  const [jsonModalVisible, setJsonModalVisible] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formSchema, null, 2));
    message.success("JSON已复制到剪贴板");
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b bg-white p-2">
        <Title level={3} style={{ margin: 0 }}>
          可视化表单设计器
        </Title>
        <Space>
          <Radio.Group
            value={formSchema.layout}
            onChange={(e) => onChangeLayout(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="horizontal">水平布局</Radio.Button>
            <Radio.Button value="vertical">垂直布局</Radio.Button>
          </Radio.Group>
          <Button icon={<EyeOutlined />}>预览</Button>
          <Button icon={<SaveOutlined />} type="primary">
            保存
          </Button>
          <Button
            icon={<CodeOutlined />}
            onClick={() => setJsonModalVisible(true)}
          >
            查看JSON
          </Button>
          <Button icon={<ClearOutlined />} danger onClick={onClear}>
            清空
          </Button>
        </Space>
      </div>

      <Modal
        title="表单JSON数据"
        open={jsonModalVisible}
        onCancel={() => setJsonModalVisible(false)}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyJson}>
            复制JSON
          </Button>,
          <Button key="close" onClick={() => setJsonModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        <Paragraph>
          <pre className="max-h-[400px] overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify(formSchema, null, 2)}
          </pre>
        </Paragraph>
      </Modal>
    </>
  );
};

export default Toolbar;
