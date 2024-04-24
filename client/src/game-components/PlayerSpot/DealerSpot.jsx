import React, { useEffect, useState } from "react";

import { CardsTotal, CardsWrapper, SpotStyled } from "./Spot.styled";
import { CardComponent } from "../Card/Card";
import { game } from "../../game-elements/game";
import { SocketOn, Socket } from "../../assets/constants";

export const DealerSpotComponent = () => {
  const [dealer, setDealer] = useState(game.table?.dealer);
  const [hand, setHand] = useState(game.table?.dealer?.hand);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDealer(game.table?.dealer);
      setHand(game.table?.dealer?.hand);
    }, 10); // Check for updates every second

    Socket.on(SocketOn.DealerWillHit, () => {
      setHidden(true);
    });
    Socket.on(SocketOn.GameEnded, () => {
      setHidden(false);
    });

    return () => {
      clearInterval(interval); // Clean up on unmount
      // Socket.off(SocketOn.hidden);
      // Socket.off(SocketOn.GameEnded);
    };
  }, []);

  return (
    <SpotStyled className="dealer">
      <CardsWrapper>
        {(hand || []).map((card, index) => (
          <CardComponent
            key={`dealerCard-${card.id}`}
            suit={card.suit}
            rank={card.rank}
            id={card.id}
            isHidden={index === 1 && !hidden}
          />
        ))}
        {dealer && dealer.handTotal > 0 && hidden && (
          <CardsTotal>{dealer?.handTotal}</CardsTotal>
        )}
      </CardsWrapper>
    </SpotStyled>
  );
};
