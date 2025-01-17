const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnStart = document.querySelector('#start')
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLevel = document.querySelector('#level');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');


let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let playerTime = 0;
let timeInterval;

const playerPosition = {
    x: '',
    y: '',
    initialX: '',
    initialY: '',
}

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);



function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = Math.floor(window.innerWidth * 0.8)
    } else {
        canvasSize = Math.floor(window.innerHeight * 0.8)
    }
    
    canvas.setAttribute('width', canvasSize+16);
    canvas.setAttribute('height', canvasSize+16);
    elementsSize = Math.floor(canvasSize /10);    
        
    standbyGame();
    return
}

function standbyGame() {
    level = 0;
    lives = 3;
    timeStart = 0
    renderMap();
    showRecord();
    showLevel();
    spanTime.innerHTML = playerTime;
    return;
}

function startGame() {   

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    renderMap()
    renderPlayerPosition()
    playerPosition.x = playerPosition.initialX;
    playerPosition.y = playerPosition.initialY;
    return
}

function renderMap() {
    game.font = `${elementsSize}px Verdana`;
    game.textAlign = 'end';
    showlives();
    showLevel();
    const map = maps[level];
    game.clearRect(0, 0, canvasSize, canvasSize);
    const mapRows = map.trim().split('\n'); //trim() es un metodo que remueve los espacios en blanco de los string y lo devuelve en un nuevo `string` sin modificar el original, el .split, elimina el caracter que se le indique en el argumento
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    game.clearRect(0, 0, canvasSize, canvasSize);  
    mapRowsCols.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const emoji = emojis[col];
            const posX = (elementsSize * (colIndex + 1))+12;
            const posY = elementsSize * (rowIndex + 1);
            if (col == 'O') {                
                playerPosition.initialX = posX;
                playerPosition.initialY = posY;              
            };
            if (col == 'I') {
                if(playerPosition.x == posX && playerPosition.y == posY) {
                    win();                    
                    return
                }                
            }
            if (col == 'X') {
                if(playerPosition.x == posX && playerPosition.y == posY) {
                    lose()
                    return
                }
            }          
            game.fillText(emoji, posX, posY);                        
        });        
    });    
    return
}

function win () {
    game.clearRect(0, 0, canvasSize, canvasSize);
    level++;    
    if (level >= maps.length) {
        console.log('¡¡¡¡Terminaste el juego!!!!');
        
        level = 0
        clearInterval(timeInterval);
        setRecord();    
        
        playerPosition.x = ''
        playerPosition.y = ''
        standbyGame();
        return
    }        
    return
}

function setRecord() {
    const recordTime = localStorage.getItem('record_time');
    playerTime = Date.now() - timeStart;        
    
    if (recordTime) {            
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = ('SUPERASTE EL RECORD');
            return             
        } else {
            pResult.innerHTML = ('Lo siento, no superaste el records :(');
            return
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = ('Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)');
        return
    }    
}

function lose () {    
    lives--
    if (lives == 0)  {        
        level = 0
        lives = 3
        timeStart = undefined;
    }
    playerPosition.x = ''
    playerPosition.y = ''
    startGame();
    return
}

function renderPlayerPosition(){
    game.fillText(emojis['PLAYER'], playerPosition.initialX, playerPosition.initialY)
    return
}     

function movePlayer() {  
    if (timeStart == 0) {
        return;
    }
    renderMap();
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)    
    return;
}

window.addEventListener('keydown', moveByKeys)
btnStart.addEventListener('click', startGame)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    
    switch (event.key) {
        case "ArrowUp": moveUp(); break;
        case "ArrowLeft": moveLeft(); break;
        case "ArrowRight": moveRight(); break;
        case "ArrowDown": moveDown(); break;
    }

}

function moveUp() {
    if (playerPosition.y <= elementsSize) {
        movePlayer();
        console.log('Ya no puedo subir mas');
        return
    }
    playerPosition.y -= elementsSize;
    movePlayer();
}
function moveLeft() {
    if (playerPosition.x <= elementsSize*2) {
        movePlayer();
        console.log('Ya no puedo ir mas a la izquierda');
        return
    }
    playerPosition.x -= elementsSize;
    movePlayer();
}
function moveRight() {    
    if (Math.ceil(playerPosition.x) >= canvasSize) {
        movePlayer();
        console.log('Ya no puedo ir más a la derecha');
        return
    }
    playerPosition.x += elementsSize;
    movePlayer();
}
function moveDown() {
    if (Math.ceil(playerPosition.y) >= canvasSize) {
        movePlayer();
        console.log('Ya no puedo bajar mas');
        return
    }
    playerPosition.y += elementsSize;    
    movePlayer();
}

function showLevel() {
    spanLevel.innerHTML = level + 1;
    return;
}

function showlives() {
    spanLives.innerHTML = emojis["HEART"].repeat(lives)
    return;
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
    return
}
function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
    return
}