import styled from "styled-components";
import { Color } from "../../assets/constants";
import { Link } from "react-router-dom";

const StyledBtn = styled.button`
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  border: 0.23vmin solid ${Color.Lime};
  border-radius: 0.58vmin;
  color: ${Color.Lime};
  padding: 10px 20px;
  font-size: 1.9vmin;
  overflow: hidden;
  transition: 0.5s;
  &:hover {
    background: ${Color.Lime};
    color: #fff;
  }
  &:disabled {
    pointer-events: none;
    border-radius: 5px;
  }
`;

const StyledLink = styled(Link)`
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  border: 0.23vmin solid ${Color.Lime};
  border-radius: 0.58vmin;
  color: ${Color.Lime};
  padding: 10px 20px;
  font-size: 1.9vmin;
  overflow: hidden;
  transition: 0.5s;

  &:hover {
    background: ${Color.Lime};
    color: #fff;
  }
`;

const toastSettings = {
  position: "top-right",
  autoClose: 800,
  hideProgressBar: true,
  closeOnClick: true,
  theme: "dark",
};

export { StyledBtn, toastSettings, StyledLink };
