function isValidWalk(walk) {
  let horizontalWalk = 0,
    verticalWalk = 0;
  for (let direction of walk) {
    if (direction == "n") {
      verticalWalk++;
    } else if (direction == "s") {
      verticalWalk--;
    } else if (direction == "w") {
      horizontalWalk++;
    } else if (direction == "e") {
      horizontalWalk--;
    }
  }
  return walk.length == 10 && horizontalWalk == 0 && verticalWalk == 0;
}
