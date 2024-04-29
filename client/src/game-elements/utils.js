import axios from "axios";
import { game } from "./game";
import { GamePhases } from "../assets/constants";

export const logout = (navigate) => {
  axios
    .get("http://localhost:5000/auth/logout")
    .then((res) => {
      if (res.data.status) {
        navigate("/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const cashOut = ({ username, balance }, navigate) => {
  axios
    .post("http://localhost:5000/auth/updateBalance", { username, balance })
    .then((response) => {
      console.log(response.data);
      game.modal.type = GamePhases.CreateOrJoin;
      game.modal.hide = false;
      navigate("/");
    })
    .catch((error) => {
      console.error(error);
    });
};
