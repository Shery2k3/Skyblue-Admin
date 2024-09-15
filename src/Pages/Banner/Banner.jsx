import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import BannerTable from "../../Components/FormBanner/BannerTable";
import CustomLayout from "../../Components/Layout/Layout";

const Banner = () => {
  const navigate = useNavigate();

  const goToAddBannerPage = () => {
    navigate("/banners/add-banner");
  };

  return (
    <CustomLayout pageTitle="Banner" menuKey="12">
      <div>
        <h1 style={{ marginBottom: "30px" }}>Banner Images Table</h1>

        <Button
          type="primary"
          onClick={goToAddBannerPage}
          style={{ marginBottom: "20px", float: "center", marginLeft: "50px " }}
        >
          Add New Banner
        </Button>

        <div style={{ clear: "both" }}></div>

        <BannerTable />
      </div>
    </CustomLayout>
  );
};

export default Banner;
