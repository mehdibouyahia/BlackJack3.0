import React, { useState, useEffect } from "react";
import { GamePhases } from "../../assets/constants";
import { EndGame } from "./EndGame";
import { Overflow } from "./Manager.styled";
import { PlayerInfos } from "./PlayerInfos";
import { game } from "../../game-elements/game";
import { useNavigate } from "react-router-dom";
import { Socket } from "../../assets/constants";
import axios from "axios";

const COMPONENTS = {
  [GamePhases.CreateOrJoin]: PlayerInfos,
  [GamePhases.EndGame]: EndGame,
};

const Manager = () => {
  const [modalType, setModalType] = useState(game.modal.type);
  const [modalHide, setModalHide] = useState(game.modal.hide);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (!Socket.connected) {
      Socket.connect();
    }
    axios.get("http://localhost:5000/auth/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/");
      }
      console.log(res);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setModalType(game.modal.type);
      setModalHide(game.modal.hide);
    }, 10); // Check for updates every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const ModalComponent = COMPONENTS[modalType];
  return (
    <Overflow className={modalHide ? "" : "active"}>
      {ModalComponent && <ModalComponent />}
    </Overflow>
  );
};

export default Manager;
