import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { StyledBtn, StyledLink } from "../components/App/App.styled";
import {
  InputWrapper,
  Input,
  Label,
  Form,
} from "../components/Manager/Manager.styled";
import { Overflow } from "../components/Manager/Manager.styled";

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();

  axios.defaults.withCredentials = true;

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/auth/signup", data)
      .then((response) => {
        if (response.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          alert(err.response.data.message);
        } else {
          console.log(err);
          alert("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <Overflow className="active">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign Up</h2>

        <InputWrapper>
          <Input
            type="username"
            autoComplete="off"
            className={`${watch("username") ? "filled" : ""}`}
            {...register("username", {
              required: "username is required",
            })}
          />
          <Label htmlFor="username">Username:</Label>
        </InputWrapper>

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

        <StyledBtn type="submit">Sign Up</StyledBtn>
        <p style={{ marginLeft: "15vmin" }}>Have an account?</p>
        <StyledLink to="/login">Login</StyledLink>
      </Form>
    </Overflow>
  );
};

export default Signup;
