import React from "react";
import "./Loader.css"

const Loader = ({ isActive }) => {
  return (
    <div className={`loader-container ${!isActive ? "fade-out" : ""}`}>
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
