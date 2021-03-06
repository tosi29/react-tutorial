import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let className = "square"
  if (props.highlight) {
    className += " highlight"
  }
  
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function OrderToggleButton(props) {
  return (
    <button onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]} 
        key={i}
        onClick={() => this.props.onClick(i)}
        highlight={(this.props.highlight && this.props.highlight.includes(i)) ? true : false }
      />
    );
  }

  render() {
    const rows = Array(3);
    for (let i of [0, 1, 2]) {
      const items = Array(3);
      for (let j of [0, 1, 2]) {
        items[j] = this.renderSquare(i*3+j);
      }
      rows[i] = (
        <div className="board-row" key={i}>
          {items}
        </div>
      )
    }

    return (
      <div>
        {rows}
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
        action: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      orderByAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        action: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleOrderClick() {
    this.setState({
      orderByAsc: !this.state.orderByAsc,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winLine] = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move ?
        'Go to move #' + move + ", (" + (step.action%3+1) + "," + (Math.floor(step.action/3)+1)+  ")" :
        'Go to game start';
      if (step === current) {
        desc = <strong>{desc}</strong>;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber == 9) {
      status = 'Draw...'
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const order = this.state.orderByAsc ? 'Asc' : 'Desc';

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlight={winLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <OrderToggleButton 
            value={order}
            onClick={() => this.handleOrderClick()}
          />
          <ol>{this.state.orderByAsc ? moves : moves.reverse()}</ol>
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
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
