'use strict';

function pickMaxMove(a, b) {
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
}

function pickMinMove(a, b) {
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

let winType = null;

const game = {

    board: [
       [0, 0, 0],
       [0, 0, 0],
       [0, 0, 0]
    ],

    // For turn, player, cpu,   1 = X, -1 = O  
    turn: 1,
    player: 1,
    cpu: -1,

    // For status:  null: game in progress, 1: X won, -1: O won, 0: tied 
    status: null,

    init: function() {
        this.cacheDom();
        this.bindEvents();
        if (this.cpu === 1) {
            this.cpuMove();
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
    },
    
    bindEvents: function() {
        for (let cell of this.cells) {
            cell.onclick = this.playerMove.bind(this);
        }
        this.resetBtn.addEventListener('click', this.reset.bind(this));
        this.pickXorO.addEventListener('change', this.switchFunction.bind(this));
       
    },

    cpuMove: function() {
        // If the game is over, exit
        if (this.status !== null){
            return;
        }

        if (this.turn === this.cpu) {  
            // Score each position on the board
            const listOfMoves = []
          
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === 0) {
                        let move = {i: i, j: j, score: this.evaluateMove(i, j, 0, true).score}
                        listOfMoves.push(move);
                    }
                }  
            }

            //for (let item of listOfMoves){
            //    console.log(`Move: ${item.i}, ${item.j} Score: ${item.score} Depth: ${item.depth}`)
            //}

            // Select the move from the list with the highest score
            
           

            const bestMove = listOfMoves.reduce(pickMaxMove);
           
           
           
            // console.log(`The best move is row:${bestMove.i}, col: ${bestMove.j}`);
            
            
            this.board[bestMove.i][bestMove.j] = this.cpu;       
            this.status = this.checkStatus().winner; 
            if (this.checkStatus().code) winType = this.checkStatus().code;
            this.highlightWin(); 
            this.render();
            this.turn = -this.turn;      
            
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
            case (this.player):
                result.textContent = "You won!"
                break;
            
            case (this.cpu):
                result.textContent = "You lost!"
                break;
            
            case (0):
                result.textContent = "You tied!"
                break;
            
            default:
                result.textContent = " "
          }
    },


    playerMove: function(e) {  
        // If game is over, exit
        if (this.status !== null){
            return;
        }

        // If it is player's turn and they click on an open spot
        // mark it with player's mark
        // check status
        if (this.turn === this.player && this.board[e.target.dataset.row][e.target.dataset.col] === 0) {
            this.board[e.target.dataset.row][e.target.dataset.col] = this.player;
            this.status = this.checkStatus().winner;
            if (this.checkStatus().code) winType = this.checkStatus().code;
            this.highlightWin(); 
            this.render();
            this.turn = -this.turn;
            this.cpuMove();
        }   
    },

    // Check functions returns who the winner is
    // 1 === X, -1 === O, 0 === tie, null === still in play
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
        winType = null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = 0;
            }
        }
        this.turn = 1;
        this.result.textContent = ' ';
        this.status = null;

        //this.cells.forEach((e)=> (console.log(e.classList)));
        for (let cell of this.cells) {
            cell.classList.value = 'cell';
        }
       
        this.render();
        if (game.cpu === 1) {
            game.cpuMove();
        }
    },

    // The function bound to the toggle switch for picking X or O
    switchFunction: function () {
        this.player = -this.player;
        this.cpu = -this.cpu;
        this.reset();
    },

    evaluateMove: function (row, col, depth, isMaximizing) {
       
        // The board is temporary modified with a tentative move and evaluated   
        if (depth%2 === 0) {
            this.board[row][col] = this.cpu;
        } 
        else {
            this.board[row][col] = -this.cpu;    
        }
        
        let score = null;

        // If the move would end the game return its score
        // but undo the move first

        // If cpu is X (1) and checkStatus() is 1, cpu wins, so score it as 1
        // If cpu is O (-1) and checkStatus() is 1, player wins, so score is -1
        // If cpu is O (-1) and checkStatus() is -1, cpu wins, so score is 1?


        if (this.checkStatus().winner !== null) {
            score = 10*this.checkStatus().winner*this.cpu/(depth+1);
            this.board[row][col] = 0;
            return {score};
        }

       
        const listOfMoves = []
        if (isMaximizing) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === 0) {
                        let move = {i: i, j: j, score: this.evaluateMove(i, j, depth+1, false).score}
                        listOfMoves.push(move);
                    }
                }
            }
            const bestMove = listOfMoves.reduce(pickMinMove);
            this.board[row][col] = 0;
            return {score: bestMove.score}
        }

        else {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === 0) {
                        let move = {i: i, j: j, score: this.evaluateMove(i, j, depth+1, true).score}
                        listOfMoves.push(move);
                    }
                }
            }
            const bestMove = listOfMoves.reduce(pickMaxMove);
            this.board[row][col] = 0;
            return {score: bestMove.score}
        }
    },

   highlightWin: function() {
        switch(winType) {
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
    }
}

game.init();

/* When the AI explores moves it changes winType through the checkMove functions and this leads to erroneous highlighting.*/