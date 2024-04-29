import io from "socket.io-client";

export const Socket = io("http://localhost:5000");

export const Color = {
  Lime: "#00ff00",
  Won: "#33de1b",
  Lost: "red",
};

export const betValues = [
  { value: 5 },
  { value: 10 },
  { value: 20 },
  { value: 50 },
  { value: 100 },
  { value: 200 },
  { value: 500 },
  { value: 1000 },
];

export const Suit = {
  Hearts: "♥︎",
  Diamonds: "♦",
  Spades: "♠︎",
  Clubs: "♣",
};

export const Rank = {
  Ace: "ace",
  Two: "2",
  Three: "3",
  Four: "4",
  Five: "5",
  Six: "6",
  Seven: "7",
  Eight: "8",
  Nine: "9",
  Ten: "10",
  Jack: "jack",
  Queen: "queen",
  King: "king",
};

export const PlayerResult = {
  Bust: "Bust",
  Blackjack: "Blackjack",
  NaturalBlackjack: "Natural blackjack",
  Active: "Active",
  Lost: "Lost",
  Win: "Win",
  Error: "Error",
};

export const PlayerType = {
  Parent: "Parent",
  Player: "Player",
};

export const GameStatus = {
  WaitBets: "Waiting for the players to place their bets",
  ReadyToStart: "Ready to start",
  Playing: "Playing process",
  WaitEndAndBets: "Waiting for the players to finish the previous round",
};

export const ActionType = {
  Hit: "Hit",
  Stand: "Stand",
  Double: "Double",
};

export const EndGameActions = {
  NewBet: "NewBet",
  CashOut: "CashOut",
};

export const SocketOn = {
  TableCreated: "tableCreated",
  TableJoined: "tableJoined",
  ActionMade: "actionMade",
  DisconnectPlayer: "disconnectPlayer",
  BetUpdate: "betUpdate",
  Dealt: "dealt",
  DealerMadeAction: "dealerMadeAction",
  WinnersCounted: "winnersCounted",
  GameEnded: "gameEnded",
  CashOut: "cashOut",
  Error: "error",
  Message: "message",
  DealerWillHit: "dealerWillHit",
};

export const SocketEmit = {
  JoinTable: "join_table",
  CreateTable: "create_table",
  Action: "action",
  Deal: "deal",
  EndGame: "end_game",
  RemoveBet: "remove_bet",
  SetBet: "set_bet",
};

export const GamePhases = {
  CreateOrJoin: "CreateOrJoin",
  EndGame: "EndGame",
};
