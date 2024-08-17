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
        board.length = 0;
        makeBoard();
    }

    return {
        makeBoard,
        getBoard,
        writeToken,
        printBoard,
        getBoardWithCellValues,
        resetBoard
    };
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

    let winner = '';
    const updateName = (player1, player2) => {
        players[0].name = player1;
        players[1].name = player2;
    };

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const getWinner = () => winner;

    const setActivePlayer = (player) => {
        activePlayer = players[player];
    }

    const printNewRound = () => {
        board.printBoard();
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
                return winner = `${getActivePlayer().name} wins!`;
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
                return winner = `${getActivePlayer().name} wins!`;

            }
        }

        //top left -> bottom right diagonal check
        const a = arr[0][0];
        const b = arr[1][1];
        const c = arr[2][2];

        if (a != '' && a === b && b === c) {
            console.log(`Congrats! ${getActivePlayer().name} wins!`);
            board.resetBoard();
            return winner = `${getActivePlayer().name} wins!`;

        }

        //right top -> left bottom diagonal check
        const d = arr[0][2];
        const e = arr[1][1];
        const f = arr[2][0];

        if (d != '' && d === e && e === f) {
            console.log(`Congrats! ${getActivePlayer().name} wins!`);
            board.resetBoard();
            return winner = `${getActivePlayer().name} wins!`;

        }

        //check for draw
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const square = arr[i][j];
                if (!square) return undefined;
            }
        }

        console.log('draw!');
        board.resetBoard();
        return winner = 'draw';
    }

    const playRound = (row, column) => {

        const boardWithCellValues = board.getBoardWithCellValues();
        const selectedCell = boardWithCellValues[row][column];

        if (selectedCell != '') {
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
        getWinner,
        playRound,
        getActivePlayer,
        updateName,
        setActivePlayer,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard
    };
}


function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const messageDiv = document.querySelector('.message');

    const announceWinner = (winner) => {
        if (!winner) {
            messageDiv.textContent = '';
        } else if (winner === 'draw') {
            messageDiv.textContent = 'the game is a draw!';
        } else {
            messageDiv.textContent = winner;
        }
    }

    const updatePlayerTurn = () => {
        activePlayer = game.getActivePlayer().name;
        playerTurnDiv.textContent = `${activePlayer}'s turn...`
    }

    const updateScreen = () => {
        boardDiv.textContent = "";
        messageDiv.textContent = "";
        const board = game.getBoard();
        const winner = game.getWinner();

        announceWinner(winner);

        updatePlayerTurn();

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
    };

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (e.target.textContent != '') {
            messageDiv.textContent = 'sorry, that spot is taken. Please try again!';
            return;
        }
        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
   
   
    window.addEventListener("DOMContentLoaded", () => {
        const openButton = document.getElementById('change-name');
        const closeButton = document.getElementById('close-modal');
        const dialog = document.getElementById('change-name-modal');
        const versus = document.getElementById('versus');
        const restartButton = document.getElementById('restart-game');

        openButton.addEventListener('click', () => {
            dialog.showModal();
        });
        closeButton.addEventListener('click', () => {
            player1 = document.getElementById('player-one').value;
            player2 = document.getElementById('player-two').value;
            activePlayer = document.getElementById('order').value;
            game.updateName(player1, player2);
            versus.textContent = `${player1} vs. ${player2}`;
            game.setActivePlayer(activePlayer);
            game.resetBoard();
            dialog.close();
            updateScreen();
        });
        restartButton.addEventListener('click', () => {
            game.resetBoard();
            game.setActivePlayer(0);
            versus.textContent = 'Player One vs. Player Two';
            updateScreen();
        });
    });
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

screenController();

/* TO DO
fix changing the turn message from undefined to the actual player's name. FINISHED
change the win message from getActivePlayer to the actual player's name. FINISHED
implement a message in the DOM when the clicked space is already filled. FINISHED
*/

/* 
CREDIT: Most of the code in the gameBoard(), cell(), gameController(), and screenController() is drawn from the
excellent post "Building a house from the inside out" by Alex Younger. It can be found at:
https://www.ayweb.dev/blog/building-a-house-from-the-inside-out
*/