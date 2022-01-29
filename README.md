# TP_API

# Mehdi Ezzahi

Le projet est bati en Node.js avec l'Api Rest ainsi que Express et MySQL.


## Jouer en terminal local
Pour jouer en terminal local il suffit de lancer index.js avec node:

```node ./monapp/src/index.js```

Le jeu est intuitif il suffit de répondre aux questions pour jouer.


## Jouer avec l'api
On retrouve le fichier de la bdd dans `/monapp/lib/bdd.sql`

Puis on peut modifié nos informations de configuration de connexion à la bdd dans
`/monapp/api/config/db.config.js`

Par la suite il faut suivre les étapes de jeu dans l'ordre

### Créer un Joueur

On va utilisé la route:

```POST http://localhost:8080/api/player```

En body il suffit de rentrer un 'name':

```{ "name": "Romain" }```

Par la suite l'Api va nous retourner un Id le garder en mémoire car se sera notre Id de joueur

### Créer une Partie

On va utilisé la route:

```POST http://localhost:8080/api/game```

En body il faut rentrer un 'name' et un 'mode'(1: le tour du Monde, 2: 301)

```
{
    "name": "newpartie"
    "mode": 1
    }
```

Par la suite l'Api va nous retourner un Id le garder en mémoire car se sera notre Id de partie

### Choisir les joueurs d'une partie

On va utilisé la route:

```POST http://localhost:8080/api/gamePlayer```

En body il faut rentrer l'Id de la partie souhaité dans 'gameId' et dans 'playersId' les un tableau des Id des joueurs pour cette partie (garder un tableau même pour une valeur):


```
{
    "playersId": [1, 2]
    "gameId": 1
    }
```

Les joueurs, avec l'iD 1 et 2, joue dans la partie avec l'iD 1. Un tour aléatoire leur est attribué.

### Jouer une partie

On va utilisé la route:

```POST http://localhost:8080/api/gameShot```

En body il faut rentrer l'Id de la partie souhaité dans 'gameId' et dans 'playersId' les un tableau des Id des joueurs pour cette partie (garder un tableau même pour une valeur):


```
{
    "playerId": 1,
    "gameId": 1,
    "sector": 19 //Optionnel, si il n'y a pas cette ligne sector = 0
    "multiplicator": 2 //Optionnel, si il n'y a pas cette ligne multiplicator = 0
}
```

L'Api retourne (send) le GamePlayer correspondant

```
{
    "remainingShots": 2, // nombre de tour restant
    "score": 20, // score du joueur
    "rank": 1, // son rang dans la partie
    "inGame": true // devient false si le joueur gagne
}
```

Par la suite si le joueur gagne le jeu, dans Player son gameWin augmente(+1).
Les autres joeurs peuvent continuer à joueur.

### Finir une partie

On va utilisé la route: (id correspond à l'Id de la partie à finir)

```PUT http://localhost:8080/api/game/endGame/:id```

Tous les jours encore en partie qui n'ont pas gagné auront dans Player leur gameLose augmenté(+1).
Tous les gamePlayers, et gameShots correspondant à cette partie seront supprimé.
(Les joueurs seront bien sûr toujours présent).


### Manipulé avec l'Api

De très nombreuses autres routes sont présentes dans cette Api, qui permettent de faire ce que l'on veut avec la BDD. (Pour corriger des erreur de saisie, ou juste s'informé).

### Retour Perso

Projet très intérressant, car je n'avais encore jamais fait d'Api, et ça m'a aidé pour mon travail en alternance (j'avais un ticket à faire sur l'Api). 
Je sais pas si c'était parce que j'étais tout seul, mais ça m'a pris vrm pas mal de temps aha ^^. (J'aurai bien aimé avec cette journée en plus pour le dernier style de jeu).

Amuses toi bien Romain ;)