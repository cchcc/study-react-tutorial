import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
  return [];
}

function Square(props) {
  return (
    <button className="square" 
              onClick={props.onClick}
              style={props.style}
              >
        {props.value}
      </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    
    let style = {}
    if (this.props.winSquares && this.props.winSquares.indexOf(i) > -1)
      style = {color:'#00f'}

    return <Square key={i} 
                   value={this.props.squares[i]} 
                   onClick={() => this.props.onClick(i)}
                   style={style}
           />;
  }

  render() {
    const rowSize = 3;
    const colSize = 3;

    const rows = [];
    for (let ri = 0; ri < rowSize; ++ri) {
      const squares = [];
      for (let ci = 0; ci < colSize; ++ci)
        squares.push(this.renderSquare(ri*rowSize + ci))
      
      rows.push(<div key={ri} className="board-row">{squares}</div>)
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      historyIdx: [], 
      xIsNext: true,
      step: 0,
      sortByAsc: true,
    }
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.step+1);
    const historyIdx = this.state.historyIdx.slice(0, this.state.step);
    const current = history[history.length - 1];
    const squares = current.squares.slice()

    const [winner] = calculateWinner(current.squares);
    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({ 
      history: history.concat([{
        squares: squares,
      }]),
      historyIdx: historyIdx.concat(i),
      xIsNext: !this.state.xIsNext,
      step: history.length,
    })
  }

  jumpTo(move) {
    this.setState({
      step: move,
      xIsNext: (move % 2) === 0,
    });
  }

  handleClickSort() {
    this.setState({
      sortByAsc: !this.state.sortByAsc,
    });
  }

  render() {
    const history = this.state.history;
    const historyIdx = this.state.historyIdx;
    const current = history[this.state.step];
    const [winner, winSquares] = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (this.state.step == 9)
        status = 'Draw Game'
      else  
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const col = historyIdx[move-1] % 3 + 1
      const row = Math.floor(historyIdx[move-1] / 3) + 1

      const desc = move ?
        ('Go to move #' + move + '(' + row + ',' + col + ')'):
        'Go to game start';

      let style = (this.state.step === move) ? {fontWeight: 'bold'} : {};
        
      return(
        <li key={move}>
          <button style={style} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
      
    });

    if (!this.state.sortByAsc)
      moves.reverse()

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winSquares={winSquares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleClickSort()}>Sort by {this.state.sortByAsc ? 'Asc' : 'Desc'}</button>
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
