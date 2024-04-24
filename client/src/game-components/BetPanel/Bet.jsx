import React from "react";
import { game } from "../../game-elements/game";
import { StyledBtn } from "../../components/App/App.styled";

export const Bet = ({ value, onBetSet = () => {} }) => {
  return (
    <>
      <StyledBtn
        type="submit"
        onClick={onBetSet}
        disabled={game.table?.roundIsStarted}
      >
        {value}
      </StyledBtn>
    </>
  );
};
