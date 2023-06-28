import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from './constants.js';

const playerPiecesElements = {
    p1 : document.querySelectorAll('[player-id="p1"].player-piece'),
    p2 : document.querySelectorAll('[player-id="p2"].player-piece')
}

let playerNames = JSON.parse(localStorage.getItem('player'));


const diceButtonElement = document.querySelector("#dice-btn");

export class UI {

    static listenDiceClick(callback){
        diceButtonElement.addEventListener("click" , callback);
    }

    static listenResetClick(callback) {
        document.querySelector('#reset-btn').addEventListener('click', callback)
    }

    static listenPieceClick(callback) {
        document.querySelector('.player-pieces').addEventListener('click', callback)
    }

    static setPiecePosition(player , piece , newPosition ){

        if(!playerPiecesElements[player] || !playerPiecesElements[player][piece]){
            console.log(`Player of giben player : ${player} and piece : ${piece} not available`)
            return;
        }

        

        const [x , y ] = COORDINATES_MAP[newPosition];

        const pieceElement =  playerPiecesElements[player][piece];

        pieceElement.style.top = y * STEP_LENGTH + "%";
        pieceElement.style.left = x * STEP_LENGTH + "%";
        


    }


    static setTurn(index){
        if(index < 0 || index >= PLAYERS.length){
            console.log("Player not found");
            return;
        }

        const player = PLAYERS[index];

        document.querySelector('.active-player span').innerText = playerNames[ player ] ;

        const activePlayerBase = document.querySelector('.player-base.highlight');
        
        if(activePlayerBase){
            activePlayerBase.classList.remove("highlight");
        }

        document.querySelector(`[player-id="${player}"].player-base`).classList.add('highlight');



    }




    static enableDice() {
        diceButtonElement.removeAttribute('disabled')
    }

    static disableDice() {
        diceButtonElement.setAttribute("disabled" , "");
    }

    static highlightPieces (player , pieces ){
        pieces.forEach(piece => {
            const pieceElement = playerPiecesElements[player][piece];
            pieceElement.classList.add('highlight');
        });
    }

    static unHighlight( ){
        document.querySelectorAll('.player-piece.highlight').forEach( ele => {
            ele.classList.remove('highlight')
        })
    }

    static setDiceValue(value){
        document.querySelector('.dice-value').innerText = value;
    }

}

// UI.setPiecePosition("p1" , 0 , 30 );
// UI.setTurn(1)
// UI.setTurn(0)
// UI.disableDice();
// UI.enableDice();
// UI.highlightPieces('p1' , [0])
// UI.unHighlight()
// UI.setDiceValue(1)