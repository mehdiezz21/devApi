const sql = require("./db.js");

// constructor
class Game {
  constructor(game) {
    this.mode = game.mode;
    this.name = game.name;
    this.status = game.status;
    this.createdAt = game.createdAt;
  }
  static create(newGame, result) {
    sql.query("INSERT INTO games SET ?", newGame, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created game: ", { id: res.insertId, ...newGame });
      result(null, { id: res.insertId, ...newGame });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM games WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found game: ", new Game(res[0]));
        result(null, new Game(res[0]));
        return;
      }

      // not found Game with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(name, result) {
    let query = "SELECT * FROM games";

    if (name) {
      query += ` WHERE name LIKE '%${name}%'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("games: ", res);
      result(null, res);
    });
  }
  static getAllStatus(result) {
    sql.query("SELECT * FROM games WHERE status=true", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("games: ", res);
      result(null, res);
    });
  }
  static updateById(id, game, result) {
    sql.query(
      "UPDATE games SET name = ?, mode = ?, status = ? WHERE id = ?",
      [game.name, game.mode, game.status, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows === 0) {
          // not found Game with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated game: ", { id: id, ...game });
        result(null, { id: id, ...game });
      }
    );
  }
  static endById(id, result) {
    sql.query(
      "UPDATE games SET status=false WHERE id = ?",
      [id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows === 0) {
          // not found Game with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("update game with id: ", id);
        result(null, res);
      });
  }
  static remove(id, result) {
    sql.query("DELETE FROM games WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Game with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted game with id: ", id);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM games", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} games`);
      result(null, res);
    });
  }
}

module.exports = Game;