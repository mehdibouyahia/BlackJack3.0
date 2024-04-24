import { v4 } from "uuid";

import { PlayerGameState, Rank } from "../constants.js";

export class User {
  constructor(tableId) {
    this.id = v4();
    this.spotId = v4();
    this.hand = [];
    this.tableId = tableId;
  }

  get roundIsStarted() {
    return this.hand.length > 2;
  }

  get handTotal() {
    let total = this.hand.reduce((sum, card) => sum + card.value, 0);
    const aces = this.hand.filter((card) => card.rank === Rank.Ace);
    while (aces.length > 0 && total > 21) {
      total -= 10;
      aces.pop();
    }
    return total;
  }

  get canHit() {
    return this.handTotal < 17;
  }

  get state() {
    if (this.handTotal > 21) {
      return PlayerGameState.Bust;
    }
    if (this.handTotal === 21 && !this.roundIsStarted) {
      return PlayerGameState.NaturalBlackjack;
    }
    if (this.handTotal === 21) {
      return PlayerGameState.Blackjack;
    }
    if (this.handTotal < 21 && this.handTotal > 0) {
      return PlayerGameState.Active;
    }
    return PlayerGameState.Error;
  }

  get isNaturalBJ() {
    return this.state === PlayerGameState.NaturalBlackjack;
  }

  get isBJ() {
    return this.state === PlayerGameState.Blackjack;
  }

  get isBust() {
    return this.state === PlayerGameState.Bust;
  }

  get isActive() {
    return this.state === PlayerGameState.Active;
  }

  get isError() {
    return this.state === PlayerGameState.Error;
  }
}
