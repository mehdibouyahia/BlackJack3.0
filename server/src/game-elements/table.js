import { v4 } from "uuid";
import { PlayerGameState, PlayerType, Rank } from "../constants.js";
import { Dealer } from "./dealer.js";
import { Player } from "./player.js";
import { Card } from "./card.js";

export class Table {
  constructor() {
    this.id = v4();
    this.allPlayers = [];
    this.dealer = null;
    this.currentPlayerIndex = null;
    this.deck = [];
    this.roundIsStarted = false;
  }

  get players() {
    return this.allPlayers.filter(
      (player) => player.playerType !== PlayerType.Parent
    );
  }

  get playingPlayers() {
    return this.allPlayers.filter((player) => !!player.hand.length);
  }

  get handsEmpty() {
    return this.players.every((player) => player.hand.length === 0);
  }

  get currentPlayer() {
    return typeof this.currentPlayerIndex === "number"
      ? this.players[this.currentPlayerIndex]
      : null;
  }

  get spots() {
    return this.players.reduce((result, player) => {
      if (player.spotId && !result[player.spotId]) {
        result[player.spotId] = [];
      }
      if (player.spotId) {
        result[player.spotId].push(player);
      }
      return result;
    }, {});
  }

  addPlayer(name, spotId, balance, id = v4(), parentPlayerId) {
    const player = this.players.find(
      (findedPlayer) => findedPlayer.spotId === spotId
    );
    if (!player) {
      const newPlayer = new Player(name, this.id, id, spotId, balance);
      const parentPlayer = this.allPlayers.find(
        (findedPlayer) => findedPlayer.id === parentPlayerId
      );
      newPlayer.parentPlayer = parentPlayer ?? null;
      this.allPlayers.push(newPlayer);
      return newPlayer;
    }
    return player;
  }

  playerRemove(player) {
    this.removeFakePlayers(player);
    const index = this.allPlayers.indexOf(player);
    if (index >= 0) {
      this.allPlayers.splice(index, 1);
    }
    if (this.handsEmpty) {
      this.dealer = null;
    }
  }

  removeFakePlayers(parent) {
    const filteredPlayers = this.players.filter(
      (player) => player.parentPlayer?.id === parent.id
    );

    for (const player of filteredPlayers) {
      while (this.currentPlayer?.id === player.id) {
        if (this.currentPlayerIndex !== null) {
          this.currentPlayerIndex++;
        }
      }
      const savedCurrentPlayer = this.currentPlayer;
      this.playerRemove(player);
      if (this.currentPlayerIndex !== null && savedCurrentPlayer) {
        this.currentPlayerIndex =
          this.players.indexOf(savedCurrentPlayer) ?? null;
      }
    }

    parent.roundIsEnded = false;
  }

  rebet(parent) {
    const filteredPlayers = this.players.filter(
      (player) => player.parentPlayer?.id === parent.id
    );
    for (const player of filteredPlayers) {
      this.playerRemove(player);
    }
    const playersWithBet = this.players.filter(
      (player) => player.parentPlayer?.id === parent.id
    );
    playersWithBet.forEach((player) => {
      player.hand = [];
      if (player.doubled) {
        player.betChips.splice(player.betChips.length / 2);
        player.doubled = false;
      }
    });
    parent.decreaseBalance(this.getPlayerBetChipsTotalWithChildren(parent));
    parent.roundIsEnded = false;
    if (this.handsEmpty) {
      this.dealer = null;
    }
  }

  deal() {
    this.roundIsStarted = true;
    this.dealer = new Dealer(this.id);
    this.createDeck();
    this.shuffleDeck();
    this.players.forEach((player) => {
      player.hand = [this.draw(), this.draw()];
    });
    this.dealer.hand = [this.draw(), this.draw()];

    this.currentPlayerIndex = 0;
  }

  hit() {
    if (this.currentPlayer?.hand) {
      this.currentPlayer.hand.push(this.draw());
    }
  }

  stand() {
    if (this.currentPlayerIndex !== null) {
      this.currentPlayerIndex++;
    }
  }

  double() {
    const player = this.currentPlayer;
    if (player && player.betChipsTotal <= player.balance) {
      player.decreaseBalance(player.betChipsTotal);
      player.betChips = player.betChips.concat(player.betChips);
      this.hit();
      this.stand();
      player.doubled = true;
    }
  }

  draw() {
    return this.deck.shift();
  }

  countWinnings() {
    this.players.forEach((player) => {
      const betSum = player.betChipsTotal;
      if (this.dealer) {
        switch (player.state) {
          case PlayerGameState.NaturalBlackjack:
            if (this.dealer.isNaturalBJ) {
              player.increaseBalance(betSum);
            } else {
              player.increaseBalance(betSum * 2);
            }
            break;

          case PlayerGameState.Blackjack:
            if (this.dealer.isBJ || this.dealer.isNaturalBJ) {
              player.increaseBalance(betSum);
            } else {
              player.increaseBalance(betSum * 2);
            }
            break;

          case PlayerGameState.Active:
            if (
              this.dealer.handTotal < player.handTotal ||
              this.dealer.isBust
            ) {
              player.increaseBalance(betSum * 2);
            } else if (this.dealer.handTotal === player.handTotal) {
              player.increaseBalance(betSum);
            }
            break;
        }
      }
      if (player.parentPlayer) {
        player.parentPlayer.roundIsEnded = true;
      }
    });
  }

  getPlayerBetChipsTotalWithChildren(findingPlayer) {
    const players = this.allPlayers.filter(
      (player) =>
        player.id === findingPlayer.id ||
        player.parentPlayer?.id === findingPlayer.id
    );
    const chips = players
      .map((player) => player.betChips)
      .reduce((a, b) => a.concat(b));
    return chips.length ? chips.reduce((bet1, bet2) => bet1 + bet2) : 0;
  }

  betDeleteByIndex(index, player) {
    player.increaseBalance(player.betChips[index]);
    player.betChips.splice(index, 1);
    if (player.betChips.length < 1) {
      this.playerRemove(player);
    }
  }

  createDeck() {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = [
      { rank: Rank.Ace, value: 11 },
      { rank: Rank.Two, value: 2 },
      { rank: Rank.Three, value: 3 },
      { rank: Rank.Four, value: 4 },
      { rank: Rank.Five, value: 5 },
      { rank: Rank.Six, value: 6 },
      { rank: Rank.Seven, value: 7 },
      { rank: Rank.Eight, value: 8 },
      { rank: Rank.Nine, value: 9 },
      { rank: Rank.Ten, value: 10 },
      { rank: Rank.Jack, value: 10 },
      { rank: Rank.Queen, value: 10 },
      { rank: Rank.King, value: 10 },
    ];

    for (const suit of suits) {
      for (const rank of ranks) {
        for (let i = 0; i < 6; i++) {
          this.deck.push(new Card(suit, rank.rank, rank.value, true));
        }
      }
    }
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
}
