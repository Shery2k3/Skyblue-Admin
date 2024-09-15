import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../Components/LoginForm/LoginForm";
import VerifcationLayout from "../../Components/VerificationLayout/VerificationLayout";
import { AuthContext } from "../../Context/AuthContext/AuthContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { token: contextToken } = useContext(AuthContext); // Get token from AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to check if user is logged in
  const isLoggedIn = () => {
    // Check both AuthContext and localStorage for token
    const localStorageToken = localStorage.getItem("token");
    return contextToken || localStorageToken;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate loading time
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false); // Set to true once data is loaded
      } catch (error) {
        console.error("Failed to load data:", error);
        setIsLoading(false); // Handle loading failure if necessary
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [contextToken, navigate]);

  return (
    <VerifcationLayout isLoading={isLoading}>
      <LoginForm />
    </VerifcationLayout>
  );
};

export default Login;
