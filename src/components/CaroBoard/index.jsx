import PropTypes from 'prop-types';
import React from 'react';
import { GAME_BOARD, PLAYERS } from '../../constants';
import './style.scss';

CaroBoard.propTypes = {
  data: PropTypes.array,
  onClick: PropTypes.func.isRequired,
};

CaroBoard.defaultProps = {
  data: [],
};

function CaroBoard({ data, onClick }) {
  return (
    <div className="caro-board">
      <div
        className="caro-board__container"
        style={{ gridTemplateColumns: `repeat(${GAME_BOARD.COLUMNS}, auto)` }}
      >
        {data.map((row, rowIdx) =>
          row.map((col, colIdx) => (
            <span
              key={colIdx}
              className={`caro-board__item ${
                col === PLAYERS.X_PLAYER ? 'is-x' : ''
              } ${col === PLAYERS.O_PLAYER ? 'is-o' : ''}`}
              onClick={() => onClick(rowIdx, colIdx)}
            >
              {col}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default CaroBoard;
