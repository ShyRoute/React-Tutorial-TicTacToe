import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {		
    renderSquare(i) {
		const isWinnerIdx = this.props.winnerIdx && this.props.winnerIdx.indexOf(i) !== -1;
        return (
			<Square
				value={this.props.squares[i]} 
				onClick={() => this.props.onClick(i)}
				style={isWinnerIdx ? {backgroundColor:'deepskyblue'} : {}}
			/>
		);
    }
	
	renderTable = () => {
		var table = [];
		
		for(let i = 0; i < 3; ++i) {
			var tmp = [];
			for(let j = 0; j < 3; ++j) {
				tmp.push(this.renderSquare(i*3+j));
			}
			table.push(<div className="board-row">{tmp}</div>);
		}
	
		return table;
	}

    render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		);
    }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				pos: {
					x: null,
					y: null,
				},
			}],
			stepNumber: 0,
			xIsNext: true,
			isAscending: true,
		};
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				pos: {
					row: Math.floor(i / 3),
					col: i % 3,
				}
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}
	
	toggleAsc() {
		this.setState({
			isAscending: !this.state.isAscending,
		});
	}
	
    render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const result = calculateWinner(current.squares);
		
		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move + ' (' + step.pos.row + ', ' + step.pos.col + ')' :
				'Go to game start';
			return (
				<li key={move}>
					<button
						onClick={() => this.jumpTo(move)}
						style={this.state.stepNumber === move ? {fontWeight:'bold'} : {}}
					>{desc}</button>
				</li>
			);
		});
		
		const isAscending = this.state.isAscending;
		if(!isAscending) {
			moves.reverse();
		}
		
		let status;
		let winnerIdx;

		if(result !== null) {
			status = 'Winner: ' + result.winner;
			winnerIdx = result.winnerIdx;
		}
		else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
						winnerIdx={winnerIdx}
					/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
					<button onClick={() => this.toggleAsc()}>
						{this.state.isAscending ? "Ascending" : "Descending"}
					</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
				winner: squares[a],
				winnerIdx: [a, b, c],
			};
        }
    }
    return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
