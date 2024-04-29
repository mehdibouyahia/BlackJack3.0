import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { StyledBtn } from "../components/App/App.styled";
import { useForm } from "react-hook-form";
import {
  InputWrapper,
  Input,
  Label,
  Form,
} from "../components/Manager/Manager.styled";
import { Overflow } from "../components/Manager/Manager.styled";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();

  axios.defaults.withCredentials = true;

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/auth/resetPassword/" + token, data)
      .then((response) => {
        if (response.data.status) {
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
        <h2>Reset Password</h2>

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

        <StyledBtn type="submit">Reset</StyledBtn>
      </Form>
    </Overflow>
  );
};

export default ResetPassword;
