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

	constructor(){
		super();
		this.state = {
			squaresValues: Array(9).fill(null),
			xIsNext: true
		}
	}

	defineNextPlayer(){
		return this.state.xIsNext ? 'X' : 'O';
	}

	updateSquareValue(elementPosition) {
		const newSquareList = this.state.squaresValues.slice();

		if (CalculateWinner(newSquareList)) {
      return;
		}

		newSquareList[elementPosition] = this.defineNextPlayer();
		this.setState({ squaresValues: newSquareList, xIsNext: !this.state.xIsNext });
	}

  renderSquare(elementPosition) {
		return <Square
			value={this.state.squaresValues[elementPosition]}
			onClick={() => this.updateSquareValue(elementPosition)}
		/>;
  }

  render() {
		const winner = CalculateWinner(this.state.squaresValues);
		const status = winner ? `Winner: ${winner}` : `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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


//https://pt-br.reactjs.org/docs/optimizing-performance.html#examples

