import { Button, Card, Form, Input, message } from "antd";
import axiosInstance from "../../../../Api/axiosConfig";
import API_BASE_URL from "../../../../constants";

const CategorySEO = ({ id, form }) => {
  const saveCategory = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("ParentCategoryId", values.parentId || 0);
      formData.append("ShowOnHomePage", values.showOnHomePage || false);
      formData.append("Description", values.description || "");
      formData.append("Published", values.published);
      formData.append("DiscountId", values.discountId || null);
      formData.append("limitedToCustomerRoles", values.limitedtoRoles || null);
      formData.append("removedImage", values.removedImage || false);
      formData.append("MetaKeywords", values.MetaKeywords);
      formData.append("MetaDescription", values.MetaDescription || 0);
      formData.append("MetaTitle", values.MetaTitle || false);

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      if (id !== "create") {
        await axiosInstance.patch(
          `${API_BASE_URL}/admin/category/edit/${id}`,
          formData,
          config
        );
        message.success("Category updated successfully");
      } else {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/admin/category/add/`,
          formData,
          config
        );
        console.log(response)
        message.success("Category added successfully");
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    }
  };
  return (
    <Card
      title={"SEO"}
      extra={
        <Button type="primary" onClick={saveCategory}>
          Save
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          metaKeywords: "",
          metaDescription: "",
          metaTitle: "",
          seoPageName: "",
        }}
      >
        <Form.Item label="Meta Keywords" name="MetaKeywords">
          <Input placeholder="Enter meta keywords" />
        </Form.Item>

        <Form.Item label="Meta Description" name="MetaDescription">
          <Input.TextArea placeholder="Enter meta description" />
        </Form.Item>

        <Form.Item label="Meta Title" name="MetaTitle">
          <Input placeholder="Enter meta title" />
        </Form.Item>

        <Form.Item label="Search Engine Friendly Page Name" name="seoPageName">
          <Input placeholder="Enter search engine friendly page name" />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CategorySEO;
