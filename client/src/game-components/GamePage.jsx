import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { BalanceStyled, OptionsPanel, GameWrapper } from "./GamePage.styled";
import { StyledBtn, toastSettings } from "../components/App/App.styled";
import { GameActions } from "./GameActions";
import { DealerSpotComponent } from "./PlayerSpot/DealerSpot";
import { PlayerSpotComponent } from "./PlayerSpot/PlayerSpot";
import {
  GamePhases,
  SocketEmit,
  EndGameActions,
  Socket,
  SocketOn,
} from "../assets/constants";
import { SpotsZone } from "./PlayerSpot/Spot.styled";
import { BetPanel } from "./BetPanel/BetPanel";
import { game } from "../game-elements/game";
import { cashOut } from "../game-elements/utils";

const GamePage = () => {
  const navigate = useNavigate();
  const [ableToStartGame, setAbleToStartGame] = useState(
    game.table?.ableToStartGame
  );
  const [gameStatus, setGameStatus] = useState(game.table?.gameStatus);
  const [roundIsStarted, setRoundIsStarted] = useState(
    game.table?.roundIsStarted
  );
  const [roundIsEnded, setRoundIsEnded] = useState(game.player?.roundIsEnded);
  const [betChipsTotalWithChildren, setBetChipsTotalWithChildren] = useState(
    game.player?.betChipsTotalWithChildren
  );
  const [balance, setBalance] = useState(game.player?.balance);

  useEffect(() => {
    const interval = setInterval(() => {
      setAbleToStartGame(game.table?.ableToStartGame);
      setGameStatus(game.table?.gameStatus);
      setRoundIsStarted(game.table?.roundIsStarted);
      setRoundIsEnded(game.player?.roundIsEnded);
      setBetChipsTotalWithChildren(game.player?.betChipsTotalWithChildren);
      setBalance(game.player?.balance);
    }, 10); // Check for updates every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  useEffect(() => {
    if (!(game.table && game.player)) {
      navigate("/");
      game.modalUpdate(false, GamePhases.CreateOrJoin);
    }
  }, [navigate]);

  useEffect(() => {
    if (roundIsEnded) {
      game.modalUpdate(false, GamePhases.EndGame);
    }
  }, [roundIsEnded]);

  useEffect(() => {
    Socket.on(SocketOn.CashOut, (data) => cashOut(data, navigate));

    return () => {
      Socket.off(SocketOn.CashOut, cashOut);
    };
  }, []);

  const handlePlayBtn = () => {
    game.emit[SocketEmit.Deal]();
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(game.table?.id ?? "")
      .then(() => {
        toast("Table id successfully copied!", toastSettings);
      })
      .catch(() => {
        toast.error("Failed to copy!", toastSettings);
      });
  };

  const handleCashOut = (action) => (e) => {
    e.stopPropagation();
    game.emit[SocketEmit.EndGame](action);
    game.modalUpdate(true);
  };

  const spotsZone = (
    <SpotsZone>
      {Array.from({ length: 5 }).map((_, index) => (
        <PlayerSpotComponent key={index} id={`spot-${index}`} />
      ))}
    </SpotsZone>
  );

  const playButtonOrGameStatus =
    ableToStartGame && betChipsTotalWithChildren ? (
      <StyledBtn onClick={handlePlayBtn}>PLAY</StyledBtn>
    ) : ableToStartGame ? (
      balance && balance > 5 ? (
        <div>No empty spots left</div>
      ) : (
        <div>Insufficient funds! </div>
      )
    ) : (
      <div>{gameStatus}</div>
    );

  const gameActionsComponent = roundIsStarted && <GameActions />;

  const copyTableIdBtn = (
    <StyledBtn onClick={handleCopyClick}>Copy Table ID</StyledBtn>
  );

  const CashOutBtn = !roundIsStarted && (
    <StyledBtn onClick={handleCashOut(EndGameActions.CashOut)}>
      Cash out
    </StyledBtn>
  );

  return (
    <>
      <OptionsPanel>
        {CashOutBtn}
        {copyTableIdBtn}
      </OptionsPanel>
      <BalanceStyled>
        <div>{balance}</div>
      </BalanceStyled>

      <GameWrapper>
        <DealerSpotComponent />
        {spotsZone}
      </GameWrapper>

      <div className="buttons">
        <BetPanel />
        {playButtonOrGameStatus}
        {gameActionsComponent}
      </div>
    </>
  );
};

export default GamePage;
