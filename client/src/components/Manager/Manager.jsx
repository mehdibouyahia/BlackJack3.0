import React, { useState, useEffect } from "react";
import { GamePhases } from "../../assets/constants";
import { EndGame } from "./EndGame";
import { Overflow } from "./Manager.styled";
import { PlayerInfos } from "./PlayerInfos";
import { game } from "../../game-elements/game";

const COMPONENTS = {
  [GamePhases.CreateOrJoin]: PlayerInfos,
  [GamePhases.EndGame]: EndGame,
};

const Manager = () => {
  const [modalType, setModalType] = useState(game.modal.type);
  const [modalHide, setModalHide] = useState(game.modal.hide);

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
