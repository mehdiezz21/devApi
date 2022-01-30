const inquirer = require('inquirer');

module.exports = {
  // Game
  askgame: () => {
    const valeur = [
      {
        name: 'valeur',
        type: 'input',
        message: `Entrez votre numéro de jeu: (1: - Le tour du Monde, ` + 
        `2: - Le 301, 3: - Le Cricket):`,
        validate: function( value ) {
          if (value >= 1 && value <= 3) {
            return true;
          } else {
            return 'SVP, entrez un numéro de jeu correct';
          }
        }
      },
    ];
    return inquirer.prompt(valeur);
  },
  // Player
  asknumber: () => {
    const questions = [
      {
        name: 'valeur',
        type: 'input',
        message: 'Entrer le nombre de joueur:',
        validate: function( value ) {
          if (value >= 1) {
            return true;
          } else {
            return 'SVP, entrez un nombre de joeur valide';
          }
        }
      },
    ];
    return inquirer.prompt(questions);
  },
  askvaleur: (i) => {
    const valeur = [
      {
        name: 'valeur',
        type: 'input',
        message: `Joueur${i}, entrer votre score:`,
        validate: function( value ) {
          if (value >= 1 && value <=20) {
            return true;
          } else {
            return 'SVP, entrez un score correct';
          }
        }
      },
    ];
    return inquirer.prompt(valeur);
  },
  askmult: (i) => {
    const valeur = [
      {
        name: 'valeur',
        type: 'input',
        message: `Joueur${i}, entrer votre multiplicateur:`,
        validate: function( value ) {
          if (value >= 1 && value <= 3) {
            return true;
          } else {
            return 'SVP, entrer un multiplicateur valide';
          }
        }
      },
    ];
    return inquirer.prompt(valeur);
  },

};