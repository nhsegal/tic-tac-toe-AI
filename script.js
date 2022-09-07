'use strict';

const game = {

    board: [
       [0, 0, 0],
       [0, 0, 0],
       [0, 0, 0]
    ],

    turn: 1,
    status: null,

    init: function() {
        this.cacheDom();
        this.bindEvents();
    },
   
    cacheDom: function() {
        this.cells = document.querySelectorAll('.cell');
        this.resetBtn = document.querySelector('#resetBtn');
        this.result = document.querySelector('#result');
       
    },
    
    bindEvents: function() {
        for (let cell of this.cells) {
            cell.onclick = this.playerMove.bind(this);
        }
        resetBtn.addEventListener('click', this.reset.bind(this));
      
    },

    // If it is the computer's turn, 
    // pick a random spot check if it is free,
    // if it is move there, else pick randomly again
    // After a move, render the board, check for win, advance the count, 

    cpuMove: function() {
        if (this.status !== null){
            return;
           
        }
        while (this.turn === -1) {
            let nextMove = {    
                                score: 100,
                                x: -1,
                                y: -1
                            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === 0) {
                        let potentialMove = evaluateMove(i,j, this.board, 1);
                        if (potentialMove.score < nextMove.score) {
                            nextMove = potentialMove
                        }
                    }                    
                }
            }

            if (nextMove.score === -1) {
                this.checkForEnd(this.board);
                this.render();
                this.turn = -this.turn;
            }

            else {
                this.board[nextMove.x][nextMove.y] = -1
                evaluateMove(this.board )

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (this.board[i][j] === 0) {
                            let potentialMove = evaluateMove(i,j, this.board, 1);
                            if (potentialMove.score < nextMove.score) {
                                nextMove = potentialMove
                            }
                        }                    
                    }
                }

            }
        

           
        }
    },

    render: function() {
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
    },

    // If it is the player's turn and eventListener clicks on open spot
    // mark it, advance the count, render the board, check for win, let the CPU move
    playerMove: function(e) {  
        if (this.status !== null){
            console.log("Over!")
            return;
        }
        if (this.turn === 1 && this.board[e.target.dataset.row][e.target.dataset.col] === 0) {
            this.board[e.target.dataset.row][e.target.dataset.col] = 1;
            this.checkForEnd(this.board);

            this.render();
            this.turn = -this.turn;
            this.cpuMove();
        }   
    },

    // Rewrote to take the board as a parameter
    checkForEnd: function(brd) { 
        this.status = this.checkRows(brd) ||  this.checkCols(brd) || this.checkDiagonals(brd) || this.checkForTie(brd);
      
        if (this.status === 1) {
            result.textContent = "You won!"
        }
        else if (this.status === -1) {
            result.textContent = "You lost!"
        }
        else if (this.status === 0) {
            result.textContent = "You tied!"
        }
        return  (this.status)
    },

    // Check functions returns who the win
    // 1 === player, -1 === cpu, 0 === tie, null === still in play


    checkRows: function(brd) {
        for (let i = 0; i < 3; i++) {
            if (brd[i].reduce((a,b)=>a+b) === 3) {
                return 1;
            }
            else if (brd[i].reduce((a,b)=>a+b) === -3) {
                 return -1;
            }
        }
        return null;
    },

    
    checkCols: function(brd) {
        let colCheck = brd.reduce((a,b)=> [a[0]+ b[0], a[1]+ b[1], a[2]+ b[2]]);
        if (colCheck.indexOf(3) >= 0) { 
            return 1;
        }
        if (colCheck.indexOf(-3) >= 0) {
            return -1;
        }
        return null;
    },

    checkDiagonals: function(brd) {
        let leftDiagonal = brd[0][0] + brd[1][1] + brd[2][2];
        let rightDiagonal = brd[2][0] + brd[1][1] + brd[0][2];
        if (leftDiagonal == 3 || rightDiagonal == 3 ) { 
            return 1;
        }
        if (leftDiagonal == -3 || rightDiagonal == -3) {
            return -1;
        }
        return null;
    },


    checkForTie: function(brd) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (brd[i][j] === 0) {
                    return null;
                }
            }
        }
        return 0;
    },

    reset: function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = 0;
            }
        }
        this.turn = 1;
        this.result.textContent = ' ';
        this.status = null;
        this.render();
    },

    evaluateMove: function (x,y, brd, player) {
        
        // Do I want board or a copy of board?
        const tempBoard = brd;
        tempBoard[x][y] = player;

        let score = (this.checkRows(tempBoard) || this.checkCols(tempBoard) || this.checkDiagonals(tempBoard) || this.checkForTie(tempBoard))
        tempBoard[x][y] = 0;
        return {score, x, y}
       
    }
    

}

game.init();
game.evaluateMove(0,0,game.board,1)