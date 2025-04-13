import React from "react";
import { Card, Typography, Space } from "antd";
import { FormComponentProps } from "./types";

const { Title } = Typography;

const componentTemplates: FormComponentProps[] = [
  {
    type: "input",
    label: "文本输入框",
    name: "input_field",
    placeholder: "请输入",
    required: false,
  },
  {
    type: "textarea",
    label: "多行文本",
    name: "textarea_field",
    placeholder: "请输入",
    required: false,
  },
  {
    type: "number",
    label: "数字输入框",
    name: "number_field",
    placeholder: "请输入数字",
    required: false,
  },
  {
    type: "select",
    label: "下拉选择",
    name: "select_field",
    placeholder: "请选择",
    required: false,
    options: [
      { label: "选项1", value: "1" },
      { label: "选项2", value: "2" },
    ],
  },
  {
    type: "radio",
    label: "单选框",
    name: "radio_field",
    required: false,
    options: [
      { label: "选项1", value: "1" },
      { label: "选项2", value: "2" },
    ],
  },
  {
    type: "checkbox",
    label: "复选框",
    name: "checkbox_field",
    required: false,
    options: [
      { label: "选项1", value: "1" },
      { label: "选项2", value: "2" },
    ],
  },
  {
    type: "date",
    label: "日期选择",
    name: "date_field",
    placeholder: "请选择日期",
    required: false,
  },
  {
    type: "switch",
    label: "开关",
    name: "switch_field",
    required: false,
  },
];

interface ComponentLibraryProps {
  onDragStart: (component: FormComponentProps) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onDragStart }) => {
  const handleDragStart = (
    e: React.DragEvent,
    component: FormComponentProps,
  ) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
    if (onDragStart) {
      onDragStart(component);
    }
  };

  return (
    <Card className="h-full overflow-auto">
      <Title level={4}>组件库</Title>
      <Space direction="vertical" className="w-full">
        {componentTemplates.map((component, index) => (
          <Card
            key={index}
            size="small"
            className="transform cursor-move transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-95"
            draggable
            onDragStart={(e) => handleDragStart(e, component)}
            onDragEnd={(e) => e.target.classList.remove("dragging")}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⋮⋮</span>
              <span>{component.label}</span>
              <span className="text-xs text-gray-400">({component.type})</span>
            </div>
          </Card>
        ))}
      </Space>
    </Card>
  );
};

export default ComponentLibrary;
