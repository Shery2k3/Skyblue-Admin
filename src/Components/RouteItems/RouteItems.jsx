import {
  FundProjectionScreenOutlined,
  ToolOutlined,
  PicRightOutlined,
  FileTextOutlined,
  BookOutlined,
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
import { Menu } from "antd";

const routeItems = [
  {
    key: "1",
    icon: <FundProjectionScreenOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: "sub1", 
    icon: <ProductOutlined />,
    label: "Catalog", 
    children: [ 
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
        icon: <ToolOutlined />,
        label: <Link to="/manufacturers">Manufacturers</Link>,
      },
      {
        key: "5",
        icon: <PicRightOutlined />,
        label: <Link to="/inventory">Inventory</Link>,
      },
    ],
  },
  {
    key: "6",
    icon: <ShopOutlined />,
    label: <Link to="/vendors">Vendors</Link>,
  },
  {
    key: "sub2",
    icon: <ShoppingCartOutlined />,
    label: "Sales",
    children: [
      {
        key: "7",
        icon: <ShopOutlined />,
        label: <Link to="/orders">Orders</Link>,
      },
      {
        key: "8",
        icon: <ShoppingCartOutlined />,
        label: <Link to="/current-carts">Current Carts</Link>,
      },
      {
        key: "9",
        icon: <StarOutlined />,
        label: <Link to="/best-seller">Best Seller</Link>,
      },
    ],
  },
  {
    key: "sub3",
    icon: <UserOutlined />,
    label: "Customers",
    children: [
      {
        key: "10",
        icon: <UserOutlined />,
        label: <Link to="/customer">Customers</Link>,
      },
      {
        key: "11",
        icon: <UserOutlined />,
        label: <Link to="/customer-roles">Customer Roles</Link>,
      },

      {
        key: "12",
        icon: <UserOutlined />,
        label: <Link to="/customer-report">Customer Reports</Link>,
      },
      {
        key: "13",
        icon: <UserOutlined />,
        label: <Link to="/customer-approval">Approval</Link>,
      },
    ],
  },
  {
    key: "sub4",
    icon: <TagOutlined />,
    label: "Promotions",
    children: [
      {
        key: "14",
        icon: <DollarOutlined />,
        label: <Link to="/discounts">Discounts</Link>,
      },
      {
        key: "15",
        icon: <MailOutlined />,
        label: <Link to="/campaign">Campaign</Link>,
      },
      {
        key: "16",
        icon: <BookOutlined />,
        label: <Link to="/flyer">Flyer</Link>,
      },
      {
        key: "17",
        icon: <FileTextOutlined />,
        label: <Link to="/order-sheet">OrderSheet</Link>,
      },
    ],
  },
  {
    key: "sub5",
    icon: <PictureOutlined />,
    label: "Content Management",
    children: [
      {
        key: "18",
        icon: <NotificationOutlined />,
        label: <Link to="/notice">Notice</Link>,
      },
      {
        key: "19",
        icon: <PictureOutlined />,
        label: <Link to="/banners">Banners</Link>,
      },
    ],
  },
];

export default routeItems;
