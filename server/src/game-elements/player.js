import { v4 } from "uuid";

import { PlayerType } from "../constants.js";

import { User } from "./gameUser.js";

export class Player extends User {
  constructor(_name, tableId, id = v4(), spotId = null, _balance = 100) {
    super(tableId);
    this._name = _name;
    this.spotId = spotId;
    this.id = id;
    this._balance = _balance;
    this.betChips = [];
    this.parentPlayer = null;
    this.roundIsEnded = false;
    this.doubled = false;
  }

  get playerType() {
    if (this.parentPlayer) {
      return PlayerType.Player;
    }
    return PlayerType.Parent;
  }

  get betChipsTotal() {
    return this.betChips.length
      ? this.betChips.reduce((bet1, bet2) => bet1 + bet2)
      : 0;
  }

  get balance() {
    if (this.playerType !== PlayerType.Parent && this.parentPlayer) {
      return this.parentPlayer._balance;
    } else {
      return this._balance;
    }
  }

  set balance(amount) {
    this._balance = amount;
  }

  get name() {
    return (
      this._name.charAt(0).toUpperCase() + this._name.slice(1).toLowerCase()
    );
  }

  set name(value) {
    this._name = value;
  }

  increaseBalance(amount) {
    if (this.playerType !== PlayerType.Parent && this.parentPlayer) {
      this.parentPlayer._balance = +this.parentPlayer._balance + amount;
    } else {
      this._balance = +this._balance + amount;
    }
  }

  decreaseBalance(amount) {
    if (this.playerType !== PlayerType.Parent && this.parentPlayer) {
      this.parentPlayer._balance = +this.parentPlayer._balance - amount;
    } else {
      this._balance = +this._balance - amount;
    }
  }

  bet(amount) {
    if (amount <= this.balance) {
      this.betChips.push(amount);
      this.decreaseBalance(amount);
    }
  }
}
