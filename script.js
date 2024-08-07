function gameBoard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    const makeBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(cell());
            }
        }
    }

    const getBoard = () => board;


    const writeToken = (row, column, player) => {
        const selectedCell = board[row][column];

        if (selectedCell.getValue() != '') return;

        board[row][column].addToken(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithCellValues);
    }

    const getBoardWithCellValues = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        return boardWithCellValues;
    }

    const resetBoard = () => {
        console.log('board resetting...');
        board.length = 0;
        makeBoard();
    }

    return { makeBoard, getBoard, writeToken, printBoard, getBoardWithCellValues, resetBoard };
}

function cell() {
    let value = '';

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function gameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = gameBoard();
    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const winCheck = (arr) => {
        //check rows
        for (let i = 0; i < 3; i++) {
            const a = arr[i][0];
            const b = arr[i][1];
            const c = arr[i][2];

            if (a != '' && a === b && b === c) {
                console.log(`Congrats! ${getActivePlayer().name} wins!`);
                board.resetBoard();
            }
        }
        //check columns
        for (let i = 0; i < 3; i++) {
            const a = arr[0][i];
            const b = arr[1][i];
            const c = arr[2][i];

            if (a != '' && a === b && b === c) {
                console.log(`Congrats! ${getActivePlayer().name} wins!`);
                board.resetBoard();
            }
        }

        //top left -> bottom right diagonal check
        const a = arr[0][0];
        const b = arr[1][1];
        const c = arr[2][2];

        if (a != '' && a === b && b === c) {
            console.log(`Congrats! ${getActivePlayer().name} wins!`);
            board.resetBoard();
        }

        //right top -> left bottom diagonal check
        const d = arr[0][2];
        const e = arr[1][1];
        const f = arr[2][0];

        if (d != '' && d === e && e === f) {
            console.log(`Congrats! ${getActivePlayer().name} wins!`);
            board.resetBoard();
        }

        //check for draw
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const square = arr[i][j];
                if (square === '') return undefined;
            }
        }

        return 'draw';
    }

    const playRound = (row, column) => {
        const boardWithCellValues = board.getBoardWithCellValues();

        const selectedCell = boardWithCellValues[row][column];


        console.log(
            `Writing ${getActivePlayer().name}'s token to the board in space ${row}, ${column}...`
        );

        if (selectedCell != '') {
            console.log('sorry, that spot is taken! Try again!');
            printNewRound();
            return;
        } else {
            board.writeToken(row, column, getActivePlayer().token);
            boardWithCellValues[row][column] = getActivePlayer().token;
            winCheck(boardWithCellValues);
        }


        switchPlayerTurn();
        printNewRound();
    }

    board.makeBoard();
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

/* To-do:
    add an object that will manage the display and changing the DOM to reflect the board state. --- OK
    Add functions that allow the player to interact with the board by clicking on the webpage. --- OK
    Make it look nice, and allow the players to change their name, restart the game, and results display.
*/


function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, index) => {
            rowIndex = index;
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = index;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);


    updateScreen();

}

screenController();