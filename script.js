/*----- constants -----*/
const TURN_LOOKUP = {
    "1": "X",
    "-1": "O",
    "null": "",
};

const COLOR_LOOKUP = {
    "1": "red",
    "-1": "blue",
    "null": "white",
};



/*----- state variables -----*/
let board;
let winner;
let turn;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h1");
const resetBtn = document.querySelector("button");
const boxEls = Array.from(document.querySelectorAll("#board > div"));




/*----- event listeners -----*/
document.getElementById("board").addEventListener("click", handleClick);
resetBtn.addEventListener("click", init);



/*----- functions -----*/
init();

function init() {
    board = [
        [null,null,null],
        [null,null,null],
        [null,null,null],
    ];

    winner = null;
    turn = 1;
    
    render();
};

function handleClick(evt) {
    const boxId = evt.target.id;
    if(boxId === "board") return;
    colIdx = parseInt(boxId.charAt(1));
    rowIdx = parseInt(boxId.charAt(3));
    if(board[colIdx][rowIdx]) return;
    board[colIdx][rowIdx] = turn;
    winner = checkWinner(colIdx, rowIdx);
    turn *= -1;
    render();
};

function checkWinner(colIdx, rowIdx) {
    return checkVerticalWin(colIdx, rowIdx) || checkHorizontalWin(colIdx, rowIdx) || checkNeSwWin(colIdx, rowIdx) || checkNwSeWin(colIdx, rowIdx) || checkTie();
};

function checkTie() {
    if(!board[0].includes(null) && !board[1].includes(null) && !board[2].includes(null)) return "T";
}

function checkNwSeWin(colIdx, rowIdx) {
    const adjCount = checkAdjacent(colIdx, rowIdx, 1, -1) + checkAdjacent(colIdx, rowIdx, -1, 1);
    return adjCount === 2 ? board[colIdx][rowIdx] : null;
};

function checkNeSwWin(colIdx, rowIdx) {

    const adjCount = checkAdjacent(colIdx, rowIdx, 1, 1) + checkAdjacent(colIdx, rowIdx, -1, -1);
    return adjCount === 2 ? board[colIdx][rowIdx] : null;

};

function checkHorizontalWin(colIdx, rowIdx) {
    const adjCount = checkAdjacent(colIdx, rowIdx, 1, 0) + checkAdjacent(colIdx, rowIdx, -1, 0);
    return adjCount === 2 ? board[colIdx][rowIdx] : null;
};

function checkVerticalWin(colIdx, rowIdx) {
    const adjCount = checkAdjacent(colIdx, rowIdx, 0, -1) + checkAdjacent(colIdx, rowIdx, 0, 1)
    return adjCount === 2 ? board[colIdx][rowIdx] : null;
};

function checkAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    let count = 0;
    const playerValue = board[colIdx][rowIdx];

    // perform the offset to begin checking adjacent cells
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (board[colIdx] && board[colIdx][rowIdx] === playerValue) {
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    };
    return count;
};

function render() {
    renderMessage();
    renderControls();
    renderBoard();
};

function renderControls() {
    resetBtn.style.visibility = winner ? "visible" : "hidden";
    board.forEach(function (colArray, colIdx) {
        colArray.forEach(function(cellValue, rowIdx){
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            if(winner) {
                cellEl.style.border = "hidden";
                document.getElementById("board").removeEventListener("click", handleClick);
            } else if(cellValue) {
                cellEl.style.border = "hidden";
                cellEl.style.transform = "none";
            } else {
                cellEl.removeAttribute("style");
            }
        });
        
    });
};

function renderMessage() {
    if (winner === "T") {
        // Display tie game
        messageEl.innerText = "Tie Game!"
    } else if (winner) {
        // Display who won
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[winner]}">${TURN_LOOKUP[winner]}</span> Wins!`;
    } else {
        // Display the turn
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[turn]}">${TURN_LOOKUP[turn]}'s</span> Turn!`;
    }
};

function renderBoard() {
    // loop over the board array
    board.forEach(function (colArray, colIdx) {
        // for each column array inside the board array
        colArray.forEach(function (cellValue, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.color = COLOR_LOOKUP[cellValue];
            cellEl.innerText = `${TURN_LOOKUP[cellValue]}`


        });
    });
};