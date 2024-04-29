import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StyledBtn, StyledLink } from "../components/App/App.styled";
import { useForm } from "react-hook-form";
import {
  InputWrapper,
  Input,
  Label,
  Form,
} from "../components/Manager/Manager.styled";
import { Overflow } from "../components/Manager/Manager.styled";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();

  axios.defaults.withCredentials = true;

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/auth/login", data)
      .then((response) => {
        if (response.data.status) {
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };

  return (
    <Overflow className="active">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <Input
            type="email"
            autoComplete="off"
            className={`${watch("email") ? "filled" : ""}`}
            {...register("email", {
              required: "email is required",
            })}
          />
          <Label htmlFor="email">Email:</Label>
        </InputWrapper>

        <InputWrapper>
          <Input
            type="password"
            className={`${watch("password") ? "filled" : ""}`}
            {...register("password", {
              required: "password is required",
            })}
          />
          <Label htmlFor="password">Password:</Label>
        </InputWrapper>

        <StyledBtn type="submit">Login</StyledBtn>

        <br />

        <StyledLink to="/forgotPassword">Forgot Password?</StyledLink>

        <p style={{ marginLeft: "13vmin" }}>Don't Have An Account?</p>
        <StyledLink to="/signup">Sign up</StyledLink>
      </Form>
    </Overflow>
  );
};

export default Login;
