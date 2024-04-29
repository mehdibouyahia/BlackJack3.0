import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StyledBtn } from "../components/App/App.styled";
import { useForm } from "react-hook-form";
import {
  InputWrapper,
  Input,
  Label,
  Form,
} from "../components/Manager/Manager.styled";
import { Overflow } from "../components/Manager/Manager.styled";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();

  axios.defaults.withCredentials = true;

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/auth/forgotPassword", data)
      .then((response) => {
        if (response.data.status) {
          alert("Password reset link sent to your email.");
          navigate("/login");
        }
        console.log(response.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
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
        <h2>Forgot Password</h2>

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

        <StyledBtn type="submit">Send</StyledBtn>
      </Form>
    </Overflow>
  );
};

export default ForgotPassword;
