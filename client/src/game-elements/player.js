import { PlayerResult, PlayerType } from "../assets/constants";
import { Dealer } from "./dealer";
import { Card } from "./card";
import { game } from "./game";

export class Player extends Dealer {
  constructor(
    _name,
    spotId,
    hand,
    roundIsEnded,
    betChips,
    parentPlayer,
    _balance,
    id
  ) {
    super(spotId, hand, roundIsEnded, id);
    this._name = _name;
    this.betChips = betChips;
    this.parentPlayer = parentPlayer;
    this._balance = _balance;
  }

  get betChipsTotal() {
    return this.betChips.length
      ? this.betChips.reduce((bet1, bet2) => bet1 + bet2)
      : 0;
  }

  get betChipsTotalWithChildren() {
    if (game.table) {
      const players = game.table.allPlayers.filter(
        (player) => player.id === this.id || player.parentPlayer?.id === this.id
      );
      const chips = players
        .map((player) => player.betChips)
        .reduce((a, b) => a.concat(b));
      return chips.length ? chips.reduce((bet1, bet2) => bet1 + bet2) : 0;
    }
    return 0;
  }

  get balance() {
    // return this.playerType !== PlayerType.Parent && this.parentPlayer
    //   ? this.parentPlayer._balance
    //   : this._balance;
    return this._balance;
  }

  get playerType() {
    return this.parentPlayer ? PlayerType.Player : PlayerType.Parent;
  }

  get isTurn() {
    return (
      game.table?.currentPlayer?.id === this.id ||
      game.table?.currentPlayer?.parentPlayer?.id === this?.id
    );
  }

  get canHit() {
    return this.isActive;
  }

  get canDouble() {
    return this.isActive && !this.roundIsStarted;
  }

  get state() {
    if (this.handTotal > 21) {
      return PlayerResult.Bust;
    }
    if (this.handTotal === 21 && !this.roundIsStarted) {
      return PlayerResult.NaturalBlackjack;
    }
    if (this.handTotal === 21) {
      return PlayerResult.Blackjack;
    }
    if (
      this.handTotal < 21 &&
      this.handTotal > 0 &&
      game.table?.dealer &&
      game.table.dealer.handTotal > this.handTotal &&
      game.table.dealer.handTotal <= 21 &&
      game.allActionsMade
    ) {
      return PlayerResult.Lost;
    } else if (
      this.handTotal < 21 &&
      this.handTotal > 0 &&
      game.table?.dealer &&
      (game.table.dealer.handTotal <= this.handTotal ||
        game.table.dealer.handTotal > 21) &&
      game.allActionsMade
    ) {
      return PlayerResult.Win;
    } else if (this.handTotal < 21 && this.handTotal > 0) {
      return PlayerResult.Active;
    }
    return PlayerResult.Error;
  }

  get isNaturalBJ() {
    return this.state === PlayerResult.NaturalBlackjack;
  }

  get isBJ() {
    return this.state === PlayerResult.Blackjack;
  }

  get isBust() {
    return this.state === PlayerResult.Bust;
  }

  get isActive() {
    return this.state === PlayerResult.Active;
  }

  get handIsEmpty() {
    const playingChildren = game.table?.playingPlayers.filter(
      (player) => player.id === this.id || player.parentPlayer?.id === this.id
    );
    return playingChildren?.length === 0;
  }

  canBetAtThisSpot(spotId) {
    const table = game.table;
    const players = table?.spots[spotId];
    if (players && players.length > 0) {
      return players.every(
        (player) =>
          player.id === this.id ||
          (player.parentPlayer && player.parentPlayer.id === this.id)
      );
    } else {
      return true;
    }
  }

  set name(value) {
    this._name = value;
  }

  get name() {
    return (
      this._name.charAt(0).toUpperCase() + this._name.slice(1).toLowerCase()
    );
  }

  update(player) {
    const hand = player.hand
      ? player.hand.map(
          (card) =>
            new Card(card.suit, card.rank, card.value, card.id, card.isNew)
        )
      : [];

    const parentPlayer = player.parentPlayer
      ? game.findPlayerById(player.parentPlayer?.id)
      : null;

    if (player.parentPlayer) {
      parentPlayer?.update(player.parentPlayer);
    }

    if (this.spotId !== player.spotId) {
      this.spotId = player.spotId;
    }

    if (this.roundIsEnded !== player.roundIsEnded) {
      this.roundIsEnded = player.roundIsEnded;
    }

    if (this._name !== player._name) {
      this._name = player._name;
    }

    this.hand = hand;
    this.betChips = player.betChips;
    this.parentPlayer = parentPlayer ?? null;
    this._balance = player._balance;

    return this;
  }
}
