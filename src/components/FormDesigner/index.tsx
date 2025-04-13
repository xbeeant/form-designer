import React, { useState, useCallback } from "react";
import "./FormDesigner.css";
import { Layout } from "antd";
import ComponentLibrary from "./ComponentLibrary";
import PropertyPanel from "./PropertyPanel";
import FormPreview from "./FormPreview";
import Toolbar from "./Toolbar";
import { FormComponentProps, FormSchema } from "./types";

const { Sider, Content } = Layout;

const initialFormSchema: FormSchema = {
  components: [],
  layout: "horizontal",
};

const FormDesigner: React.FC = () => {
  // State management
  const [formSchema, setFormSchema] = useState<FormSchema>(initialFormSchema);
  const [selectedComponent, setSelectedComponent] =
    useState<FormComponentProps | null>(null);

  // Handlers for drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("component");
    const reorderData = e.dataTransfer.getData("reorder");

    // Handle component reordering
    if (reorderData) {
      try {
        const { dragIndex, dropIndex } = JSON.parse(reorderData);
        if (dragIndex !== undefined && dropIndex !== undefined) {
          setFormSchema((prev) => {
            const newComponents = [...prev.components];
            const [movedItem] = newComponents.splice(dragIndex, 1);
            newComponents.splice(dropIndex, 0, movedItem);
            return { ...prev, components: newComponents };
          });
        }
      } catch (error) {
        console.error("Failed to reorder component:", error);
      }
      return;
    }

    // Handle new component addition
    if (!componentData) return;
    try {
      const component: FormComponentProps = JSON.parse(componentData);
      // Generate unique name for the component
      const timestamp = Date.now();
      const uniqueName = `${component.type}_${timestamp}`;

      setFormSchema((prev) => ({
        ...prev,
        components: [...prev.components, { ...component, name: uniqueName }],
      }));
    } catch (error) {
      console.error("Failed to parse dragged component:", error);
    }
  }, []);

  // Handlers for component reordering
  const handleComponentReorder = useCallback(
    (dragIndex: number, dropIndex: number) => {
      setFormSchema((prev) => {
        const newComponents = [...prev.components];
        const [movedItem] = newComponents.splice(dragIndex, 1);
        newComponents.splice(dropIndex, 0, movedItem);
        return { ...prev, components: newComponents };
      });
    },
    [],
  );

  const handlePropertyChange = useCallback(
    (values: Partial<FormComponentProps>) => {
      if (!selectedComponent) return;

      setFormSchema((prev) => ({
        ...prev,
        components: prev.components.map((comp) =>
          comp.name === selectedComponent.name ? { ...comp, ...values } : comp,
        ),
      }));

      setSelectedComponent((prev) => (prev ? { ...prev, ...values } : null));
    },
    [selectedComponent],
  );

  const handleDeleteComponent = useCallback(
    (component: FormComponentProps) => {
      setFormSchema((prev) => ({
        ...prev,
        components: prev.components.filter(
          (comp) => comp.name !== component.name,
        ),
      }));

      if (selectedComponent?.name === component.name) {
        setSelectedComponent(null);
      }
    },
    [selectedComponent],
  );

  // Handlers for form operations
  const handleChangeLayout = useCallback(
    (layout: "horizontal" | "vertical") => {
      setFormSchema((prev) => ({ ...prev, layout }));
    },
    [],
  );

  const handleClearForm = useCallback(() => {
    setFormSchema((prev) => ({
      components: [],
      layout: prev.layout,
    }));
    setSelectedComponent(null);
  }, []);

  const handleSaveForm = useCallback(() => {
    // Save form schema to storage or backend
    const formData = JSON.stringify(formSchema, null, 2);
    try {
      localStorage.setItem("formDesignerSchema", formData);
      console.log("Form schema saved successfully");
    } catch (error) {
      console.error("Failed to save form schema:", error);
    }
  }, [formSchema]);

  const handleLoadForm = useCallback(() => {
    // Load form schema from storage or backend
    try {
      const savedSchema = localStorage.getItem("formDesignerSchema");
      if (savedSchema) {
        const parsedSchema = JSON.parse(savedSchema);
        setFormSchema(parsedSchema);
        setSelectedComponent(null);
      }
    } catch (error) {
      console.error("Failed to load form schema:", error);
    }
  }, []);

  return (
    <Layout className="flex h-screen flex-col">
      <Toolbar
        formSchema={formSchema}
        onChangeLayout={handleChangeLayout}
        onClear={handleClearForm}
        onSave={handleSaveForm}
        onLoad={handleLoadForm}
      />
      <Layout className="flex-1">
        <Sider width={250} theme="light" className="border-r">
          <ComponentLibrary onDragStart={() => setSelectedComponent(null)} />
        </Sider>
        <Content className="bg-gray-50 p-4">
          <FormPreview
            formSchema={formSchema}
            onSelectComponent={setSelectedComponent}
            onDeleteComponent={handleDeleteComponent}
            onDrop={handleDrop}
            onReorder={handleComponentReorder}
          />
        </Content>
        <Sider width={300} theme="light" className="border-l">
          <PropertyPanel
            selectedComponent={selectedComponent}
            onPropertyChange={handlePropertyChange}
          />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default FormDesigner;
