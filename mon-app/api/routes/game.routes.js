module.exports = app => {
  const games = require("../controllers/game.controller.js");
  const players = require("../controllers/player.controller.js");
  const gameShots = require("../controllers/gameShot.controller.js");
  const gamePlayers = require("../controllers/gamePlayer.controller.js");
  
    var router = require("express").Router();
  
    router.post("/game", games.create);
  
    router.get("/games", games.findAll);

    router.get("/games/status", games.findAllStatus);

    router.get("/game/:id", games.findOne);

    router.put("/game/:id", games.update);

    router.put("/game/endGame/:id", games.endById);

    router.delete("/game/:id", games.delete);

    router.delete("/games", games.deleteAll);
  
    //player
    
    router.post("/player", players.create);
    
    router.get("/players", players.findAll);
    
    router.get("/player/:id", players.findOne);
    
    router.put("/player/:id", players.update);
    
    router.delete("/player/:id", players.delete);
    
    router.delete("/players/", players.deleteAll);

    //gamePlayer
    
    router.post("/gamePlayer", gamePlayers.create);
  
    router.get("/gamePlayers", gamePlayers.findAll);

    router.get("/gamePlayers/inGame", gamePlayers.findAllInGame);

    router.get("/gamePlayer/:id", gamePlayers.findOne);

    router.put("/gamePlayer/:id", gamePlayers.update);

    router.delete("/gamePlayer/:id", gamePlayers.delete);

    router.delete("/gamePlayers", gamePlayers.deleteAll);

    // gameShots
    
    router.post("/gameShot", gameShots.create);
  
    router.get("/gameShot", gameShots.findAll);

    router.get("/gameShot/:id", gameShots.findOne);

    router.put("/gameShot/:id", gameShots.update);

    router.delete("/gameShot/:id", gameShots.delete);

    router.delete("/gameShots", gameShots.deleteAll);

    app.use('/api', router);
  };