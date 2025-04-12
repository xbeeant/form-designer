import React from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Switch,
  InputNumber,
  Card,
  Typography,
  Button,
  Space,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FormComponentProps, FormSchema } from "./types";

const { Title } = Typography;
const { TextArea } = Input;

interface FormPreviewProps {
  formSchema: FormSchema;
  onSelectComponent: (component: FormComponentProps) => void;
  onDeleteComponent: (component: FormComponentProps) => void;
  onDrop: (e: React.DragEvent) => void;
  onReorder?: (dragIndex: number, dropIndex: number) => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  formSchema,
  onSelectComponent,
  onDeleteComponent,
  onDrop,
  onReorder,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("reorder", JSON.stringify({ dragIndex: index }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleComponentDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const reorderData = e.dataTransfer.getData("reorder");
    if (!reorderData) return;

    try {
      const { dragIndex } = JSON.parse(reorderData);
      if (dragIndex === dropIndex) return;

      if (onReorder) {
        onReorder(dragIndex, dropIndex);
      }
    } catch (error) {
      console.error("Failed to handle component reordering:", error);
    }
  };

  const renderFormItem = (component: FormComponentProps) => {
    const { type, label, name, placeholder, required, options } = component;

    switch (type) {
      case "input":
        return <Input placeholder={placeholder} />;
      case "textarea":
        return <TextArea rows={4} placeholder={placeholder} />;
      case "number":
        return (
          <InputNumber placeholder={placeholder} style={{ width: "100%" }} />
        );
      case "select":
        return (
          <Select
            placeholder={placeholder}
            options={options}
            style={{ width: "100%" }}
          />
        );
      case "radio":
        return <Radio.Group options={options} />;
      case "checkbox":
        return <Checkbox.Group options={options} />;
      case "date":
        return <DatePicker style={{ width: "100%" }} />;
      case "switch":
        return <Switch />;
      default:
        return <Input placeholder={placeholder} />;
    }
  };

  return (
    <Card className="h-full overflow-auto">
      <Title level={4}>表单预览</Title>
      <div
        className="min-h-[300px] rounded-md border-2 border-dashed border-gray-300 p-4"
        onDrop={onDrop}
        onDragOver={handleDragOver}
      >
        {formSchema.components.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            拖拽组件到此区域
          </div>
        ) : (
          <Form layout={formSchema.layout} className="w-full">
            {formSchema.components.map((component, index) => (
              <div
                key={index}
                className="group relative mb-4 rounded-md border border-transparent p-2 hover:border-blue-300 hover:bg-blue-50"
                onClick={() => onSelectComponent(component)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleComponentDrop(e, index)}
              >
                <div className="absolute top-1/2 left-0 -ml-6 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100">
                  <span className="text-lg text-gray-500">⋮⋮</span>
                </div>
                <Form.Item
                  label={component.label}
                  name={component.name}
                  rules={[
                    {
                      required: component.required,
                      message: `请输入${component.label}`,
                    },
                  ]}
                >
                  {renderFormItem(component)}
                </Form.Item>
                <div className="absolute top-0 right-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComponent(component);
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(component);
                      }}
                    />
                  </Space>
                </div>
              </div>
            ))}
          </Form>
        )}
      </div>
    </Card>
  );
};

export default FormPreview;
