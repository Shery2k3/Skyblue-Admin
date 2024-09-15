import React from 'react';
import { Link } from 'react-router-dom';
import './Error404.css'; 
import NotFoundImage from '/404.png'; // Adjust the path based on your file structure

const Error404 = () => {
  return (
    <div className="bg-container">
        <div className='container'>
            <img src={NotFoundImage} alt="404 image" />
            <p className="text">SORRY WE CAN'T FIND THE PAGE.</p>
            <p>The page you are looking for was moved, removed, renamed, or never existed.</p>
            <Link to="/" className="link">Return to Home</Link>
        </div>
    </div>
  );
};

export default Error404;
