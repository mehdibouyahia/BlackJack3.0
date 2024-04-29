import styled from "styled-components";

import { Color } from "../../assets/constants";

export const Overflow = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-100%);
  opacity: 0;
  &.active {
    transform: translateY(0);
    opacity: 1;
  }
`;
export const Form = styled.form`
  width: 400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 55, 0, 0.9);
  box-sizing: border-box;
  border-radius: 10px;
`;
export const StyledDiv = styled.div`
  width: 400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 55, 0, 0.9);
  box-sizing: border-box;
  border-radius: 10px;
`;

export const Input = styled.input`
  font-size: 1.9vmin;
  padding: 5px;
  -webkit-appearance: none;
  display: block;
  background: transparent;
  color: #fff;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #fff;

  &:focus {
    outline: none;
  }
  &:focus ~ label,
  &.filled ~ label {
    top: -2.3vmin;
    transform: scale(0.75);
    left: -2px;
    color: ${Color.Lime};
  }
  &:focus ~ .bar:before,
  &:focus ~ .bar:after {
    width: 50%;
  }
`;
export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 4vmin;
`;
export const Label = styled.label`
  color: #fff;
  font-size: 1.9vmin;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 5px;
  transition: all 0.2s ease;
`;

export const ErrorMsg = styled.p`
  position: absolute;
  color: red;
  font-size: small;
  bottom: -30px;
`;

export const CheckboxInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3.4vmin;
  margin-bottom: 3.5vmin;
`;

export const CheckboxInput = styled.input`
  &[type="checkbox"] {
    visibility: hidden;
    &:checked + label {
      background-color: ${Color.Lime};
    }
    &:checked + label:after {
      opacity: 1;
    }
    & ~ .fake-check {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 50%;
      cursor: pointer;
      height: 28px;
      left: 0;
      position: absolute;
      top: 0;
      width: 28px;
    }

    & ~ .fake-check:after {
      border: 2px solid #fff;
      border-top: none;
      border-right: none;
      content: "";
      height: 6px;
      left: 7px;
      opacity: 0;
      position: absolute;
      top: 8px;
      transform: rotate(-45deg);
      width: 12px;
    }
  }
`;

export const CheckboxLabel = styled.label`
  color: #fff;
  padding-left: 28px;
  font-size: 1.9vmin;
  font-weight: normal;
  pointer-events: none;
  width: max-content;
`;
export const ButtonsWrapper = styled.div`
  display: flex;
  align-self: center;
  gap: 5px;
`;
