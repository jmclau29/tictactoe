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

        if (selectedCell.getValue() != 0) return;

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
        board = [];
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
                board.resetBoard;
                return `Congrats! ${getActivePlayer().name} wins!`;
            }
        }
        //check columns
        for (let i = 0; i < 3; i++) {
            const a = arr[0][i];
            const b = arr[1][i];
            const c = arr[2][i];

            if (a != '' && a === b && b === c) {
                board.resetBoard;
                return `Congrats! ${getActivePlayer().name} wins!`;
            }
        }

        //top left -> bottom right diagonal check
        const a = arr[0][0];
        const b = arr[1][1];
        const c = arr[2][2];

        if (a != '' && a === b && b === c) {
            board.resetBoard;
            return `Congrats! ${getActivePlayer().name} wins!`;
        }

        //right top -> left bottom diagonal check
        const d = arr[0][2];
        const e = arr[1][1];
        const f = arr[2][0];

        if (d != '' && d === e && e === f) {
            board.resetBoard;
            return `Congrats! ${getActivePlayer().name} wins!`;
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

    const playRound = (column, row) => {
        console.log(
            `Writing ${getActivePlayer().name}'s to the board in space ${column}, ${row}...`
        );
        board.writeToken(row, column, getActivePlayer().token);

        //check for winner here
        const boardWithCellValues = board.getBoardWithCellValues();
        console.log(winCheck(boardWithCellValues));


        switchPlayerTurn();
        printNewRound();
    }

    board.makeBoard();
    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = gameController();