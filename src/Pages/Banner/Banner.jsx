import React from "react";
import { Button, Typography } from "antd";
import useResponsiveButtonSize from "../../Components/ResponsiveSizes/ResponsiveSize";
import { useNavigate } from "react-router-dom";
import BannerTable from "../../Components/FormBanner/BannerTable";
import CustomLayout from "../../Components/Layout/Layout";

const Banner = () => {
  const navigate = useNavigate();
  const buttonSize = useResponsiveButtonSize();
  const { Title } = Typography;

  const goToAddBannerPage = () => {
    navigate("/banners/add-banner");
  };

  return (
    <CustomLayout pageTitle="Banner" menuKey="12">
      <div>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Banners
      </Title>
        <div
          style={{ textAlign: "right", marginBottom: "20px", float: "center" }}
        >
          <Button type="primary" onClick={goToAddBannerPage} size={buttonSize}>
            Add Banner
          </Button>
        </div>

        <div style={{ clear: "both" }}></div>

        <BannerTable />
      </div>
    </CustomLayout>
  );
};

export default Banner;
