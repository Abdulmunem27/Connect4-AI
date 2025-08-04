let playerone = 'G';
let playertwo = 'R';
let currentplayer = playerone;

let gameover = false;

var board;
var currcolumns;

const rows = 6;
const columns = 7;

window.onload = function () {
    board = []
    currcolumns = [5, 5, 5, 5, 5, 5, 5]
    for (let i = 0; i < rows; i++){
        let row = []
        for (let j = 0; j < columns; j++){
            row.push(' ');
            let tile = document.createElement('div');
            tile.id = i.toString() + '-' + j.toString();
            tile.classList.add('tile');
            tile.addEventListener('click', setPlayer)
            document.getElementById('board').append(tile)
        }
        board.push(row)
    }
}

function setPlayer(){
    if (gameover){
        return;
    }

    let coord = this.id.split('-');
    r = parseInt(coord[0]);
    c = parseInt(coord[1]);
    r = currcolumns[c];

    if (r < 0){
        return;
    }

    placePiece(r, c, currentplayer);

    if (!gameover && currentplayer == playertwo) {
        setTimeout(robotMove, 500);
    }
}

function checkWinner(){
    //horizontal check
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns - 3; c++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    //vertical check
    for (let c = 0; c < columns; c++){
        for (let r = 0; r < rows - 3; r++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // anti-diagonal check
    for (let r = 0; r < rows - 3; r++){
        for (let c = 0; c < columns - 3; c++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // diagonal check
    for (let r = 3; r < rows; r++){
        for (let c = 0; c < columns - 3; c++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
        
}

function setWinner(r, c) {
    gameover = true;
    let winner = board[r][c];
    let winnerElem = document.getElementById("winner");

    if (winner === playerone) {
        winnerElem.innerText = "Gege Wins!";
        winnerElem.classList.add('gege-win');
        winnerElem.classList.remove('robot-win');
    } else {
        winnerElem.innerText = "Robot Wins!";
        winnerElem.classList.add('robot-win');
        winnerElem.classList.remove('gege-win');
    }

    highlightWinningTiles(winner);
}


function highlightWinningTiles(player) {
    let directions = [
        [0, 1], 
        [1, 0], 
        [1, 1],  
        [-1, 1], 
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] !== player) continue;

            for (let [dr, dc] of directions) {
                let tiles = [[r, c]];
                for (let i = 1; i < 4; i++) {
                    let nr = r + dr * i;
                    let nc = c + dc * i;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= columns || board[nr][nc] !== player) {
                        break;
                    }
                    tiles.push([nr, nc]);
                }

                if (tiles.length === 4) {
                    for (let [tr, tc] of tiles) {
                        let tile = document.getElementById(`${tr}-${tc}`);
                        tile.classList.add('win-tile', player === playerone ? 'gege' : 'robot');
                    }
                    return;
                }
            }
        }
    }
}



function placePiece(r, c, player) {
    board[r][c] = player;
    let tile = document.getElementById(r.toString() + '-' + c.toString());

    if (player == playerone){
        tile.classList.add('gege');
        currentplayer = playertwo;
    } else {
        tile.classList.add('robot');
        currentplayer = playerone;
    }

    currcolumns[c] = r - 1;
    checkWinner();
}


function robotMove() {
    if (gameover) return;

    for (let c = 0; c < columns; c++) {
        let r = currcolumns[c];
        if (r < 0) continue;

        board[r][c] = playertwo;
        if (checkTempWin(playertwo)) {
            placePiece(r, c, playertwo);
            return;
        }
        board[r][c] = ' ';
    }

    for (let c = 0; c < columns; c++) {
        let r = currcolumns[c];
        if (r < 0) continue;

        board[r][c] = playerone;
        if (checkTempWin(playerone)) {
            board[r][c] = playertwo;
            placePiece(r, c, playertwo);
            return;
        }
        board[r][c] = ' ';
    }

    let available = [];
    for (let c = 0; c < columns; c++) {
        if (currcolumns[c] >= 0) available.push(c);
    }

    if (available.length === 0) return;

    let randCol = available[Math.floor(Math.random() * available.length)];
    let r = currcolumns[randCol];
    placePiece(r, randCol, playertwo);
}

function checkTempWin(player) {

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] == player && board[r][c+1] == player && board[r][c+2] == player && board[r][c+3] == player) {
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] == player && board[r+1][c] == player && board[r+2][c] == player && board[r+3][c] == player) {
                return true;
            }
        }
    }

    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] == player && board[r+1][c+1] == player && board[r+2][c+2] == player && board[r+3][c+3] == player) {
                return true;
            }
        }
    }

    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] == player && board[r-1][c+1] == player && board[r-2][c+2] == player && board[r-3][c+3] == player) {
                return true;
            }
        }
    }
    return false;
}
