import React from 'react'
import CustomLayout from '../../../Components/Layout/Layout'
import { Typography } from 'antd'

const EditCustomer = () => {
    const { Title } = Typography;

    return (
        <CustomLayout pageTitle="Edit Customer" menuKey="12">
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
                Edit Customer
            </Title>
        </CustomLayout>
    )
}

export default EditCustomer