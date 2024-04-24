import React, { useEffect, useState } from "react";

import { SpotStyled, SpotWrapper, Name } from "./Spot.styled";
import { SocketEmit } from "../../assets/constants";
import { PlayerComponent } from "./PlayerComponent";
import { game } from "../../game-elements/game";

export const PlayerSpotComponent = ({ id }) => {
  const gameTable = game.table;

  const [currentPlayer, setCurrentPlayer] = useState(game.table?.currentPlayer);
  const [roundIsStarted, setRoundIsStarted] = useState(
    game.table?.roundIsStarted
  );
  const [spots, setSpots] = useState(game.table?.spots[id]);
  const [dealer, setDealer] = useState(game.table?.dealer);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlayer(game.table?.currentPlayer);
      setRoundIsStarted(game.table?.roundIsStarted);
      setSpots(game.table?.spots[id]);
      setDealer(game.table?.dealer);
    }, 10); // Check for updates every second

    return () => clearInterval(interval); // Clean up on unmount
  }, [id]);

  let className = [];
  if (currentPlayer && currentPlayer.spotId === id) {
    className.push("active");
  }

  if (spots && !spots[id] && !dealer) {
    className.push("empty");
  }

  if (roundIsStarted) {
    className.push("disabled");
  }

  let spotClass = className.join(" ");

  const handleSetNewBet = () => {
    if (
      // gameTable &&
      game.player?.canBetAtThisSpot(id) &&
      !roundIsStarted
    ) {
      game.emit[SocketEmit.SetBet](id);
    }
  };

  return (
    <SpotWrapper className="spot">
      <Name>{game.getNameBySpotId(id)}</Name>
      <SpotStyled onClick={handleSetNewBet} className={spotClass}>
        <div>
          {gameTable?.spots[id] &&
            gameTable.spots[id].map((player) => (
              <div key={`${player.id}-player`}>
                <PlayerComponent player={player} spotId={id} />
              </div>
            ))}
        </div>
      </SpotStyled>
    </SpotWrapper>
  );
};
