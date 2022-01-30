const sql = require("./db.js");

// constructor
class GamePlayer {
  constructor(gamePlayer) {
    this.playerId = gamePlayer.playerId;
    this.gameId = gamePlayer.gameId;
    this.remainingShots = gamePlayer.remainingShots;
    this.score = gamePlayer.score;
    this.rank = gamePlayer.rank;
    this.order = gamePlayer.order;
    this.inGame = gamePlayer.inGame;
    this.createdAt = gamePlayer.createdAt;
  }
  static create(newGamePlayer, result) {
    sql.query("INSERT INTO gamePlayers SET ?", newGamePlayer, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created gamePlayer: ", { id: res.insertId, ...newGamePlayer });
      result(null, { id: res.insertId, ...newGamePlayer });
    });
  }
  static findById(gameId, playerId, result) {
    sql.query("SELECT * FROM gamePlayers WHERE gameId = ? and playerId = ?",
    [gameId, playerId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found gamePlayer: ", res[0]);
        result(null, new GamePlayer(res[0]));
        return new GamePlayer(res[0]);
      }

      // not found GamePlayer with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(gameId, result) {
    sql.query("SELECT * FROM gamePlayers WHERE gameId = ?",
    [gameId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found gamePlayer: ", res);
        result(null, res);
        return;
      }

      // not found GamePlayer with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAllInGame(gameId, result) {
    sql.query("SELECT * FROM gamePlayers WHERE inGame=true and gameId = ?",
    [gameId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("gamePlayers: ", res);
      result(null, res);
    });
  }

  static updateById(gameId, playerId, gamePlayer, result) {
    sql.query(
      "UPDATE gamePlayers SET remainingShots = ?, score = ?, rank = ?, inGame = ? WHERE gameId = ? and playerId = ?",
      [gamePlayer.remainingShots, gamePlayer.score, gamePlayer.rank, gamePlayer.inGame, gameId, playerId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows === 0) {
          // not found GamePlayer with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated gamePlayer: ", { playerId: playerId, ...gamePlayer });
        result(null, { playerId: playerId, ...gamePlayer });
      }
    );
  }
  static remove(gameId, result) {
    sql.query("DELETE FROM gamePlayers WHERE gameId = ?",
    [gameId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found GamePlayer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted gamePlayer with id: ", gameId);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM gamePlayers", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} gamePlayers`);
      result(null, res);
    });
  }
}

module.exports = GamePlayer;