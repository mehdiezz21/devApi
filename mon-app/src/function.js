exports.world = (score, oldScore) => {
  if (score === oldScore){
    return score + 1
  } else return oldScore;
};

exports.treeOne = (score, multiplicator, oldScore) => {
  const newScore = score * multiplicator;
  if (oldScore - newScore > 0) {
    return oldScore - newScore;
  } else if (oldScore - newScore === 0 || multiplicator === 2) {
    return 0;
  } else return oldScore;
};

exports.mixArray = inputArray => {
  return inputArray.sort(()=> Math.random() - 0.5);
};
