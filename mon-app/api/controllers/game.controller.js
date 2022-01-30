const Game = require("../models/game.model.js");
const GamePlayer = require("../models/gamePlayer.model.js");
const GameShot = require("../models/gameShot.model.js");
const Player = require("../models/player.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const game = new Game({
    mode: req.body.mode,
    name: req.body.name,
    status: req.body.status || true,
    createdAt: Date.now(),
  });

  Game.create(game, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Game."
      });
    else res.send(data);
  });

};

exports.findAll = (req, res) => {
  const name = req.query.name;

  Game.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    else res.send(data);
  });
};

// Find a single Game by Id
exports.findOne = (req, res) => {
  Game.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Game with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Game with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// find all published Games
exports.findAllStatus = (req, res) => {
  Game.getAllStatus((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    else res.send(data);
  });
};

// Update a Game identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Game.updateById(
    req.params.id,
    new Game(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Game with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Game with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// End a Game identified by the id in the request
exports.endById = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Get all GamePlayers inGame

  const PromiseAllGamePlayers = new Promise((resolve, reject) => {
    GamePlayer.getAllInGame(Number(req.params.id), (err, data) => {
      resolve(data);
    });
  });

  let allGamePlayerGame = [];

  await PromiseAllGamePlayers.then((value) => {
    for (let i = 0; i < value.length; i++) {
      allGamePlayerGame.push(new GamePlayer(value[i]));
    }
  });

  let playerSelect = undefined;

  for (let a = 0; a < allGamePlayerGame.length; a++) {
    console.log("tets", a, allGamePlayerGame[a])
    let PromisePlayer = new Promise((resolve, reject) => {
      Player.findById(allGamePlayerGame[a].playerId, (err, data) => {
        resolve(data);
      });
    });
    
    // eslint-disable-next-line no-loop-func
    await PromisePlayer.then((value) => {
      playerSelect = value;
    });

    Player.updateById(
      allGamePlayerGame[a].playerId,
      new Player({
        gameLost: (playerSelect.gameLost + 1) || 0,
        gameWin: playerSelect.gameWin || 0
      }),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found gamePlayer.`,
            });
          } else {
            res.status(500).send({
              message: "Error updating gamePlayer with id " + req.params.id,
            });
          }
        }
      } 
    );
  }

  GameShot.remove(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Player with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Player with id " + req.params.id
        });
      }
    }
  });

  GamePlayer.remove(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Player with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Player with id " + req.params.id
        });
      }
    }
  });

  Game.endById(
    req.params.id,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Game with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Game with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a Game with the specified id in the request
exports.delete = (req, res) => {
  Game.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Game with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Game with id " + req.params.id
        });
      }
    } else res.send({ message: `Game was deleted successfully!` });
  });
};

// Delete all Games from the database.
exports.deleteAll = (req, res) => {
  Game.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all games."
      });
    else res.send({ message: `All Games were deleted successfully!` });
  });
};