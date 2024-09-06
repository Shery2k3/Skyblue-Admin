import {
  FundProjectionScreenOutlined,
  UserOutlined,
  DollarOutlined,
  ProductOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  PictureOutlined,
  TagOutlined,
  MailOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const routeItems = [
  {
    key: "1",
    icon: <FundProjectionScreenOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: "2",
    icon: <ProductOutlined />,
    label: <Link to="/categories">Categories</Link>,
  },
  {
    key: "3",
    icon: <CustomerServiceOutlined />,
    label: <Link to="/products">Products</Link>,
  },
  {
    key: "4",
    icon: <ShopOutlined />,
    label: <Link to="/vendors">Vendors</Link>,
  },
  {
    key: "5",
    icon: <ShoppingCartOutlined />,
    label: <Link to="/orders">Orders</Link>,
  },
  {
    key: "6",
    icon: <StarOutlined />,
    label: <Link to="/best-seller">Best Seller</Link>,
  },
  {
    key: "7",
    icon: <UserOutlined />,
    label: <Link to="/customer">Customers</Link>,
  },
  {
    key: "9",
    icon: <DollarOutlined />,
    label: <Link to="/discount">Discount</Link>,
  },
  {
    key: "10",
    icon: <MailOutlined />,
    label: <Link to="/email">Email</Link>,
  },
  {
    key: "11",
    icon: <NotificationOutlined />,
    label: <Link to="/notice">Notice</Link>,
  },
  {
    key: "12",
    icon: <PictureOutlined />,
    label: <Link to="/banners">Banners</Link>,
  },
];

export default routeItems;
