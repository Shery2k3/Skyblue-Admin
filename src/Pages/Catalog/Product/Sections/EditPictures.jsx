import React, { useState, useEffect } from "react";
import { Upload, message, Button, Card, Image, Spin, Modal, Popconfirm } from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import API_BASE_URL from "../../../../constants";
import axiosInstance from "../../../../Api/axiosConfig";
import { useParams } from "react-router-dom";
import useRetryRequest from "../../../../Api/useRetryRequest";

const EditPictures = () => {
  const { id } = useParams();
  const retryRequest = useRetryRequest();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Fetch existing images when component mounts
  useEffect(() => {
    fetchExistingImages();
  }, []);

  const fetchExistingImages = async () => {
    try {
      setLoading(true);
      const response = await retryRequest(() =>
        axiosInstance.get(`${API_BASE_URL}/admin/product/images/${id}`)
      );
      console.log(response.data);
      setExistingImages(response.data.images || []);
    } catch (error) {
      message.error("Failed to fetch existing images");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Limit file types to images
    const filteredFileList = newFileList.filter((file) => {
      if (file.type && !file.type.startsWith("image/")) {
        message.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });
    setFileList(filteredFileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one image to upload");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });

      await retryRequest(() =>
        axiosInstance.post(
          `${API_BASE_URL}/admin/product/images/add/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
      );

      message.success("Images uploaded successfully");
      setFileList([]);
      fetchExistingImages(); // Refresh the images list
    } catch (error) {
      message.error("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      setLoading(true);
      await retryRequest(() =>
        axiosInstance.delete(
          `${API_BASE_URL}/admin/product/images/${id}/delete/${imageId}`
        )
      );
      message.success("Image deleted successfully");
      fetchExistingImages();
    } catch (error) {
      message.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title="Product Images">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={handlePreview}
          beforeUpload={() => false} // Prevent auto upload
          multiple
        >
          {fileList.length >= 8 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          style={{ marginBottom: 16 }}
        >
          Upload Selected Images
        </Button>

        <div style={{ marginTop: 16 }}>
          <h3>Existing Images</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {existingImages.map((image) => (
              <div key={image.pictureId} style={{ position: "relative" }}>
                <Image
                  src={image.url}
                  alt="Product"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <Popconfirm
                  title="Delete this image?"
                  description="Are you sure you want to delete this image?"
                  onConfirm={() => handleDelete(image.pictureId)}
                  okText="Yes"
                  cancelText="No"
                  placement="top"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      background: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                </Popconfirm>
              </div>
            ))}
          </div>
        </div>

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Card>
    </Spin>
  );
};

export default EditPictures;
