import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EndGameActions, SocketEmit } from "../../assets/constants";
import { StyledBtn } from "../App/App.styled";
import { ButtonsWrapper, Form } from "./Manager.styled";
import { SocketOn, Socket } from "../../assets/constants";
import { game } from "../../game-elements/game";
import { cashOut } from "../../game-elements/utils";

export const EndGame = () => {
  const navigate = useNavigate();
  useEffect(() => {
    Socket.on(SocketOn.CashOut, (data) => cashOut(data, navigate));

    // Cleanup on unmount
    return () => {
      Socket.off(SocketOn.CashOut, cashOut);
    };
  }, []);

  const handleEndGame = (action) => (e) => {
    e.stopPropagation();
    game.emit[SocketEmit.EndGame](action);
    game.modalUpdate(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <ButtonsWrapper>
        <StyledBtn onClick={handleEndGame(EndGameActions.NewBet)}>
          Replay
        </StyledBtn>
        <StyledBtn onClick={handleEndGame(EndGameActions.CashOut)}>
          Cash Out
        </StyledBtn>
      </ButtonsWrapper>
    </Form>
  );
};
