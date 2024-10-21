import CustomLayout from "../../../Components/Layout/Layout";
import { Typography } from "antd";
import FlyerItems from "./Sections/FlyerItems";
import FlyerGenerate from "./Sections/FlyerGenerate";

const Flyer = () => {
  const { Title } = Typography;

  return (
    <CustomLayout pageTitle="Flyer" menuKey="16">
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Flyer
      </Title>
      <FlyerGenerate />
      <FlyerItems />
    </CustomLayout>
  );
};

export default Flyer;
