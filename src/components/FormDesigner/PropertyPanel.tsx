import React from "react";
import { Card, Form, Input, Switch, Select, Typography, Space } from "antd";
import { FormComponentProps } from "./types";

const { Title } = Typography;

interface PropertyPanelProps {
  selectedComponent: FormComponentProps | null;
  onPropertyChange: (values: Partial<FormComponentProps>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onPropertyChange,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (selectedComponent) {
      form.setFieldsValue(selectedComponent);
    } else {
      form.resetFields();
    }
  }, [selectedComponent, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    onPropertyChange(allValues);
  };

  if (!selectedComponent) {
    return (
      <Card className="h-full">
        <Title level={4}>属性配置</Title>
        <div className="text-gray-400">请选择一个组件进行配置</div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <Title level={4}>属性配置</Title>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={selectedComponent}
      >
        <Form.Item label="标签名称" name="label">
          <Input />
        </Form.Item>
        <Form.Item label="字段名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="占位提示" name="placeholder">
          <Input />
        </Form.Item>
        <Form.Item label="是否必填" name="required" valuePropName="checked">
          <Switch />
        </Form.Item>
        {selectedComponent.type === "select" && (
          <Form.Item label="选项" name="options">
            <Select
              mode="tags"
              placeholder="输入选项，回车确认"
              onChange={(values) => {
                const options = values.map((value) => ({
                  label: value,
                  value,
                }));
                onPropertyChange({ options });
              }}
            />
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default PropertyPanel;
