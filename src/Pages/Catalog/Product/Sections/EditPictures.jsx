import { message } from 'antd'
import React from 'react'
import API_BASE_URL from '../../../../constants';
import axiosInstance from '../../../../Api/axiosConfig';
import { useParams } from 'react-router-dom';
import useRetryRequest from '../../../../Api/useRetryRequest';

const EditPictures = () => {
  const {id} = useParams()

  
  const retryRequest = useRetryRequest();


  
  return (
    <div>Editpic</div>
  )
}

export default EditPictures