'use strict';

const game = {
    board: [
       [0, 0, 0],
       [0, 0, 0],
       [0, 0, 0]
    ],

    winType: null,

    // For turn, player, cpu,   1 = X, -1 = O  
    turn: 1,
  
    // For status:  null: game in progress, 1: X won, -1: O won, 0: tied 
    status: null,

    init: function() {
        this.cacheDom();
        this.bindEvents();
        if (cpuPlayer.marker === 1) {
            cpuPlayer.move();
        }
        this.render();
    },
   
    cacheDom: function() {
        this.cells = document.querySelectorAll('.cell');
        this.resetBtn = document.querySelector('#resetBtn');
        this.result = document.querySelector('#result');
        this.pickXorO = document.querySelector('#pickXorO');
        this.topRow = document.querySelectorAll("[data-row='0']");
        this.midRow = document.querySelectorAll("[data-row='1']");
        this.botRow = document.querySelectorAll("[data-row='2']");
        this.leftCol = document.querySelectorAll("[data-col='0']");
        this.midCol = document.querySelectorAll("[data-col='1']");
        this.rightCol = document.querySelectorAll("[data-col='2']");
        this.leftDiagonal = document.querySelectorAll("[data-col='0'][data-row='0'], [data-col='1'][data-row='1'], [data-col='2'][data-row='2']" );
        this.rightDiagonal = document.querySelectorAll("[data-col='2'][data-row='0'], [data-col='1'][data-row='1'], [data-col='0'][data-row='2']");
        this.gameMode = document.querySelector('input[name=game_mode]:checked').value;
        this.setGameMode = document.querySelectorAll('input[name=game_mode]');
    },
    
    bindEvents: function() {
        for (let cell of this.cells) {
            cell.onclick = humanPlayer.move; //humanPlayer.move;
        }
        
        this.resetBtn.addEventListener('click', this.reset.bind(this));
        this.pickXorO.addEventListener('change', this.switchFunction.bind(this));
        for (let radio of this.setGameMode) {
            radio.onclick = (e)=> {this.gameMode = e.target.value;}; //humanPlayer.move;
        }
       
    },

    render: function() { 
        // Display board
        for (let cell of this.cells) {
            if (this.board[cell.dataset.row][cell.dataset.col] === 1) {
                cell.textContent = '×';
            }
            else if (this.board[cell.dataset.row][cell.dataset.col] === -1) {
                cell.textContent = '○';
            }
            else {
                // necessary for reset
                cell.textContent = ' ';
            }
        }    

        // Display status
        switch(this.status) {
            case (humanPlayer.marker):
                result.textContent = "You won!"
                break;
            
            case (cpuPlayer.marker):
                result.textContent = "You lost!"
                break;
            
            case (0):
                result.textContent = "You tied!"
                break;
            
            default:
                result.textContent = " "
          }
    },


    // Check functions returns an object with a winner and code key.
    // winner: 1 === X, -1 === O, 0 === tie, null === still in play
    // code: 1 through 8 for which row, col, or diagonal.
    
    checkStatus: function() {
        return {winner: (this.checkRows().winner ||  this.checkCols().winner || this.checkDiagonals().winner || this.checkForTie().winner), 
                code:  (this.checkRows().code ||  this.checkCols().code || this.checkDiagonals().code || null)}
    },

    checkRows: function() {
        for (let i = 0; i < 3; i++) {
            if (this.board[i].reduce((a,b)=>a+b) === 3) {
                return {winner: 1, code: i+1} ;
            }
            else if (this.board[i].reduce((a,b)=>a+b) === -3) {
                return {winner: -1, code: i+1};
            }
        }
        return {winner: null};
    },

    checkCols: function() {
        let colCheck = this.board.reduce((a,b)=> [a[0]+ b[0], a[1]+ b[1], a[2]+ b[2]]);
        if (colCheck.indexOf(3) >= 0) { 
            let code = colCheck.indexOf(3) + 4;
            return {winner: 1, code: code};
        }
        if (colCheck.indexOf(-3) >= 0) {
            let code = colCheck.indexOf(-3) + 4;
            return {winner: -1, code: code};
        }
    return {winner: null};
    },

    checkDiagonals: function() {
        let leftDiagonal = this.board[0][0] + this.board[1][1] + this.board[2][2];
        let rightDiagonal = this.board[2][0] + this.board[1][1] + this.board[0][2];
        if (leftDiagonal == 3) { 
            return {winner: 1, code: 8}
        }
        if (rightDiagonal == 3 ) { 
            return {winner: 1, code: 7}
        }
        if (leftDiagonal == -3) { 
            return {winner: -1, code: 8}
        }
        if (rightDiagonal == -3) {
            return {winner: -1, code: 7}
        }
        return {winner: null}
    },

    checkForTie: function() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === 0) {
                    return {winner: null};
                }
            }
        }
        return {winner: 0};
    },

    reset: function () {
        this.winType = null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = 0;
            }
        }
        this.turn = 1;
        this.result.textContent = ' ';
        this.status = null;
        for (let cell of this.cells) {
            cell.classList.value = 'cell';
        }

        this.render();
        if (cpuPlayer.marker === 1) {
            cpuPlayer.move();
        }
    },

    highlightWin: function() {
        switch(this.winType) {
            case (1):
                this.topRow.forEach((e) => e.classList.add("winning"));
                break;
            case (2):
                this.midRow.forEach((e) => e.classList.add("winning"));  
                break;
            case (3):
                this.botRow.forEach((e) => e.classList.add("winning"));
                break;
            case (4):
                this.leftCol.forEach((e) => e.classList.add("winning"));
                break;
            case (5):
                this.midCol.forEach((e) => e.classList.add("winning"));
                break;
            case (6):
                this.rightCol.forEach((e) => e.classList.add("winning"));
                break;
            case (7):
                this.rightDiagonal.forEach((e) => e.classList.add("winning"));
                break;
            case (8):
                this.leftDiagonal.forEach((e) => e.classList.add("winning"));   
                break;
            default:
                this.cells.forEach((e)=> e.classList.value = 'cell');
          }
    },

    // The function bound to the toggle switch for picking X or O
    switchFunction: function () {
        humanPlayer.marker = -humanPlayer.marker;
        cpuPlayer.marker = -cpuPlayer.marker;
        this.reset();
    },

    changeGameMode: function(e) {
        this.gameMode = e.target.value;
        console.log(this.gameMode)
    }

}
   
const cpuPlayer = {
    marker: -1,
    move: function() {
        // If the game is over, exit
        if (game.status !== null){
            return;
        }

        if (game.turn === cpuPlayer.marker) {  
            // Score each position on the board
            const listOfMoves = []
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (game.board[i][j] === 0) {
                        let move = {i: i, j: j, score: cpuPlayer.evaluateMove(i, j, 0, true).score}
                        listOfMoves.push(move);
                    }
                }  
            }
            // Select the move from the list with the highest score
            const bestMove = listOfMoves.reduce(cpuPlayer.pickMaxMove); 
            game.board[bestMove.i][bestMove.j] = cpuPlayer.marker;       
            game.status = game.checkStatus().winner; 
            if (game.checkStatus().code) game.winType = game.checkStatus().code;
            game.highlightWin(); 
            game.render();
            game.turn = -game.turn;      
        }      
    },

    evaluateMove: function (row, col, depth, isMaximizing) {
        // The board is temporary modified with a tentative move and evaluated   
        if (depth%2 === 0) {
            game.board[row][col] = cpuPlayer.marker;
        } 
        else {
            game.board[row][col] = -cpuPlayer.marker;    
        }
        
        let score = null;

        // If the move would end the game return its score
        // but undo the move first

        // If cpu is X (1) and checkStatus() is 1, cpu wins, so score it as 1
        // If cpu is O (-1) and checkStatus() is 1, player wins, so score is -1
        // If cpu is O (-1) and checkStatus() is -1, cpu wins, so score is 1
        // Thus score is a product of cpuPlayer.marker and checkStatus
        if (depth > game.gameMode){
            score = 0;
            game.board[row][col] = 0;
            return {score};
        }

        if (game.checkStatus().winner !== null) {
            score = 10*game.checkStatus().winner*this.marker/(depth+1);
            game.board[row][col] = 0;
            return {score};
        }

       
        const listOfMoves = []
        if (isMaximizing) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (game.board[i][j] === 0) {
                        let move = {i: i, j: j, score: cpuPlayer.evaluateMove(i, j, depth+1, false).score}
                        listOfMoves.push(move);
                    }
                }
            }
            const bestMove = listOfMoves.reduce(cpuPlayer.pickMinMove);
            game.board[row][col] = 0;
            return {score: bestMove.score}
        }

        else {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (game.board[i][j] === 0) {
                        let move = {i: i, j: j, score: cpuPlayer.evaluateMove(i, j, depth+1, true).score}
                        listOfMoves.push(move);
                    }
                }
            }
            const bestMove = listOfMoves.reduce(cpuPlayer.pickMaxMove);
            game.board[row][col] = 0;
            return {score: bestMove.score}
        }
    },

    pickMaxMove: function(a, b) {
        if ((a.score>b.score) ){
            return a;
        }
        if (a.score<b.score){
            return b;
        }
        if (Math.random()>.5){
            return a;
        }
        return b
    },
    
    pickMinMove: function(a, b) {
        if ((a.score<b.score) ){
            return a;
        }
        if (a.score>b.score){
            return b;
        }
        if (Math.random()>.5){
            return a;
        }
        return b
    }
}

const humanPlayer = {
    marker: 1,

    move: function(e) {  
        
        
        // If game is over, exit
        if (game.status !== null){
            
            return;
        }

        // If it is player's turn and they click on an open spot
        // mark it with player's mark
        // check status
        if (game.turn === humanPlayer.marker && game.board[e.target.dataset.row][e.target.dataset.col] === 0) {
            game.board[e.target.dataset.row][e.target.dataset.col] = humanPlayer.marker;
            game.status = game.checkStatus().winner;
            if (game.checkStatus().code) game.winType = game.checkStatus().code;
            game.highlightWin(); 
            game.render();
            game.turn = -game.turn;
            cpuPlayer.move();
        }   
    },

}

game.init();
