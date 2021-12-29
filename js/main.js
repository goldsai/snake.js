// =============
// === GAME ====
// =============

const clsBODY = 'snakeBody';
const clsHEAD = 'head';
const clsMOUSE = 'mouse';


let snakeBody = [];
let mouse = null;
let field = null;
let info = null;
let dX = 1,
    dY = 0;
let interval = null;
let delayRun = 300;
let changedDirection = true;

const createEl = (parent, class_name) => {
    let element = document.createElement('div');
    parent.appendChild(element);
    element.classList.add(class_name);
    return element;
}

const createGameField = () => {
    field = createEl(document.body, 'field')
    return field;
}
const createInfo = () => {
    info = createEl(document.body, 'info')
}
const setInfo = (txt) => {
    info.textContent = txt
}

const viewGameScore = () => {
    setInfo(snakeBody.length - 3);
}
const createCells = (field) => {

    for (let y = 1; y < 11; y++) {
        for (let x = 1; x < 11; x++) {
            let excel = createEl(field, 'excel');
            excel.setAttribute('pos-x', x);
            excel.setAttribute('pos-y', y);
        }
    }

}

const setDeltaXY = (x, y) => {
    dX = x;
    dY = y;
    changedDirection = false;
}

const initGame = () => {
    createCells(createGameField());
    createSnake(3);
    createMouse();
    createInfo();
    viewGameScore();
    interval = setInterval(runSnake, delayRun);

    window.addEventListener('keydown', (event) => {
        if (changedDirection) {
            if (event.key == 'ArrowUp' && dY == 0) { setDeltaXY(0, -1) }
            else if (event.key == 'ArrowDown' && dY == 0) { setDeltaXY(0, 1) }
            else if (event.key == 'ArrowLeft' && dX == 0) { setDeltaXY(-1, 0) }
            else if (event.key == 'ArrowRight' && dX == 0) { setDeltaXY(1, 0) }
        }
    });
}

const randXY = (min = 1, max = 10) => {
    return Math.round(Math.random() * (max - 1) + min)

}
const validationXY = (coordinate) => {
    if (coordinate < 1 || coordinate > 10) {
        coordinate %= 10;
    }
    if (coordinate < 0) {
        coordinate += 10;
    }
    return coordinate ? coordinate : 10;
}
const getCell = (x, y) => {

    return document.querySelector('[pos-x = "' + validationXY(x) + '"][pos-y = "' + validationXY(y) + '"]');
}

const createSnake = (len) => {

    let x = randXY();
    let y = randXY();
    for (let i = 0; i < len; i++) {
        snakeBody.push(getCell(x--, y));
        snakeBody[i].classList.add(i ? clsBODY : clsHEAD);
    }
    // return snakeBody?
}

const createMouse = () => {

    do {

        mouse = getCell(randXY(), randXY())
    }
    while (mouse.classList.contains(clsBODY) ||
        mouse.classList.contains(clsHEAD));
    mouse.classList.add(clsMOUSE);
    // return mouse;

}

const moveHead = () => {
    let head = snakeBody[0];
    let newHead = getCell(
        (+head.getAttribute('pos-x') + dX),
        (+head.getAttribute('pos-y') + dY)
    );

    head.classList.remove(clsHEAD);
    head.classList.add(clsBODY)

    newHead.classList.add(clsHEAD);

    snakeBody.unshift(newHead);
    return newHead;
}

const moveTail = () => {
    snakeBody[snakeBody.length - 1].classList.remove(clsBODY);
    snakeBody.pop();
}
const isMouse = (cell) => {
    return cell === mouse;
}
const isBody = (cell) => {
    return cell.classList.contains(clsBODY);
}
const ateMouse = () => {
    mouse.classList.remove(clsMOUSE);
    createMouse();
    viewGameScore();
}

const gameOver = () => {
    clearInterval(interval);
    field.classList.add('gameOver');
    mouse.classList.remove(clsMOUSE);
    setInfo('G A M E ... O V E R')
    for (i = 0; i < snakeBody.length; i++) {
        let cell = snakeBody[i];
        if (cell.classList.contains(clsBODY)) {

            cell.classList.remove(clsBODY)
        }
        if (cell.classList.contains(clsHEAD)) {

            cell.classList.remove(clsHEAD)
        }
    }
}
const runSnake = () => {
    let newHead = moveHead();

    if (isBody(newHead)) { gameOver() }
    else if (isMouse(newHead)) { ateMouse() }
    else { moveTail() }

    changedDirection = true;

}
// =============
// === GAME ====
// =============

initGame();
// console.log(getCell(2, 1));
// runSnake();