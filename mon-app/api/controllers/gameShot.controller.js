const GameShot = require("../models/gameShot.model.js");
const GamePlayer = require("../models/gamePlayer.model.js");
const Game = require("../models/game.model.js");
const Player = require("../models/player.model.js");
const { world, treeOne } = require("../../src/function.js");

// Create and Save a new GameShot
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a GameShot
  const gameShot = new GameShot({
    gameId: req.body.gameId,
    playerId: req.body.playerId,
    multiplicator: (0 <= req.body.multiplicator <= 3 ? req.body.multiplicator : 1) || 1,
    sector: (0 <= req.body.sector <= 20 ? req.body.sector : 0) || 0,
    status: req.body.status || true,
    createdAt: Date.now(),
  });

  // Save GameShot in the database
  GameShot.create(gameShot, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the GameShot.",
      });
  });

  // Get GamePlayer for GameShot

  const PromiseGamePlayer = new Promise((resolve, reject) => {
    GamePlayer.findById(req.body.gameId, req.body.playerId, (err, data) => {
      resolve(data);
    });
  });

  let GamePlayerSelect = undefined;

  await PromiseGamePlayer.then((value) => {
    GamePlayerSelect = value;
  });

    // Get AllGamePlayer for GameShot

    const PromiseAllGamePlayer = new Promise((resolve, reject) => {
      GamePlayer.getAll(req.body.gameId, (err, data) => {
        resolve(data);
      });
    });
  
    let AllGamePlayer = [];
  
    await PromiseAllGamePlayer.then((value) => {
      for (let i = 0; i < value.length; i++) {
        AllGamePlayer.push(new GamePlayer(value[i]));
      }
    });

  // Get Game with Id

  const PromiseGame = new Promise((resolve, reject) => {
    Game.findById(req.body.gameId, (err, data) => {
      resolve(data);
    });
  });

  let GameSelect = undefined;

  await PromiseGame.then((value) => {
    GameSelect = value.mode;
  });

  // Get Player with Id

  const PromisePlayer = new Promise((resolve, reject) => {
    Player.findById(req.body.playerId, (err, data) => {
      resolve(data);
    });
  });

  let PlayerSelect = undefined;

  await PromisePlayer.then((value) => {
    PlayerSelect = value;
  });

  const score = GameSelect === 1
  ? world(gameShot.sector, GamePlayerSelect.score)
  : treeOne(
      gameShot.sector,
      gameShot.multiplicator,
      GamePlayerSelect.score
    );

  const rank = (AllGamePlayer, GameSelect) => {
    if (GameSelect === 1){
      AllGamePlayer.sort(function (a, b) {
        return b.score - a.score;
      })
    } else {
      AllGamePlayer.sort(function (a, b) {
        return a.score - b.score;
      })
    }
  };

  rank(AllGamePlayer, GameSelect);
    
  const winGame = (score, GameSelect, PlayerSelect) => {
    if (GameSelect === 1){
      if (score === 20) {
        Player.updateById(
          PlayerSelect.id,
          new Player({ 
            gameWin: (PlayerSelect.gameWin + 1) || 0,
            gameLost: PlayerSelect.gameLost || 0
          }),
          (err, data) => {
            if (err) {
              if (err.kind === "not_found") {
                res.status(404).send({
                  message: `Not found gamePlayer with id ${PlayerSelect.id}.`,
                });
              } else {
                res.status(500).send({
                  message: "Error updating gamePlayer with id " + PlayerSelect.id,
                });
              }
            }
          }
        );
        return false
      } else return true
    } else {
      if (score === 0) {
        Player.updateById(
          PlayerSelect.id,
          new Player({ 
            gameWin: (PlayerSelect.gameWin + 1) || 0,
            gameLost: PlayerSelect.gameLost || 0
          }),
          (err, data) => {
            if (err) {
              if (err.kind === "not_found") {
                res.status(404).send({
                  message: `Not found gamePlayer with id ${PlayerSelect.id}.`,
                });
              } else {
                res.status(500).send({
                  message: "Error updating gamePlayer with id " + PlayerSelect.id,
                });
              }
            }
          }
        );
        return false
      } else return true
    }
  };
  

  GamePlayer.updateById(
    req.body.gameId,
    req.body.playerId,
    new GamePlayer({
      remainingShots:
        GamePlayerSelect.remainingShots <= 1
          ? 3
          : GamePlayerSelect.remainingShots - 1,
      score: score,
      rank: AllGamePlayer.map(function(e) { return e.playerId; }).indexOf(req.body.playerId) + 1,
      inGame: winGame(score, GameSelect, PlayerSelect),
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
      } else res.send(data);
    } 
  );

};

// Retrieve all GameShots from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  GameShot.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving gameShots.",
      });
    else res.send(data);
  });
};

// Find a single GameShot by Id
exports.findOne = (req, res) => {
  GameShot.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found GameShot with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving GameShot with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};


// Update a GameShot identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  GameShot.updateById(req.params.id, new GameShot(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found GameShot with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating GameShot with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a GameShot with the specified id in the request
exports.delete = (req, res) => {
  GameShot.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found GameShot with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete GameShot with id " + req.params.id,
        });
      }
    } else res.send({ message: `GameShot was deleted successfully!` });
  });
};

// Delete all GameShots from the database.
exports.deleteAll = (req, res) => {
  GameShot.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all gameShots.",
      });
    else res.send({ message: `All GameShots were deleted successfully!` });
  });
};
