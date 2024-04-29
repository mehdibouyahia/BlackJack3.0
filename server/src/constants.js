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

export const PlayerGameState = {
  Bust: "Bust",
  Blackjack: "Blackjack",
  NaturalBlackjack: "NaturalBlackjack",
  Active: "Active",
  Error: "Error",
};

export const PlayerType = {
  Parent: "Parent",
  Player: "Player",
};

export const EndGameActions = {
  NewBet: "NewBet",
  CashOut: "CashOut",
};

export const ActionType = {
  Hit: "Hit",
  Stand: "Stand",
  Double: "Double",
};

export const SocketEmit = {
  TableCreated: "tableCreated",
  TableJoined: "tableJoined",
  ActionMade: "actionMade",
  DisconnectPlayer: "disconnectPlayer",
  BetUpdate: "betUpdate",
  Dealt: "dealt",
  DealerMadeAction: "dealerMadeAction",
  DealerWillHit: "dealerWillHit",
  WinnersCounted: "winnersCounted",
  GameEnded: "gameEnded",
  CashOut: "cashOut",
  Error: "error",
  Message: "message",
};

export const SocketOn = {
  JoinTable: "join_table",
  CreateTable: "create_table",
  Action: "action",
  Deal: "deal",
  EndGame: "end_game",
  RemoveBet: "remove_bet",
  SetBet: "set_bet",
  Connect: "connect",
  Disconnect: "disconnect",
};

export const BaseMessages = {
  Error: "Error",
  NoTable: "Table doesn't exist!",
  NoMoney: "Insufficient funds!",
  PlayerLost: "Connection lost, please re login.",
  ProhibitedAction: "Prohibited action",
};
