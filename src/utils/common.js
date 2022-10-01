import { GAME_BOARD } from '../constants';

// max seconds to convert is 20 minutes
export function convertSecondsToMinutesAndSeconds(seconds) {
  if (seconds < 0 || seconds >= 6000) return '';

  const min = `0${Math.floor(seconds / 60)}`.slice(-2);
  const sec = `0${seconds % 60}`.slice(-2);

  return `${min}:${sec}`;
}

export function initCaroBoardData(n = GAME_BOARD.ROWS, m = GAME_BOARD.COLUMNS) {
  const data = [];

  for (let i = 0; i < n; i++) {
    const row = [];

    for (let j = 0; j < m; j++) {
      row.push('');
    }

    data.push(row);
  }

  return data;
}
