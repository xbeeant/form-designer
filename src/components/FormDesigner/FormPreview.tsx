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

const { TextArea } = Input;

interface FormPreviewProps {
  formSchema: FormSchema;
  onSelectComponent: (component: FormComponentProps) => void;
  onDeleteComponent: (component: FormComponentProps) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  isDragOver?: boolean;
  onReorder?: (dragIndex: number, dropIndex: number) => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  formSchema,
  onSelectComponent,
  onDeleteComponent,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
  onReorder,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("reorder", JSON.stringify({ dragIndex: index }));
    e.dataTransfer.effectAllowed = "move";

    // Add dragging class to source element
    const target = e.currentTarget as HTMLElement;
    target.classList.add("opacity-50", "scale-105");

    // Create a ghost image with better styling
    const ghostElement = target.cloneNode(true) as HTMLElement;
    ghostElement.style.transform = "scale(0.85)";
    ghostElement.style.opacity = "0.8";
    ghostElement.style.position = "absolute";
    ghostElement.style.top = "-1000px";
    document.body.appendChild(ghostElement);

    e.dataTransfer.setDragImage(ghostElement, 20, 20);

    // Remove the ghost element after drag starts
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Remove styling classes when drag ends
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("opacity-50", "scale-105");
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

    // 组件类型到实际组件的映射
    const componentMap: Record<string, any> = {
      input: Input,
      textarea: TextArea,
      number: InputNumber,
      select: Select,
      radio: Radio.Group,
      checkbox: Checkbox.Group,
      date: DatePicker,
      switch: Switch,
    };

    // 根据组件类型获取对应的组件
    const Component = componentMap[type] || Input;

    // 根据组件类型准备特定的props
    const props: Record<string, any> = {
      placeholder,
    };

    // 为不同组件类型添加特定属性
    if (type === "textarea") {
      props.rows = 4;
    }

    if (type === "number" || type === "select" || type === "date") {
      props.style = { width: "100%" };
    }

    if (type === "select" || type === "radio" || type === "checkbox") {
      props.options = options;
    }

    // 使用React.createElement创建组件
    return React.createElement(Component, props);
  };

  return (
    <Card className="h-full overflow-auto">
      <div
        className={`min-h-[300px] rounded-md border-2 border-dashed p-4 transition-all duration-300 ${
          isDragOver
            ? "border-blue-400 bg-blue-50/50 shadow-inner"
            : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
        }`}
        onDrop={onDrop}
        onDragOver={(e) => {
          handleDragOver(e);
          onDragOver && onDragOver(e);
        }}
        onDragLeave={() => onDragLeave && onDragLeave()}
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
                onDragEnd={handleDragEnd}
                onDragOver={(e) => {
                  handleDragOver(e);
                  e.currentTarget.classList.add(
                    "bg-blue-100",
                    "border-blue-400",
                  );
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove(
                    "bg-blue-100",
                    "border-blue-400",
                  );
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove(
                    "bg-blue-100",
                    "border-blue-400",
                  );
                  handleComponentDrop(e, index);
                }}
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
