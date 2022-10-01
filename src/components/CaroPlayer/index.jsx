import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';

CaroPlayer.propTypes = {
  playerType: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

CaroPlayer.defaultProps = {
  placeholder: '',
};

function CaroPlayer(props) {
  const { playerType, playerName, onChange, placeholder } = props;

  return (
    <div className="caro-player">
      <label className="caro-player__type">{playerType}</label>
      <input
        className="caro-player__name"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={playerName}
      />
    </div>
  );
}

export default CaroPlayer;
