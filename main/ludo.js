import { BASE_POSITIONS, HOME_ENTRANCE, HOME_POSITIONS, PLAYERS, SAFE_POSITIONS, START_POSITIONS, STATE, TURNING_POINTS } from './constants.js';
import { UI } from './UI.js';

export class Ludo {

    currentPositions = {
        p1: [],
        p2: []
    }

    _diceValue; // need to know

    get diceValue() {
        return this._diceValue;
    }

    set diceValue(value) {
        this._diceValue = value;

        UI.setDiceValue(value);
    }

    _turn;

    get turn() {
        return this._turn;
    }

    set turn(value) {
        this._turn = value;
        UI.setTurn(value);
    }


    _state;

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;

        if (value === STATE.DICE_NOT_ROLLED) {
            UI.enableDice();
            UI.unHighlight();
        } else {
            UI.disableDice();
        }
    }




    constructor() {

        let playerNames = JSON.parse(localStorage.getItem('player'));


        document.querySelector('#player1').textContent = playerNames.p1
        document.querySelector('#player2').textContent = playerNames.p2


        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();

        this.resetGame();
        this.listenGoBack();

    }

    listenGoBack(){
        UI.listenGoBack(this.handleGoBack);
    }

    handleGoBack(){
        window.location.href = './index.html'
    }


    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this));
    }

    onDiceClick() {
        console.log("dice clicked");
        this.diceValue = Math.floor(Math.random() * 6) + 1;

        this.state = STATE.DICE_ROLLED;

        this.checkForEligiblePieces();
    }

    checkForEligiblePieces() {
        const player = PLAYERS[this.turn];

        const eligiblePieces = this.getEligiblePieces(player);

        if (eligiblePieces.length) {
            UI.highlightPieces(player, eligiblePieces);
        } else {
            this.incrementTurn();
        }
    }

    incrementTurn() {
        this.turn = this.turn === 0 ? 1 : 0;
        this.state = STATE.DICE_NOT_ROLLED;
        
    }

    getEligiblePieces(player) {
        return [0, 1, 2, 3].filter(piece => {
            const currentPosition = this.currentPositions[player][piece];

            if (currentPosition === HOME_POSITIONS[player]) {
                return false;
            }
            if (BASE_POSITIONS[player].includes(currentPosition) && this.diceValue !== 6) {
                return false;
            }

            if (HOME_ENTRANCE[player].includes(currentPosition) && this.diceValue > HOME_POSITIONS[player] - currentPosition) {
                return false;
            }

            return true;
        })
    }

    listenResetClick() {
        UI.listenResetClick(this.resetGame.bind(this))
    }

    resetGame() {

        this.currentPositions = structuredClone(BASE_POSITIONS);


        PLAYERS.forEach(player => {
            [0, 1, 2, 3].forEach(piece => {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece]);
            })
        })

        this.turn = 0;
        this.state = STATE.DICE_NOT_ROLLED;
        document.querySelector('.dice_img').src = `./main/dice0.gif`;
    }

    listenPieceClick() {
        UI.listenPieceClick(this.onPieceClick.bind(this))
    }

    onPieceClick(event) {

        const Target = event.target;



        if (!Target.classList.contains("player-piece")) {
            return;
        }

        console.log('piece clicked')

        const player = Target.getAttribute('player-id');
        const piece = Target.getAttribute('piece')

        console.log
        this.handlePieceClick(player, piece);

    }

    handlePieceClick(player, piece) {
        if (this.state === STATE.DICE_ROLLED && PLAYERS[this.turn] == player) {
            this.movePiece(player, piece, this.diceValue);
        }
    }


    setPiecePosition(player, piece, newPosition) {

        this.currentPositions[player][piece] = newPosition;

        UI.setPiecePosition(player, piece, newPosition)
    }

    movePiece(player, piece, moveBy) {

        setTimeout(() => {
            document.querySelector('.dice_img').src = `./main/dice0.gif`;
        } , 800 )


        const currentPosition = this.currentPositions[player][piece];

        if (BASE_POSITIONS[player].includes(currentPosition) && moveBy === 6) {
            console.log("aman")
            this.setPiecePosition(player, piece, START_POSITIONS[player]);
            this.state = STATE.DICE_NOT_ROLLED;
            return;
        } else if (BASE_POSITIONS[player].includes(currentPosition)) {
            return;
        }


        const interval = setInterval(() => {
            this.incrementPiecePosition(player, piece)
            moveBy--;

            if (moveBy == 0) {
                clearInterval(interval);

                // Check if player won

                if (this.hasPlayerWon(player)) {
                    alert(`Player : ${player} has won!`);
                    this.resetGame();
                    return;
                }

                const isKill = this.checkForKill(player, piece);

                if (isKill || this.diceValue === 6) {
                    this.state = STATE.DICE_NOT_ROLLED;
                    return;
                }

                this.incrementTurn();
            }
        }, 300)
    }

    checkForKill(player, piece) {
        const currentPosition = this.currentPositions[player][piece];
        const opponent = player === 'p1' ? 'p2' : 'p1';
        let kill = false;

        [0, 1, 2, 3].forEach(piece => {
            const opponentPosition = this.currentPositions[opponent][piece];

            if (currentPosition === opponentPosition && !SAFE_POSITIONS.includes(opponentPosition)) {
                this.setPiecePosition(opponent, piece, BASE_POSITIONS[opponent][piece])
                kill = true;
            }
        })

        return kill;

    }

    hasPlayerWon(player) {
        return [0, 1, 2, 3].every(piece => this.currentPositions[player][piece] === HOME_POSITIONS[player])

    }

    incrementPiecePosition(player, piece) {

        let incrementedPosition = this.getIncrementedPosition(player, piece)

        this.setPiecePosition(player, piece, incrementedPosition)
    }

    //

    getIncrementedPosition(player, piece) {
        const currentPosition = this.currentPositions[player][piece];

        if (currentPosition === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0];
        } else if (currentPosition === 51) {
            return 0;
        }

        return currentPosition + 1;

    }
}