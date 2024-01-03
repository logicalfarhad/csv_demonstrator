import React, {useEffect} from 'react';
import AboutSection from '../../components/AboutSection/AboutSection';
import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';
import { useNavigate } from "react-router-dom";


let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const Introduction = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function checkTokenValidity() {
      try {
        let bearer = 'Bearer ' + window.localStorage.getItem("token");
        const response = await fetch(backend + "/login/check-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
          },
        });
        const data = await response.json();
        if (!data.valid) {
          console.warn("User session expired, please login again!");
          // Handle token invalidity, such as logging out the user
          navigate("/auth/login");
        } else {
          navigate("/introduction");
        }
      } catch (error) {
        console.error("Error checking token validity:", error);
        navigate("/auth/login");
      }
    }

    if (isMounted) {
      if (window.localStorage.getItem("token")) {
        checkTokenValidity();
      } else {
        navigate("/auth/login");
      }
    }

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <>
    <NavbarMenu />
    <AboutSection />
    </>
  );
};

export default Introduction;