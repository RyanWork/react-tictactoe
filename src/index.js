import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * Create a square object to render
 * @param  props    The properties of the square
 */
function Square(props){
    return (
        <button 
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

/**
 * Determines if there is a winner
 * @param squares The state of squares
 */
function calculateWinner(squares) {
    // Possible winning positions
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Check if there is a winner
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        // If all the values in that line are the same
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        history: [
            {
            squares: Array(9).fill(null)
            }
        ],
        stepNumber: 0,
        xIsNext: true
        };
    }

    /**
     * Handler for when the board is clicked
     * @param i the index of square clicked
     */
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // Prevent board state change if there is a winner
        if(calculateWinner(squares) || squares[i]){
            return;
        }

        // Determine who goes next
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        // Set the state of the array
        this.setState({
            history: history.concat([{
                squares: squares
              }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
    
    /**
     * Handler for when a user clicks a jump button
     * Sets the state to the mapped state
     * @param step  step number
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        // Create some local scope variables
        // Track the history of states, the current state, and winner state
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // Move the move number to a past state
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                // Render a button to press
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        // Given winner state, display current state of turn
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
