import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table, Button, Space } from 'antd'
import useRetryRequest from '../../../../Api/useRetryRequest'
import API_BASE_URL from '../../../../constants'
import axiosInstance from '../../../../Api/axiosConfig'

const CurrentCart = () => {
  const { id } = useParams()
  const retryRequest = useRetryRequest()

  const [cartItems, setCartItems] = useState([])

  // Fetch shopping cart data
  const fetchCurrentCart = async () => {
    try {
      const response = await retryRequest(() => axiosInstance.get(`${API_BASE_URL}/admin/edit-customer-shopping-cart/${id}`))
      const data = response.data.result
      const formattedData = data.map(item => {
        // Calculate the total price (Unit Price * Quantity)
        const total = item.ProductPrice * item.Quantity
        return {
          ...item,
          total,  // Adding total field
          unitPrice: item.ProductPrice,  // Adding unit price field
        }
      })
      setCartItems(formattedData)
    } catch (error) {
      console.error("Failed to fetch current cart:", error)
    }
  }

  // Fetch cart on component mount
  useEffect(() => {
    fetchCurrentCart()
  }, [id])

  // Ant Design table columns definition
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      key: 'ProductName',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => `$${price.toFixed(2)}`,  // Format price as currency
    },
   
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,  // Format total as currency
    },
    {
      title: 'Updated On',
      dataIndex: 'UpdatedOnUtc',
      key: 'UpdatedOnUtc',
      render: (date) => new Date(date).toLocaleString(),  // Format date
    }
  ]

  return (
    <div>
      <h2>Customer Shopping Cart</h2>
      <Table 
        dataSource={cartItems} 
        columns={columns} 
        rowKey="Id"  // Use the 'Id' as the unique row key
        pagination={{ pageSize: 10 }}  
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default CurrentCart
