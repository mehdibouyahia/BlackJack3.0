import React, { useState, useEffect } from "react";
import { betValues } from "../../assets/constants";
import { game } from "../../game-elements/game";
import { Bet } from "./Bet";
import styled from "styled-components";

const BetPanelStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3vmin;
  width: 100%;
`;

export const BetPanel = () => {
  const betSize = 7;
  const [table, setTable] = useState(game.table);
  const [currentBetBtnValue, setCurrentBetBtnValue] = useState(
    table?.currentBetBtnValue
  );

  const handleBet = (value) => {
    setCurrentBetBtnValue(value);
    if (table) {
      table.currentBetBtnValue = value;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTable(game.table);
      setCurrentBetBtnValue(game.table?.currentBetBtnValue);
    }, 10); // Check for updates every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  if (table?.roundIsStarted) {
    return null;
  }

  return (
    <BetPanelStyled>
      {betValues.map((bet) => (
        <Bet
          key={`bet-${bet.value}`}
          value={bet.value}
          onBetSet={() => handleBet(bet.value)}
          size={betSize}
          active={currentBetBtnValue === bet.value}
        />
      ))}
    </BetPanelStyled>
  );
};
