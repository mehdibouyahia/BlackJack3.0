import { v4 } from "uuid";

import { User } from "./gameUser.js";

export class Dealer extends User {
  constructor(tableId) {
    super(tableId);
    this.id = v4();
    this.spotId = v4();
    this.hand = [];
  }
}
