import React from "react";
import "./VerificationLayout.css"
import Loader from "../Loader/Loader";

const VerifcationLayout = ({ children, isLoading }) => {
  return (
    <div className="verification-container" >
        <Loader isActive={isLoading} />
      {children}
    </div>
  );
};

export default VerifcationLayout;
