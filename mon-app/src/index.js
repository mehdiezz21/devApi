const chalk = require ('chalk');
const clear = require ('clear');
const figlet = require ('figlet');
const inquirer = require ('../lib/inquirer');
const { treeOne, world } = require('./function');

clear();

class Joueur {
  constructor(id) {
    this.id = id;
    this.score = 301;
    this.world = 1;
    this.cricket = []
    this.cricket_scr = 0
  }
}

console.log(
  chalk.yellow(
    figlet.textSync('Flechette', { horizontalLayout: 'full' })
  )
);


const jeu1 =async (joueur) => {
  console.log('tour du monde');
  let i = Math.floor(Math.random() * joueur.length - 1) + 1;
  let even = e => e.score > 0;
  while (joueur.every(even)) {
    i === (joueur.length - 1) ? i = 1 : i ++;
    let score = await inquirer.askvaleur(i);
    let mult = await inquirer.askmult(i);
    joueur[i].score = treeOne(score.valeur, mult.valeur, joueur[i].score)
    console.log("point joueur " + joueur[i].id + ": " + joueur[i].score);
  }
  console.log("le joueur" + joueur[i].id + " à gagné!");
};

const jeu2 =async (joueur) => {
  console.log('301');
  let i = Math.floor(Math.random() * joueur.length - 1) + 1;
  let even = e => e.world < 20;
  while (joueur.every(even)) {
    i === (joueur.length - 1) ? i = 1 : i ++;
    for (let n = 1; n < 4; n++) {
      let score = await inquirer.askvaleur(i);
      joueur[i].world = world(score.valeur, joueur[i].world);
    };
    console.log(joueur)
  }
  console.log("le joueur" + joueur[i].id + " à gagné!");
};

const jeu3 =async (joueur) => {
  let i = Math.floor(Math.random() * joueur.length - 1) + 1;
  let tableau = ["15", "16", "17", "18", "19", "20", "50"]
  let cricket = [];
  let even = (element) => element.world < 20;
  while (joueur.every(even)) {
    i === (joueur.length - 1) ? i = 1 : i ++;
    for (let n = 1; n < 4; n++) {
      let score = await inquirer.askvaleur(i);
      let mult = await inquirer.askmult(i);
      let score_final = score.valeur * mult.valeur;
      if (tableau.includes(score.valeur)) {
        for (let m = 1; m <= mult.valeur; m++) {
          joueur[i].cricket.push(score.valeur);
        };
        if (joueur[i].cricket.filter(x => x===score.valeur).length > 3) {
          cricket.push(score.valeur);
          if (cricket.filter(x => x===score.valeur).length < 2) {
            joueur[i].cricket_scr += score_final;
            console.log(joueur[i].cricket_scr)
          }
        }
      }
    };
    console.log(joueur[i].cricket)
    console.log(joueur[i].cricket_scr)
  }
  console.log("le joueur" + joueur[i].id + " à gagné!");
};

const run = async () => {
  const nombreJ = await inquirer.asknumber();
  const joueur = [];
  for (let i = 1; i <= nombreJ.valeur; i++) {
    joueur[i] = new Joueur(i);
  };

  const game = await inquirer.askgame();
  if (Number(game.valeur) === 1){
    jeu1(joueur);
  } else {
    jeu2(joueur);
  }
  
};

run();