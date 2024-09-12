import React, { useState, useEffect } from 'react';
import { Table, Image, Button, Popconfirm, message } from 'antd';
import axios from 'axios';

const BannerTable = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/slider/banner');
                const data = response.data.map(item => ({
                    key: item.sliderId.toString(),
                    id: item.sliderId,
                    title: `Banner ${item.sliderId}`, // Adjust if needed
                    imageUrl: item.image,
                }));
                setDataSource(data);
            } catch (error) {
                message.error('Failed to fetch data');
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (key) => {
        try {
            // Ensure the URL matches the one tested with cURL
            await axios.delete(`http://localhost:3000/admin/slider/${key}`);

            // Update the local state to remove the deleted banner
            setDataSource(dataSource.filter(item => item.key !== key));
            message.success('Banner deleted successfully');
        } catch (error) {
            message.error('Failed to delete banner');
        }
    };


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
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
