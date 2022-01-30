const GamePlayer = require("../models/gamePlayer.model.js");
const Game = require("../models/game.model.js");
const { mixArray } = require("../../src/function.js");

// Create and Save a new gamePlayer
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const PromiseGame = new Promise((resolve, reject) => {
    Game.findById(req.body.gameId, (err, data) => {
      resolve(data);
    });
  });

  let GameSelect = undefined;

  await PromiseGame.then((value) => {
    GameSelect = value.mode;
  });

  const arrPlayers = mixArray(req.body.playersId);


  for (let i = 0; i < arrPlayers.length; i++) {
    // Create a gamePlayer
    const gamePlayer = new GamePlayer({
      playerId: arrPlayers[i],
      gameId: req.body.gameId,
      remainingShots: 3,
      score: GameSelect === 1 ? 1 : 301,
      rank: 0,
      order: i + 1,
      inGame: req.body.inGame || true,
      createdAt: Date.now(),
    });

    // Save gamePlayer in the database
    GamePlayer.create(gamePlayer, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the gamePlayer.",
        });
    });
  }

  res.send("Nombre de joueur créé pour cette partie:", req.body.playersId.length)
};

// Retrieve all gamePlayers from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  GamePlayer.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving gamePlayers.",
      });
    else res.send(data);
  });
};

// Find a single gamePlayer by Id and gameId
exports.findOne = (req, res) => {
  GamePlayer.findById(req.body.gameId, req.body.playerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found gamePlayer with id ${
            (req.body.gameId, req.body.playerId)
          }.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving gamePlayer with id " + req.body.gameId,
        });
      }
    } else res.send(data);
  });
};

// find all ingame gamePlayers
exports.findAllInGame = (req, res) => {
  GamePlayer.getAllInGame((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving gamePlayers.",
      });
    else res.send(data);
  });
};

// Update a gamePlayer identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  GamePlayer.updateById(
    req.params.id,
    new GamePlayer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found gamePlayer with id ${req.params.id}.`,
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

// Delete a gamePlayer with the specified id in the request
exports.delete = (req, res) => {
  GamePlayer.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found gamePlayer with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete gamePlayer with id " + req.params.id,
        });
      }
    } else res.send({ message: `gamePlayer was deleted successfully!` });
  });
};

// Delete all gamePlayers from the database.
exports.deleteAll = (req, res) => {
  GamePlayer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all gamePlayers.",
      });
    else res.send({ message: `All gamePlayers were deleted successfully!` });
  });
};
