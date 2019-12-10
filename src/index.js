import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={ props.onClick }
		>
			{ props.value }
		</button>
	);
}

function CalculateWinner(boardSquares){
	const markedCombinationsToGaveVictory = [
		[0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
	];

	for(const combination of markedCombinationsToGaveVictory)	{
		const [a, b, c] = combination;
    if (boardSquares[a] && boardSquares[a] === boardSquares[b] && boardSquares[a] === boardSquares[c]) {
      return boardSquares[a];
    }
	}

	return null;
}

class Board extends React.Component {

  renderSquare(elementPosition) {
		return <Square
			value={this.props.squaresValues[elementPosition]}
			onClick={() => this.props.onClick(elementPosition)}
		/>;
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
      history: [{
        squaresValues: Array(9).fill(null),
      }],
			stepNumber: 0,
			xIsNext: true,
    };
	}

	jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
	}

	definePlayerMove(){
		return this.state.xIsNext ? 'X' : 'O';
	}

	updateSquareValue(elementPosition) {
		const gameHistory = this.state.history.slice(0, this.state.stepNumber + 1); //certifica que se nós “voltarmos no tempo”, e então fizermos uma nova jogada a partir daquele ponto, descartamos todo o histórico do “futuro” que agora se tornaria incorreto.
		const currentGame = gameHistory[this.state.stepNumber];
		const newSquareList = currentGame.squaresValues.slice();

		if (CalculateWinner(newSquareList)) {
      return;
		}

		newSquareList[elementPosition] = this.definePlayerMove();
		this.setState({
			history: gameHistory.concat([{ squaresValues: newSquareList }]),
			stepNumber: gameHistory.length,
			xIsNext: !this.state.xIsNext
		});
	}

	render() {
		const currentGame = this.state.history[this.state.history.length - 1];
		const winner = CalculateWinner(currentGame.squaresValues);
		const status = winner ? `Winner: ${winner}` : `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
		const gameMoves = this.state.history.map((step, move) => {
			const desc = move ?
			'Go to move #' + move :
			'Go to game start';
			return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}>{desc}</button>
					</li>
				);
		});

    return (
      <div className="game">
        <div className="game-board">
          <Board
						squaresValues={currentGame.squaresValues}
						onClick={(elementPosition) => this.updateSquareValue(elementPosition)}
					/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{gameMoves}</ol>
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

Square.propTypes = {
	value: PropTypes.string,
	onClick: PropTypes.func.isRequired
};

Board.propTypes = {
	squaresValues: PropTypes.arrayOf(PropTypes.string),
	onClick: PropTypes.func.isRequired
}


//https://pt-br.reactjs.org/docs/optimizing-performance.html#examples

