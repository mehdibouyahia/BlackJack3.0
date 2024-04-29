import { Server } from "socket.io";
import { Table } from "./game-elements/table.js";
import {
  EndGameActions,
  ActionType,
  SocketEmit,
  SocketOn,
  BaseMessages,
} from "./constants.js";
import { User } from "./models/User.js";

export class GameSocket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.tables = {};

    this.io.on(SocketOn.Connect, this.startListeners);
  }

  startListeners = (socket) => {
    console.info(`Message received from ${socket.id}`);

    socket.on(SocketOn.CreateTable, (name, balance) => {
      try {
        const table = new Table();
        const player = table.addPlayer(name, "", balance, socket.id);

        this.tables[table.id] = table;
        socket.join(table.id);

        console.info(`${SocketEmit.TableCreated}: ${table.id}`);
        socket.emit(
          SocketEmit.TableCreated,
          JSON.stringify(table),
          JSON.stringify(player)
        );
      } catch (error) {
        this.handleError(error, socket);
      }
    });

    socket.on(SocketOn.JoinTable, async (tableId, name, balance) => {
      try {
        const table = this.tables[tableId];
        if (!table) {
          throw new Error(BaseMessages.NoTable);
        }

        const player = table.addPlayer(name, "", balance, socket.id);

        await socket.join(table.id);

        console.info(`${SocketEmit.TableJoined}: ${table.id}`);
        socket.broadcast
          .to(tableId)
          .emit(SocketEmit.Message, `${player.name} has joined`);
        socket.broadcast
          .to(table.id)
          .emit(SocketEmit.TableJoined, JSON.stringify(table));
        socket.emit(
          SocketEmit.TableCreated,
          JSON.stringify(table),
          JSON.stringify(player)
        );
      } catch (error) {
        this.handleError(error, socket);
      }
    });

    socket.on(SocketOn.SetBet, (tableId, spotId, parentId, amount) => {
      try {
        const table = this.tables[tableId];
        if (!table) {
          throw new Error(BaseMessages.NoTable);
        }

        const parent = this.findPlayerById(parentId, table);
        if (!parent) {
          throw new Error(BaseMessages.PlayerLost);
        }

        if (amount > parent.balance) {
          throw new Error(BaseMessages.NoMoney);
        }

        if (!table.roundIsStarted) {
          const player = table.spots[spotId]
            ? table.spots[spotId][0]
            : table.addPlayer("", spotId, 0, undefined, parentId);

          player.bet(amount);

          console.info(`betSetted player ${parentId}`);
          this.io
            .to(table.id)
            .emit(SocketEmit.BetUpdate, JSON.stringify(table.allPlayers));
        }
      } catch (error) {
        this.handleError(error, socket);
      }
    });

    socket.on(SocketOn.RemoveBet, (tableId, playerId, betIndex) => {
      try {
        const table = this.tables[tableId];
        if (!table) {
          throw new Error(BaseMessages.NoTable);
        }

        const player = this.findPlayerById(playerId, table);
        if (!player) {
          throw new Error(BaseMessages.PlayerLost);
        }

        table.betDeleteByIndex(betIndex, player);

        console.info(`betRemoved player ${player.parentPlayer?.id}`);
        this.io
          .to(table.id)
          .emit(SocketEmit.BetUpdate, JSON.stringify(table.allPlayers));
      } catch (error) {
        this.handleError(error, socket);
      }
    });

    socket.on(SocketOn.Deal, (tableId) => {
      try {
        const table = this.tables[tableId];

        if (!table) {
          throw new Error(BaseMessages.NoTable);
        }

        if (!Object.keys(table.spots).length) {
          throw new Error(BaseMessages.ProhibitedAction);
        }

        table.deal();

        console.info(`${SocketEmit.Dealt} ${table.id}`);
        this.io.to(table.id).emit(SocketEmit.Dealt, JSON.stringify(table));
      } catch (error) {
        this.handleError(error, socket);
      }
    });

    socket.on(SocketOn.Action, (actionType, tableId, playerId) => {
      try {
        const table = this.tables[tableId];

        if (!table) {
          throw new Error(BaseMessages.NoTable);
        }

        const player = this.findPlayerById(playerId, table);
        if (!player) {
          throw new Error(BaseMessages.PlayerLost);
        }

        if (table.currentPlayer && player.id !== table.currentPlayer.id) {
          throw new Error(BaseMessages.ProhibitedAction);
        }

        table.playingPlayers.forEach((plPlayer) => {
          const hand = plPlayer.hand;
          const filtredHand = hand.filter((card) => card.isNew);
          for (const newCard of filtredHand) {
            newCard.isNew = false;
          }
        });

        switch (actionType) {
          case ActionType.Hit:
            table.hit();
            break;

          case ActionType.Double:
            if (player.betChipsTotal > player.balance) {
              throw new Error(BaseMessages.NoMoney);
            }
            table.double();
            break;

          case ActionType.Stand:
            table.stand();
            break;
        }

        console.info(
          `${SocketEmit.ActionMade} ${player.parentPlayer?.id}  ${actionType}`
        );
        this.io
          .to(table.id)
          .emit(SocketEmit.ActionMade, JSON.stringify(table), actionType);

        if (
          table.dealer &&
          table.currentPlayerIndex === table.playingPlayers.length
        ) {
          this.io
            .to(table.id)
            .emit(SocketEmit.DealerWillHit, JSON.stringify(table), actionType);

          while (table.dealer.canHit) {
            table.dealer.hand.push(table.draw());

            console.info(`${SocketEmit.ActionMade} by dealer ${table.id}`);
            this.io
              .to(table.id)
              .emit(
                SocketEmit.DealerMadeAction,
                JSON.stringify(table),
                ActionType.Hit
              );
          }

          table.countWinnings();

          console.info(SocketEmit.WinnersCounted);
          this.io
            .to(table.id)
            .emit(SocketEmit.WinnersCounted, JSON.stringify(table));
          table.currentPlayerIndex = null;
        }
      } catch (error) {
        this.handleError(error, socket);

        const table = this.tables[tableId];
        if (table) {
          this.io
            .to(table.id)
            .emit(SocketEmit.ActionMade, JSON.stringify(table));
        }
      }
    });

    socket.on(SocketOn.EndGame, async (tableId, playerId, action) => {
      try {
        const table = this.tables[tableId];
        if (!table) {
          throw new Error(BaseMessages.NoTable);
        }

        const player = this.findPlayerById(playerId, table);
        if (!player) {
          throw new Error(BaseMessages.PlayerLost);
        }

        switch (action) {
          case EndGameActions.NewBet:
            table.removeFakePlayers(player);
            break;
          case EndGameActions.CashOut:
            const balance = player._balance;
            const name = player._name;

            this.io
              .to(playerId)
              .emit(SocketEmit.CashOut, { username: name, balance: balance });

            // Disconnect the player
            const playerSocket = this.io.sockets.sockets.get(playerId);
            if (playerSocket) {
              playerSocket.disconnect(true);
            }
            break;
        }
        table.roundIsStarted = false;
        this.io.to(table.id).emit(SocketEmit.GameEnded, JSON.stringify(table));
      } catch (error) {
        this.handleError(error, socket);
      }
    });

    socket.on(SocketOn.Disconnect, () => {
      console.info(`Disconnect received from: ${socket.id}`);
      try {
        let player;
        let table;
        for (const key_id in this.tables) {
          if (this.tables[key_id].players) {
            table = this.tables[key_id];
            if (table) {
              player = this.findPlayerById(socket.id, table);
              if (player) {
                break;
              }
            }
          }
        }

        if (!player || !table) {
          throw new Error("Player or table not found on disconnection");
        }

        const balance = player._balance;
        const name = player._name;

        console.info(`Updating balance for user ${name} to ${balance}`);

        User.findOneAndUpdate({ username: name }, { balance }, { new: true })
          .then((user) => {
            console.log(`Balance updated for user ${name} to ${user.balance}`);
          })
          .catch((error) => {
            console.error(error);
          });

        table.playerRemove(player);

        if (!table.allPlayers.length) {
          console.info(`Table  ${table.id} deleted`);
          delete this.tables[table.id];
        } else {
          if (!table.playingPlayers.length) {
            table.dealer = null;
            table.roundIsStarted = false;
          }

          console.info(`${SocketEmit.DisconnectPlayer}  ${socket.id}`);
          socket.broadcast
            .to(table.id)
            .emit(SocketEmit.Message, `${player.name} left`);
          socket.broadcast
            .to(table.id)
            .emit(SocketEmit.DisconnectPlayer, JSON.stringify(table));
        }
      } catch (error) {
        this.handleError(error, socket);
      }
    });
  };

  handleError = (error, socket) => {
    if (error instanceof Error) {
      console.info(error);
      socket.emit(SocketEmit.Error, error.message);
    } else {
      console.info("An unknown error occurred");
      socket.emit(SocketEmit.Error, BaseMessages.Error);
    }
  };

  findPlayerById = (playerId, table) => {
    return table.allPlayers.find((player) => player.id === playerId);
  };
}
