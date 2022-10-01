import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { GAME_BOARD, GAME_STATUS, TIMEOUT, PLAYERS } from '../../constants';
import {
  convertSecondsToMinutesAndSeconds,
  initCaroBoardData,
} from '../../utils';
import CaroBoard from '../CaroBoard';
import CaroPlayer from '../CaroPlayer';
import Timer from '../Timer';
import './style.scss';

function CaroApp() {
  const intervalId = useRef(null);
  const selectValue = useRef(PLAYERS.X_PLAYER);

  const [seconds, setSeconds] = useState(0);

  const [boardData, setBoardData] = useState(initCaroBoardData);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.WAITING);
  const [gameResult, setGameResult] = useState({
    timeToPlay: 0,
    message: '',
  });

  const [xPlayer, setXPlayer] = useState({ type: PLAYERS.X_PLAYER, name: '' });
  const [oPlayer, setOPlayer] = useState({ type: PLAYERS.O_PLAYER, name: '' });

  const disabledStartBtn = !xPlayer.name || !oPlayer.name;

  const handleStartGameClick = () => {
    setGameStatus(GAME_STATUS.STARTING);

    intervalId.current = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
  };

  const handlePlayAgainClick = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    intervalId.current = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);

    selectValue.current = PLAYERS.X_PLAYER;
    setSeconds(0);
    setBoardData(initCaroBoardData());
    setGameStatus(GAME_STATUS.STARTING);
    setGameResult({
      timeToPlay: 0,
      message: '',
    });
  };

  const handleGameResult = useCallback(
    userType => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }

      let message = '';
      if (userType === null) {
        message = '2 người chơi hòa nhau!';
      } else if (userType === xPlayer.type) {
        message = `${xPlayer.name} đã giành chiến thắng!`;
      } else {
        message = `${oPlayer.name} đã giành chiến thắng!`;
      }

      setGameStatus(GAME_STATUS.OVER);
      setGameResult({
        message,
        timeToPlay: seconds,
      });
    },
    [seconds, xPlayer, oPlayer]
  );

  const handleCaroBoardClick = (rowIdx, colIdx) => {
    if (boardData[rowIdx][colIdx] || gameStatus !== GAME_STATUS.STARTING)
      return;

    const currentValue = selectValue.current;

    if (currentValue === PLAYERS.X_PLAYER) {
      selectValue.current = PLAYERS.O_PLAYER;
    } else {
      selectValue.current = PLAYERS.X_PLAYER;
    }

    const newBoardData = [...boardData];
    newBoardData[rowIdx][colIdx] = currentValue;
    setBoardData(newBoardData);

    // check rows
    let count = 1;
    let isBlockStart = false;
    let isBlockEnd = false;

    for (let i = 1; i <= 5; i++) {
      const idx = colIdx - i;
      if (idx < 0 || newBoardData[rowIdx][idx] === '') break;
      if (newBoardData[rowIdx][idx] !== currentValue) {
        isBlockStart = true;
        break;
      }
      count++;
    }

    for (let i = 1; i <= 5; i++) {
      const idx = colIdx + i;
      if (idx >= GAME_BOARD.COLUMNS || newBoardData[rowIdx][idx] === '') break;
      if (newBoardData[rowIdx][idx] !== currentValue) {
        isBlockEnd = true;
        break;
      }
      count++;
    }

    if (count === 5 && !(isBlockStart && isBlockEnd)) {
      handleGameResult(currentValue);
    }

    // check columns
    count = 1;
    isBlockStart = false;
    isBlockEnd = false;

    for (let i = 1; i <= 5; i++) {
      const idx = rowIdx - i;
      if (idx < 0 || newBoardData[idx][colIdx] === '') break;
      if (newBoardData[idx][colIdx] !== currentValue) {
        isBlockStart = true;
        break;
      }
      count++;
    }

    for (let i = 1; i <= 5; i++) {
      const idx = rowIdx + i;
      if (idx >= GAME_BOARD.ROWS || newBoardData[idx][colIdx] === '') break;
      if (newBoardData[idx][colIdx] !== currentValue) {
        isBlockEnd = true;
        break;
      }
      count++;
    }

    if (count === 5 && !(isBlockStart && isBlockEnd)) {
      handleGameResult(currentValue);
    }

    // check diagonal (left-right)
    count = 1;
    isBlockStart = false;
    isBlockEnd = false;

    for (let i = 1; i <= 5; i++) {
      const rIdx = rowIdx - i;
      const cIdx = colIdx - i;

      if (rIdx < 0 || cIdx < 0 || newBoardData[rIdx][cIdx] === '') break;
      if (newBoardData[rIdx][cIdx] !== currentValue) {
        isBlockStart = true;
        break;
      }
      count++;
    }

    for (let i = 1; i <= 5; i++) {
      const rIdx = rowIdx + i;
      const cIdx = colIdx + i;

      if (
        rIdx >= GAME_BOARD.ROWS ||
        cIdx >= GAME_BOARD.COLUMNS ||
        newBoardData[rIdx][cIdx] === ''
      )
        break;
      if (newBoardData[rIdx][cIdx] !== currentValue) {
        isBlockEnd = true;
        break;
      }
      count++;
    }

    if (count === 5 && !(isBlockStart && isBlockEnd)) {
      handleGameResult(currentValue);
    }

    // check diagonal (right-left)
    count = 1;
    isBlockStart = false;
    isBlockEnd = false;

    for (let i = 1; i <= 5; i++) {
      const rIdx = rowIdx - i;
      const cIdx = colIdx + i;

      if (
        rIdx < 0 ||
        cIdx >= GAME_BOARD.COLUMNS ||
        newBoardData[rIdx][cIdx] === ''
      )
        break;
      if (newBoardData[rIdx][cIdx] !== currentValue) {
        isBlockStart = true;
        break;
      }
      count++;
    }

    for (let i = 1; i <= 5; i++) {
      const rIdx = rowIdx + i;
      const cIdx = colIdx - i;

      if (
        rIdx >= GAME_BOARD.ROWS ||
        cIdx < 0 ||
        newBoardData[rIdx][cIdx] === ''
      )
        break;
      if (newBoardData[rIdx][cIdx] !== currentValue) {
        isBlockEnd = true;
        break;
      }
      count++;
    }

    if (count === 5 && !(isBlockStart && isBlockEnd)) {
      handleGameResult(currentValue);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (seconds >= TIMEOUT) {
      handleGameResult(null);
    }
  }, [seconds, handleGameResult]);

  useEffect(() => {
    if (gameStatus === GAME_STATUS.OVER) {
      const message = (
        <div>
          <h4>{gameResult.message}</h4>
          <span>
            thời gian chơi:{' '}
            {convertSecondsToMinutesAndSeconds(gameResult.timeToPlay)}
          </span>
        </div>
      );

      toast.success(message);
    }
  }, [gameStatus, gameResult]);

  return (
    <div className="caro-app">
      <div className="caro-app__container">
        <div className="caro-app__side-bar">
          <h1 className="caro-app__title">Game Caro</h1>

          <div className="caro-app__players">
            <CaroPlayer
              playerType={xPlayer.type}
              playerName={xPlayer.name}
              onChange={event =>
                setXPlayer({ ...xPlayer, name: event.target.value })
              }
              placeholder="Nhập tên người chơi"
            />

            <CaroPlayer
              playerType={oPlayer.type}
              playerName={oPlayer.name}
              onChange={event =>
                setOPlayer({ ...oPlayer, name: event.target.value })
              }
              placeholder="Nhập tên người chơi"
            />
          </div>

          <div className="caro-app__timer">
            <Timer value={seconds} />
          </div>

          {gameStatus === GAME_STATUS.WAITING ? (
            <div className="caro-app__start-btn">
              <button
                className={`${disabledStartBtn ? 'disabled' : ''}`}
                onClick={handleStartGameClick}
              >
                Bắt đầu
              </button>
            </div>
          ) : (
            <div className="caro-app__play-again-btn">
              <button onClick={handlePlayAgainClick}>Chơi lại</button>
            </div>
          )}
        </div>

        <div className="caro-app__main">
          <CaroBoard data={boardData} onClick={handleCaroBoardClick} />
        </div>
      </div>
    </div>
  );
}

export default CaroApp;
