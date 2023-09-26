import React from "react";

class KeyboardButton extends React.Component {
  constructor(props) {
    super(props);

    // if button was clicked, trigger response
    const { clicking, onClick, value } = this.props;
    if (clicking)
      onClick(value);
  }

  render() {
    const { onClick, value, classes } = this.props;

    return (
      <button
        className={`keyboard-button ${classes || ''}`}
        type="button"
        onClick={() => onClick(value)}
      >
        {value}
      </button>
    );
  }
}

export default KeyboardButton;