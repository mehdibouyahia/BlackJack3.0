import { Card } from "./card";
import { game } from "./game";
import { Rank } from "../assets/constants";

export class Dealer {
  constructor(spotId, hand, roundIsEnded, id) {
    this.id = id;
    this.spotId = spotId;
    this.hand = hand;
    this.roundIsEnded = roundIsEnded;
  }

  get roundIsStarted() {
    return this.hand.length !== 2;
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

  update(dealer) {
    if (dealer) {
      const hand = dealer.hand
        ? dealer.hand.map(
            (card) =>
              new Card(card.suit, card.rank, card.value, card.id, card.isNew)
          )
        : [];

      this.hand = hand;
      this.roundIsEnded = dealer.roundIsEnded;
    } else if (game.table?.dealer) {
      game.table.dealer = null;
    }

    return this;
  }
}
