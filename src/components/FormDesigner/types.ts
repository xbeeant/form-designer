import { Rule } from "antd/es/form";

export interface FormComponentProps {
  type: string;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  rules?: Rule[];
  [key: string]: any;
}

export interface FormSchema {
  components: FormComponentProps[];
  layout: "horizontal" | "vertical";
}

export interface DraggableComponentProps {
  component: FormComponentProps;
  onSelect: (component: FormComponentProps) => void;
  onDelete: (component: FormComponentProps) => void;
}
