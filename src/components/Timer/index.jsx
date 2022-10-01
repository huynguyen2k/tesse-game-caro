import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import { convertSecondsToMinutesAndSeconds } from '../../utils';

Timer.propTypes = {
  value: PropTypes.number.isRequired,
};

function Timer({ value }) {
  return (
    <div className="timer">
      <h3 className="timer__value">
        {convertSecondsToMinutesAndSeconds(value)}
      </h3>
    </div>
  );
}

export default Timer;
