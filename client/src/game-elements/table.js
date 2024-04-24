import { Card } from "./card";
import { game } from "./game";
import { Player } from "./player";
import { GameStatus, PlayerType } from "../assets/constants";

export class Table {
  constructor(id) {
    this.id = id;
    this.allPlayers = [];
    this.currentBetBtnValue = 5;
    this._dealer = null;
    this._currentPlayerIndex = null;
    this._roundIsStarted = false;
  }

  get players() {
    return this.allPlayers.filter(
      (player) => player.playerType !== PlayerType.Parent
    );
  }

  get playingPlayers() {
    return this.allPlayers.filter((player) => !!player.hand.length);
  }

  get parentPlayers() {
    return this.allPlayers.filter(
      (player) => player.playerType === PlayerType.Parent
    );
  }

  get currentPlayer() {
    return typeof this._currentPlayerIndex === "number"
      ? this.players[this._currentPlayerIndex]
      : null;
  }

  get spots() {
    return this.players.reduce((result, player) => {
      if (!result[player.spotId]) {
        result[player.spotId] = [];
      }
      result[player.spotId].push(player);
      return result;
    }, {});
  }

  get gameStatus() {
    if (
      this.parentPlayers.some(
        (parentPlayer) =>
          !this.players.find(
            (player) => player.parentPlayer?.id === parentPlayer.id
          )
      ) &&
      this.parentPlayers.every(
        (player) => player.balance >= 5 || player.betChipsTotalWithChildren
      ) &&
      Object.keys(this.spots).length < 5 &&
      !this._dealer
    ) {
      return GameStatus.WaitBets;
    }
    if (this._dealer?.hand.length) {
      return GameStatus.Playing;
    }
    if (!!this.playingPlayers.length) {
      return GameStatus.WaitEndAndBets;
    }
    return GameStatus.ReadyToStart;
  }

  get ableToStartGame() {
    return (
      this.players.length > 0 &&
      !this._dealer &&
      this.players.every((player) => player.betChipsTotal) &&
      this.gameStatus === GameStatus.ReadyToStart &&
      this.playingPlayers.length === 0
    );
  }

  set dealer(value) {
    this._dealer = value;
  }
  get dealer() {
    return this._dealer;
  }

  set roundIsStarted(value) {
    this._roundIsStarted = value;
  }
  get roundIsStarted() {
    return this._roundIsStarted;
  }

  set currentPlayerIndex(value) {
    this._currentPlayerIndex = value;
  }
  get currentPlayerIndex() {
    return this._currentPlayerIndex;
  }

  addPlayer(player) {
    const hand = player.hand
      ? player.hand.map(
          (card) =>
            new Card(card.suit, card.rank, card.value, card.id, card.isNew)
        )
      : [];

    const parentPlayer = player.parentPlayer
      ? game.findPlayerById(player.parentPlayer?.id)
      : null;
    if (parentPlayer && player.parentPlayer) {
      parentPlayer.update(player.parentPlayer);
    }

    const newPlayer = new Player(
      player._name,
      player.spotId,
      hand,
      player.roundIsEnded,
      player.betChips,
      parentPlayer ?? null,
      player._balance,
      player.id
    );
    this.allPlayers.push(newPlayer);
    return newPlayer;
  }

  playerRemove(playerForRemoving) {
    const index = this.allPlayers.indexOf(playerForRemoving);
    if (index !== -1) {
      this.allPlayers.splice(index, 1);
    }
  }
}
