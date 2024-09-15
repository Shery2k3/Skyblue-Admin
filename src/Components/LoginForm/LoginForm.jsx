import React, { useState, useContext } from "react";
import API_BASE_URL from "../../constants";
import axios from "axios";
import "./LoginForm.css";
import LogoAccent from "/LogoAccent.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import { Alert } from "antd";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    loginemail: "",
    password: "",
    rememberMe: false,
  });
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "error", // Could be "success", "info", "warning", or "error"
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email: formData.loginemail,
        password: formData.password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        login(token, formData.rememberMe);
        navigate("/"); // Navigate to a protected route
      } else {
        console.error("Login failed with status code:", response.status);
        setAlert({
          visible: true,
          message: "Login failed. Please check your email and password.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response ? error.response.data : error.message
      );
      setAlert({
        visible: true,
        message: error.response
          ? error.response.data.message ||
            "An error occurred during login. Please try again."
          : "An error occurred during login. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="wrapper-login">
      <div className="logo">
        <img src={LogoAccent} alt="Company Logo" />
      </div>
      <div className="inner-wrapper-login">
        <form onSubmit={handleSubmit}>
          <h2 className="form-heading">Welcome, Please Sign In!</h2>
          <div className="input-box">
            <label htmlFor="loginemail">Your Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              id="loginemail"
              name="loginemail"
              value={formData.loginemail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="remember-forget">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <p className="remember-me">Remember me</p>
            </label>
          </div>
          {alert.visible && (
            <Alert
              message={alert.message}
              type={alert.type}
              closable
              onClose={() => setAlert({ ...alert, visible: false })}
              style={{ marginBottom: 16 }}
            />
          )}
          <button type="submit" className="submit-button">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
