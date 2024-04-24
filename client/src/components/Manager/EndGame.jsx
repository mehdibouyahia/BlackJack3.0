import React from "react";

import { EndGameActions, SocketEmit } from "../../assets/constants";
import { StyledBtn } from "../App/App.styled";
import { ButtonsWrapper, Form } from "./Manager.styled";
import { game } from "../../game-elements/game";

export const EndGame = () => {
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
      </ButtonsWrapper>
    </Form>
  );
};
