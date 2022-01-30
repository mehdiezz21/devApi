const sql = require("./db.js");

// constructor
class Player {
  constructor(player) {
    this.name = player.name;
    this.gameWin = player.gameWin;
    this.gameLost = player.gameLost;
    this.createdAt = player.createdAt;
  }
  static create(newPlayer, result) {
    sql.query("INSERT INTO players SET ?", newPlayer, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created player: ", { id: res.insertId, ...newPlayer });
      result(null, { id: res.insertId, ...newPlayer });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM players WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found player: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Player with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(name, result) {
    let query = "SELECT * FROM players";

    if (name) {
      query += ` WHERE name LIKE '%${name}%'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("players: ", res);
      result(null, res);
    });
  }
  static updateById(id, player, result) {
    sql.query(
      "UPDATE players SET gameWin = ?, gameLost = ? WHERE id = ?",
      [player.gameWin, player.gameLost, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows === 0) {
          // not found Player with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated player: ", { id: id, ...player });
        result(null, { id: id, ...player });
      }
    );
  }
  static remove(id, result) {
    sql.query("DELETE FROM players WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Player with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted player with id: ", id);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM players", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} players`);
      result(null, res);
    });
  }
}

module.exports = Player;