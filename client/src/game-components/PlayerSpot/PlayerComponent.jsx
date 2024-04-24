import React, { useCallback, useRef, useEffect, useState } from "react";

import { CardsWrapper, ChipsWrapper, CardsTotal } from "./Spot.styled";
import { CardComponent } from "../Card/Card";
import { SocketEmit } from "../../assets/constants";
import { game } from "../../game-elements/game";
import { Bet } from "../BetPanel/Bet";

export const PlayerComponent = ({ player, spotId }) => {
  const [roundIsStarted, setRoundIsStarted] = useState(
    game.table?.roundIsStarted
  );
  const [currentPlayer, setCurrentPlayer] = useState(game.table?.currentPlayer);
  const [hand, setHand] = useState(player.hand);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoundIsStarted(game.table?.roundIsStarted);
      setCurrentPlayer(game.table?.currentPlayer);
      setHand(player.hand);
    }, 10); // Check for updates every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleRemoveBet = useCallback(
    (index) => (e) => {
      e.stopPropagation();
      if (!roundIsStarted && game.player?.canBetAtThisSpot(spotId)) {
        game.emit[SocketEmit.RemoveBet](player.id, index);
      }
    },
    [player.id, spotId]
  );

  const cardRef = useRef(null);
  const activeClassName = player.id === currentPlayer?.id ? "active" : "";

  return (
    <div className={activeClassName}>
      <ChipsWrapper>
        {
          /* Bet */
          player.betChips.map((bet, index) => (
            <Bet
              key={`${player}-bet${index}-${bet}`}
              value={bet}
              onBetSet={handleRemoveBet(index)}
              size={5.5}
              active={false}
            />
          ))
        }
      </ChipsWrapper>
      <CardsWrapper ref={cardRef} id={`${spotId}Cardholder`}>
        {(hand || []).map((card) => (
          <CardComponent
            key={`${card.id}-Card`}
            suit={card.suit}
            rank={card.rank}
            id={card.id}
          />
        ))}
        {player.handTotal > 0 && (
          <CardsTotal
            className={
              player.isBust
                ? "bust"
                : player.isBJ || player.isNaturalBJ
                ? "bj"
                : ""
            }
          >
            {player.handTotal}
          </CardsTotal>
        )}
      </CardsWrapper>
    </div>
  );
};
