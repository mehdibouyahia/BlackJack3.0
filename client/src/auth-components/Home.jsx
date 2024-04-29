import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StyledBtn, StyledLink } from "../components/App/App.styled";
import { Overflow, StyledDiv } from "../components/Manager/Manager.styled";
import { logout } from "../game-elements/utils";

const Home = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:5000/auth/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/login");
      }
      console.log(res);
    });
  }, []);

  const handleLogout = () => {
    logout(navigate);
  };
  return (
    <Overflow className="active">
      <StyledDiv>
        <StyledLink to="/dashboard">PLAY</StyledLink>
        <br /> <br />
        <StyledBtn onClick={handleLogout}>Logout</StyledBtn>
      </StyledDiv>
    </Overflow>
  );
};

export default Home;
