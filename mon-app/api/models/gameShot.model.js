const sql = require("./db.js");

// constructor
class GameShot {
  constructor(gameShot) {
    this.gameId = gameShot.gameId;
    this.playerId = gameShot.playerId;
    this.multiplicator = gameShot.multiplicator;
    this.sector = gameShot.sector;
    this.createdAt = gameShot.createdAt;
  }
  static create(newGameShot, result) {
    sql.query("INSERT INTO gameShots SET ?", newGameShot, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created gameShot: ", { id: res.insertId, ...newGameShot });
      result(null, { id: res.insertId, ...newGameShot });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM gameShots WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found gameShot: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found GameShot with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(name, result) {
    let query = "SELECT * FROM gameShots";

    if (name) {
      query += ` WHERE name LIKE '%${name}%'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("gameShots: ", res);
      result(null, res);
    });
  }

  static updateById(id, gameShot, result) {
    sql.query(
      "UPDATE gameShots SET multiplicator = ?, sector = ? WHERE id = ?",
      [gameShot.multiplicator, gameShot.sector, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows === 0) {
          // not found GameShot with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated gameShot: ", { id: id, ...gameShot });
        result(null, { id: id, ...gameShot });
      }
    );
  }
  static remove(gameId, result) {
    sql.query("DELETE FROM gameShots WHERE gameId = ?",
    [gameId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        // not found GameShot with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted gameShot with id: ", gameId);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM gameShots", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} gameShots`);
      result(null, res);
    });
  }

  
}

module.exports = GameShot;