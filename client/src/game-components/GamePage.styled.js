import styled from "styled-components";
import bg from "../assets/img1.jpg";

export const Wrapper = styled.div`
  position: relative;
  background-image: url(${bg});
  background-size: cover;
  color: white;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 4fr 1fr;

  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
`;

export const GameWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 50px 0;
  width: 100%;
  transform: perspective(1000px) translateZ(-300px) rotateX(30deg);
`;

export const BalanceStyled = styled.div`
  position: absolute;
  align-items: center;
  font-size: 20px;
  gap: 5px;
  top: 20px;
  left: 20px;
  div::before {
    content: " Balance : ";
  }
  div::after {
    content: " €";
  }
`;

export const OptionsPanel = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
`;
