import React, { useState } from 'react';
import { Table, Image, Button, Popconfirm, message } from 'antd';

const BannerTable = () => {
    const initialData = [
        {
            key: '1',
            id: '101',
            title: 'Summer Collection',
            imageUrl: 'https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=600&h=600',
        },
        {
            key: '2',
            id: '102',
            title: 'Winter Sale',
            imageUrl: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
        },
        {
            key: '3',
            id: '103',
            title: 'Spring Offers',
            imageUrl: 'https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=600&h=600',
        },
    ];

    // Use state to manage the data in the table
    const [dataSource, setDataSource] = useState(initialData);

    // Function to handle deleting a row
    const handleDelete = (key) => {
        setDataSource(dataSource.filter(item => item.key !== key));
        message.success('Banner deleted successfully');
    };

    // Define the columns for the table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 150,
        },
        {
            title: 'Banner Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => <Image width={100} src={text} alt="banner" />,
            width: 150,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this banner?"
                    onConfirm={() => handleDelete(record.key)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
            ),
            width: 120,
        },
    ];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false} // Disable pagination if not needed
            scroll={{ x: 'max-content' }}
        />
    );
};

export default BannerTable;
