import { toast } from "react-toastify";
import { toastSettings } from "../components/App/App.styled";
import {
  ActionType,
  GamePhases,
  SocketEmit,
  SocketOn,
  Socket,
} from "../assets/constants";
import { Dealer } from "./dealer";
import { Table } from "./table";
import { Card } from "./card";
import equal from "fast-deep-equal";
import axios from "axios";

export class Game {
  constructor() {
    Socket.on(SocketOn.Error, (message) => toast.error(message, toastSettings));

    Socket.on(SocketOn.Message, (message) => {
      toast(message, toastSettings);
    });

    Socket.on(SocketOn.TableJoined, (table) => {
      this.onTableJoined(JSON.parse(table));
      this.modalUpdate(true);
    });

    Socket.on(SocketOn.DisconnectPlayer, (tableStr) => {
      this.handleTableUpdate(tableStr);
    });

    Socket.on(SocketOn.BetUpdate, (playersStr) => {
      this.updateAllPlayersArray(JSON.parse(playersStr));
    });

    Socket.on(SocketOn.Dealt, (tableStr) => {
      this.allActionsMade = false;
      this.handleTableUpdate(tableStr);

      this.handleAdditionalStand();
    });

    Socket.on(SocketOn.ActionMade, (tableStr, actionType) => {
      this.handleTableUpdate(tableStr);
      switch (actionType) {
        case ActionType.Hit:
        case ActionType.Double:
          break;
      }

      this.handleAdditionalStand();
    });

    Socket.on(SocketOn.DealerMadeAction, (tableStr, actionType) => {
      this.dealerActionsHip.push({ table: tableStr, action: actionType });
    });

    Socket.on(SocketOn.WinnersCounted, (tableStr) => {
      this.dealerActionsHip.push({ table: tableStr, action: undefined });

      this.handleDealerActionsAndWinnerCounting();
    });

    Socket.on(SocketOn.GameEnded, (tableStr) => {
      this.handleTableUpdate(tableStr);
      if (
        this.table?.dealer &&
        !this.table?.roundIsStarted &&
        this.player?.handIsEmpty
      ) {
        this.table.dealer = null;
      }
      if (this.player?.handIsEmpty) {
        this.modalUpdate(true);
      }
    });
  }

  player = null;
  table = null;
  allActionsMade = false;
  modal = {
    type: GamePhases.CreateOrJoin,
    hide: false,
  };

  emit = {
    [SocketEmit.JoinTable]: (tableId, name, balance) => {
      Socket.emit(SocketEmit.JoinTable, tableId, name, balance);
    },
    [SocketEmit.CreateTable]: (name, balance) => {
      Socket.emit(SocketEmit.CreateTable, name, balance);
    },
    [SocketEmit.EndGame]: (endGameAction) => {
      Socket.emit(
        SocketEmit.EndGame,
        this.table?.id,
        this.player?.id,
        endGameAction
      );
    },
    [SocketEmit.Deal]: () => {
      Socket.emit(SocketEmit.Deal, this.table?.id);
    },
    [SocketEmit.Action]: (actionType) => {
      Socket.emit(
        SocketEmit.Action,
        actionType,
        this.table?.id,
        this.table?.currentPlayer?.id
      );
    },
    [SocketEmit.SetBet]: (spotId) => {
      Socket.emit(
        SocketEmit.SetBet,
        this.table?.id,
        spotId,
        this.player?.id,
        this.table?.currentBetBtnValue ?? 0
      );
    },
    [SocketEmit.RemoveBet]: (playerId, betIndex) => {
      Socket.emit(SocketEmit.RemoveBet, this.table?.id, playerId, betIndex);
    },
  };

  dealerActionsHip = [];

  onTableCreated(table, player) {
    this.table = new Table(table.id);
    this.updateTableInfo(table);
    this.player = this.findPlayerById(player.id) ?? null;
  }

  onTableJoined(table) {
    this.updateAllPlayersArray(table.allPlayers);
  }

  modalUpdate(hide, type = this.modal.type) {
    this.modal.type = type;
    this.modal.hide = hide;
  }

  findPlayerById(playerId) {
    const table = this.table;
    return table
      ? table.allPlayers.find((player) => player.id === playerId)
      : undefined;
  }

  getNameBySpotId(id) {
    const spot = this.table?.spots[id];
    if (spot) {
      const spotParent = spot ? spot[0].parentPlayer : undefined;
      const name = spotParent ? spotParent.name : "";
      return name;
    } else {
      return "";
    }
  }

  handleAdditionalStand() {
    if (
      this.player?.id === this.table?.currentPlayer?.id ||
      this.player?.id === this.table?.currentPlayer?.parentPlayer?.id
    ) {
      if (
        this.table?.currentPlayer?.isBJ ||
        this.table?.currentPlayer?.isBust ||
        this.table?.currentPlayer?.isNaturalBJ
      ) {
        (() => {
          try {
            setTimeout(() => {
              this.emit[SocketEmit.Action](ActionType.Stand);
            }, 600);
          } catch (error) {
            console.error(error);
          }
        })();
      }
    }
  }

  handleDealerActionsAndWinnerCounting = async () => {
    while (this.dealerActionsHip.length) {
      const data = this.dealerActionsHip.shift();
      const table = data?.table;
      if (table) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.dealerActionsHip.length ? 1000 : 1500)
        );
        this.handleTableUpdate(table);
        if (this.dealerActionsHip.length === 1) {
          this.allActionsMade = true;
        }
      }
    }
  };

  handleTableUpdate(tableStr) {
    const table = JSON.parse(tableStr);
    this.updateTableInfo(table);
  }

  updateAllPlayersArray(source) {
    const target = JSON.parse(JSON.stringify(this.table?.allPlayers));

    source.forEach((player) => {
      const findedObjPlayer = target.find(
        (findedPlayer) => findedPlayer.id === player.id
      );
      if (findedObjPlayer && !equal(player, findedObjPlayer)) {
        const realPlayer = this.findPlayerById(findedObjPlayer.id);
        realPlayer?.update(player);
      } else if (!findedObjPlayer) {
        const index = source.indexOf(player);
        const newPlayer = this.table?.addPlayer(player);
        if (newPlayer) {
          this.table?.allPlayers.splice(-1);
          this.table?.allPlayers.splice(index, 0, newPlayer);
        }
      }
      if (target.length > source.length) {
        target
          .filter(
            (targetPlayer) =>
              !source.find(
                (findedPlayer) => findedPlayer.id === targetPlayer.id
              )
          )
          .forEach((targetPlayer) => {
            const realPlayer = this.findPlayerById(targetPlayer.id);
            if (realPlayer) {
              this.table?.playerRemove(realPlayer);
            }
          });
      }
    });
  }

  updateTableInfo(table) {
    const dealerHand =
      table.dealer?.hand.map(
        (card) =>
          new Card(card.suit, card.rank, card.value, card.id, card.isNew)
      ) ?? [];

    let dealer = null;
    if (table.dealer) {
      dealer = this.table?.dealer
        ? this.table.dealer.update(table.dealer)
        : new Dealer(
            table.dealer.spotId,
            dealerHand,
            table.dealer.roundIsEnded,
            table.dealer.id
          );
    }

    if (this.table) {
      this.table.dealer = dealer;
      this.table.roundIsStarted = table.roundIsStarted;
      this.table.currentPlayerIndex = table.currentPlayerIndex;
      this.updateAllPlayersArray(table.allPlayers);
    }
  }
}

export const game = new Game();
