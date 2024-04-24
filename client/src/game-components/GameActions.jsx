import React, { useEffect, useState } from "react";
import { ButtonsWrapper } from "../components/Manager/Manager.styled";
import { ActionType, SocketEmit, SocketOn, Socket } from "../assets/constants";
import { StyledBtn } from "../components/App/App.styled";
import { game } from "../game-elements/game";

export const GameActions = () => {
  const { player } = game;

  const [currentPlayer, setCurrentPlayer] = useState(game.table?.currentPlayer);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlayer(game.table?.currentPlayer);
    }, 10); // Check for updates every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleAction = (actionType) => () => {
    game.emit[SocketEmit.Action](actionType);
    setButtonsDisabled(true);
  };

  useEffect(() => {
    Socket.on(SocketOn.ActionMade, () => {
      setButtonsDisabled(false);
    });
  }, [buttonsDisabled]);

  if (!player?.isTurn) {
    return null;
  }

  const actionsButtons = (
    <ButtonsWrapper>
      {currentPlayer?.canHit && (
        <StyledBtn
          disabled={buttonsDisabled}
          onClick={handleAction(ActionType.Hit)}
        >
          Hit
        </StyledBtn>
      )}
      {currentPlayer?.canHit && (
        <StyledBtn
          disabled={buttonsDisabled}
          onClick={handleAction(ActionType.Stand)}
        >
          Stand
        </StyledBtn>
      )}

      {currentPlayer?.canDouble && (
        <StyledBtn
          disabled={buttonsDisabled}
          onClick={handleAction(ActionType.Double)}
        >
          Double
        </StyledBtn>
      )}
    </ButtonsWrapper>
  );

  return <>{actionsButtons}</>;
};
