let col = 0;
let row = 0;
var figure = [1, 2, 3, 4];
let currentfigure = 0;
let direction = 0;
let lastBestHit = [-1, -1];
let checkdirection = 0;
let place = -1;
let vicotdef = true;
const playerButtons = document.querySelectorAll(".player.button");
const aiButtons = document.querySelectorAll(".ai.button");
const aiField = document.querySelectorAll(".ai.field");

const controls = document.querySelectorAll(".controls");

const rotateLeft = document.querySelectorAll(".rotate.left");
const rotateRight = document.querySelectorAll(".rotate.right");
const spinner = document.querySelectorAll(".spinner");

const victory = document.querySelectorAll(".overlay.victory");
const defeat = document.querySelectorAll(".overlay.defeat");

rotateLeft.forEach((button) => {
  button.addEventListener("click", () => {
    direction--;
    if (direction <= -1) {
      direction = 3;
    }
  });
});

rotateRight.forEach((button) => {
  button.addEventListener("click", () => {
    direction++;
    if (direction >= 4) {
      direction = 0;
    }
  });
});

async function PlaceShip(buttons, index) {
  let flag = false;
  col = index % 10;
  row = Math.floor(index / 10);
  for (let i = 0; i < 4 - currentfigure; i++) {
    if (direction == 0 && row + 4 - currentfigure < 11) {
      if (row + i >= 0 && row + i < 10) {
        buttons[(row + i) * 10 + col].classList.add("ship");
        flag = true;
      }
    } else if (direction == 1 && col + 4 - currentfigure < 11) {
      if (col + i >= 0 && col + i < 10) {
        buttons[row * 10 + (col + i)].classList.add("ship");
        flag = true;
      }
    } else if (direction == 2 && row - 4 + currentfigure > -2) {
      if (row - i >= 0 && row - i < 10) {
        buttons[(row - i) * 10 + col].classList.add("ship");
        flag = true;
      }
    } else if (direction == 3 && col - 4 + currentfigure > -2) {
      if (col - i >= 0 && col - i < 10) {
        buttons[row * 10 + (col - i)].classList.add("ship");
        flag = true;
      }
    }
  }
  if (flag) {
    figure[currentfigure]--;
  }
  if (figure[currentfigure] == 0) {
    currentfigure++;
    if (currentfigure == 4) {
      controls[0].classList.add("hidden");
      aiField[0].classList.remove("hidden");
      figure = [1, 2, 3, 4];
      currentfigure = 0;

      if (place == -1) {
        spinner[0].classList.remove("hidden");
        do {
          await new Promise((resolve) => setTimeout(resolve, 100));
          place = Math.floor(Math.random() * 101);
          direction = Math.floor(Math.random() * 4);
          if (checkPlaceShip(aiButtons, place)) {
            PlaceShip(aiButtons, place);
          }
        } while (currentfigure != 0);
        spinner[0].classList.add("hidden");
      }
    }
  }
}

function PlaceGhostShip(buttons, index) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      buttons[i * 10 + j].classList.remove("ghostShip");
    }
  }
  col = index % 10;
  row = Math.floor(index / 10);
  for (let i = 0; i < 4 - currentfigure; i++) {
    if (direction == 0 && row + 4 - currentfigure < 11) {
      buttons[(row + i) * 10 + col].classList.add("ghostShip");
    } else if (direction == 1 && col + 4 - currentfigure < 11) {
      buttons[row * 10 + (col + i)].classList.add("ghostShip");
    } else if (direction == 2 && row - 4 + currentfigure > -2) {
      buttons[(row - i) * 10 + col].classList.add("ghostShip");
    } else if (direction == 3 && col - 4 + currentfigure > -2) {
      buttons[row * 10 + (col - i)].classList.add("ghostShip");
    }
  }
}

function checkPlaceShip(buttons, index) {
  col = index % 10;
  row = Math.floor(index / 10);
  let canPlaceShip = true;
  if (direction == 0) {
    for (let i = row - 1; i < row + 4 - currentfigure + 1; i++) {
      for (let j = col - 1; j < col + 2; j++) {
        if (i > -1 && j > -1 && i < 10 && j < 10) {
          if (buttons[i * 10 + j].classList.contains("ship")) {
            canPlaceShip = false;
            break;
          }
        }
      }
    }
  } else if (direction == 1) {
    for (let i = row - 1; i < row + 2; i++) {
      for (let j = col - 1; j < col + 4 - currentfigure + 1; j++) {
        if (i > -1 && j > -1 && i < 10 && j < 10) {
          if (buttons[i * 10 + j].classList.contains("ship")) {
            canPlaceShip = false;
            break;
          }
        }
      }
    }
  } else if (direction == 2) {
    for (let i = row - 4 + currentfigure; i < row + 2; i++) {
      for (let j = col - 1; j < col + 2; j++) {
        if (i > -1 && j > -1 && i < 10 && j < 10) {
          if (buttons[i * 10 + j].classList.contains("ship")) {
            canPlaceShip = false;
            break;
          }
        }
      }
    }
  } else if (direction == 3) {
    for (let i = row - 1; i < row + 2; i++) {
      for (let j = col - 4 + currentfigure; j < col + 2; j++) {
        if (i > -1 && j > -1 && i < 10 && j < 10) {
          if (buttons[i * 10 + j].classList.contains("ship")) {
            canPlaceShip = false;
            break;
          }
        }
      }
    }
  }
  return canPlaceShip;
}

playerButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (checkPlaceShip(playerButtons, index)) {
      PlaceShip(playerButtons, index);
    }
  });
});

playerButtons.forEach((button, index) => {
  button.addEventListener("mouseover", () => {
    if (place == -1) PlaceGhostShip(playerButtons, index);
  });
});

function attackShip(buttons, index) {
  if (vicotdef) {
    col = index % 10;
    row = Math.floor(index / 10);
    let flag = 0;

    if (buttons[row * 10 + col].classList.contains("ship")) {
      buttons[row * 10 + col].classList.add("hit");
      buttons[row * 10 + col].classList.remove("ship");
      flag = 2;
      if (buttons == playerButtons) {
        lastBestHit = [row, col];
      }
      for (let i = row; i < row + 4; i++) {
        if (i > -1 && i < 10 && i != row) {
          if (
            !buttons[i * 10 + col].classList.contains("ship") &&
            !buttons[i * 10 + col].classList.contains("hit")
          ) {
            break;
          }
          if (buttons[i * 10 + col].classList.contains("ship")) {
            flag = 1;
          }
        }
      }
      for (let i = row; i > row - 4; i--) {
        if (i > -1 && i < 10 && i != row) {
          if (
            !buttons[i * 10 + col].classList.contains("ship") &&
            !buttons[i * 10 + col].classList.contains("hit")
          ) {
            break;
          }
          if (buttons[i * 10 + col].classList.contains("ship")) {
            flag = 1;
          }
        }
      }
      for (let i = col; i < col + 4; i++) {
        if (i > -1 && i < 10 && i != col) {
          if (
            !buttons[row * 10 + i].classList.contains("ship") &&
            !buttons[row * 10 + i].classList.contains("hit")
          ) {
            break;
          }
          if (buttons[row * 10 + i].classList.contains("ship")) {
            flag = 1;
          }
        }
      }
      for (let i = col; i > col - 4; i--) {
        if (i > -1 && i < 10 && i != col) {
          if (
            !buttons[row * 10 + i].classList.contains("ship") &&
            !buttons[row * 10 + i].classList.contains("hit")
          ) {
            break;
          }
          if (buttons[row * 10 + i].classList.contains("ship")) {
            flag = 1;
          }
        }
      }
    }
    if (flag == 2) {
      killShip(buttons, index);
      if (buttons == aiButtons) {
        if (countShips(buttons) < 1) {
          victory[0].classList.remove("hidden");
          vicotdef = false;
        }
      }
      if (buttons == playerButtons) {
        lastBestHit = [-1, -1];
        checkdirection = 0;
        aiMove(playerButtons);
      }
    } else if (flag == 1) {
      if (buttons == playerButtons) {
        aiMove(playerButtons);
      }
    } else if (flag == 0) {
      buttons[index].classList.add("check");
      if (buttons == aiButtons) {
        aiMove(playerButtons);
      }
    }
  }
}

function killShip(buttons, index) {
  col = index % 10;
  row = Math.floor(index / 10);
  for (let i = row; i < row + 4; i++) {
    if (i > -1 && i < 10) {
      if (
        !buttons[i * 10 + col].classList.contains("ship") &&
        !buttons[i * 10 + col].classList.contains("hit")
      ) {
        break;
      }
      if (buttons[i * 10 + col].classList.contains("hit")) {
        for (let k = i - 1; k < i + 2; k++) {
          for (let j = col - 1; j < col + 2; j++) {
            if (
              (k != row || j != col) &&
              k > -1 &&
              j > -1 &&
              k < 10 &&
              j < 10 &&
              !buttons[k * 10 + j].classList.contains("hit")
            )
              buttons[k * 10 + j].classList.add("check");
          }
        }
      }
    }
  }
  for (let i = row; i > row - 4; i--) {
    if (i > -1 && i < 10) {
      if (
        !buttons[i * 10 + col].classList.contains("ship") &&
        !buttons[i * 10 + col].classList.contains("hit")
      ) {
        break;
      }
      if (buttons[i * 10 + col].classList.contains("hit")) {
        for (let k = i - 1; k < i + 2; k++) {
          for (let j = col - 1; j < col + 2; j++) {
            if (
              (k != row || j != col) &&
              k > -1 &&
              j > -1 &&
              k < 10 &&
              j < 10 &&
              !buttons[k * 10 + j].classList.contains("hit")
            )
              buttons[k * 10 + j].classList.add("check");
          }
        }
      }
    }
  }
  for (let i = col; i < col + 4; i++) {
    if (i > -1 && i < 10) {
      if (
        !buttons[row * 10 + i].classList.contains("ship") &&
        !buttons[row * 10 + i].classList.contains("hit")
      ) {
        break;
      }
      if (buttons[row * 10 + i].classList.contains("hit")) {
        for (let k = row - 1; k < row + 2; k++) {
          for (let j = i - 1; j < i + 2; j++) {
            if (
              (k != row || j != col) &&
              k > -1 &&
              j > -1 &&
              k < 10 &&
              j < 10 &&
              !buttons[k * 10 + j].classList.contains("hit")
            )
              buttons[k * 10 + j].classList.add("check");
          }
        }
      }
    }
  }
  for (let i = col; i > col - 4; i--) {
    if (i > -1 && i < 10) {
      if (
        !buttons[row * 10 + i].classList.contains("ship") &&
        !buttons[row * 10 + i].classList.contains("hit")
      ) {
        break;
      }
      if (buttons[row * 10 + i].classList.contains("hit")) {
        for (let k = row - 1; k < row + 2; k++) {
          for (let j = i - 1; j < i + 2; j++) {
            if (
              (k != row || j != col) &&
              k > -1 &&
              j > -1 &&
              k < 10 &&
              j < 10 &&
              !buttons[k * 10 + j].classList.contains("hit")
            )
              buttons[k * 10 + j].classList.add("check");
          }
        }
      }
    }
  }
}

function countShips(buttons) {
  let countships = 0;
  for (let j = 0; j < 10; j++) {
    for (let k = 0; k < 10; k++) {
      if (
        buttons[j * 10 + k].classList.contains("ship") &&
        !buttons[j * 10 + k].classList.contains("check")
      ) {
        countships++;
      }
    }
  }
  return countships;
}

async function aiMove(buttons) {
  spinner[0].classList.toggle("hidden");

  await new Promise((resolve) => setTimeout(resolve, 1000));
  let i = 0;

  if (countShips(buttons) < 1) {
    defeat[0].classList.remove("hidden");
    vicotdef = flase;
  }
  if (lastBestHit[0] > -1 && lastBestHit[1] > -1) {
    let flag = false;
    while (!flag) {
      switch (checkdirection) {
        case 0:
          for (let i = lastBestHit[0] + 1; i < lastBestHit[0] + 4; i++) {
            if (i > -1 && i < 10) {
              if (
                buttons[i * 10 + lastBestHit[1]].classList.contains("check")
              ) {
                break;
              } else if (
                buttons[i * 10 + lastBestHit[1]].classList.contains("hit")
              ) {
              } else if (
                !buttons[i * 10 + lastBestHit[1]].classList.contains("hit")
              ) {
                flag = true;
                attackShip(buttons, i * 10 + lastBestHit[1]);
                break;
              }
            }
          }

          break;

        case 1:
          for (let i = lastBestHit[0] - 1; i > lastBestHit[0] - 4; i--) {
            if (i > -1 && i < 10) {
              if (
                buttons[i * 10 + lastBestHit[1]].classList.contains("check")
              ) {
                break;
              } else if (
                buttons[i * 10 + lastBestHit[1]].classList.contains("hit")
              ) {
              } else if (
                !buttons[i * 10 + lastBestHit[1]].classList.contains("hit")
              ) {
                flag = true;
                attackShip(buttons, i * 10 + lastBestHit[1]);
                break;
              }
            }
          }
          break;

        case 2:
          for (let i = lastBestHit[1] + 1; i < lastBestHit[1] + 4; i++) {
            if (i > -1 && i < 10) {
              if (
                buttons[lastBestHit[0] * 10 + i].classList.contains("check")
              ) {
                break;
              } else if (
                buttons[lastBestHit[0] * 10 + i].classList.contains("hit")
              ) {
              } else if (
                !buttons[lastBestHit[0] * 10 + i].classList.contains("hit")
              ) {
                flag = true;
                attackShip(buttons, lastBestHit[0] * 10 + i);
                break;
              }
            }
          }

          break;

        case 3:
          for (let i = lastBestHit[1] - 1; i > lastBestHit[1] - 4; i--) {
            if (i > -1 && i < 10) {
              if (
                buttons[lastBestHit[0] * 10 + i].classList.contains("check")
              ) {
                break;
              } else if (
                buttons[lastBestHit[0] * 10 + i].classList.contains("hit")
              ) {
              } else if (
                !buttons[lastBestHit[0] * 10 + i].classList.contains("hit")
              ) {
                flag = true;
                attackShip(buttons, lastBestHit[0] * 10 + i);
                break;
              }
            }
          }
          break;
      }

      checkdirection++;
      if (checkdirection >= 5) {
        checkdirection = 0;
      }
    }
  } else {
    while (countShips(buttons) > 0) {
      i++;
      col = Math.floor(Math.random() * 10);
      row = Math.floor(Math.random() * 10);
      if (
        row >= 0 &&
        row < 10 &&
        col >= 0 &&
        col < 10 &&
        !buttons[row * 10 + col].classList.contains("hit") &&
        !buttons[row * 10 + col].classList.contains("check")
      ) {
        attackShip(buttons, row * 10 + col);
        break;
      }
      if (i > 100) {
        for (let j = 0; j < 10; j++) {
          for (let k = 0; k < 10; k++) {
            if (
              !buttons[j * 10 + k].classList.contains("hit") &&
              !buttons[j * 10 + k].classList.contains("check")
            ) {
              attackShip(buttons, j * 10 + k);
              break;
            }
          }
        }
      }
    }
  }
  spinner[0].classList.toggle("hidden");
}

aiButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    attackShip(aiButtons, index);
  });
});
