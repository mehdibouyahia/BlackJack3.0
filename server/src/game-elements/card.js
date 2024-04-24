import { v4 } from "uuid";

export class Card {
  constructor(suit, rank, value, isNew = true) {
    this.id = v4();
    this.suit = suit;
    this.rank = rank;
    this.value = value;
    this.isNew = isNew;
  }
}
