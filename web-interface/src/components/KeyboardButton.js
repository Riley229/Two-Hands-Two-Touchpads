import React from "react";

class KeyboardButton extends React.Component {
  render() {
    const { onClick, value } = this.props;

    return (
      <button
        type="button"
        onClick={() => onClick(value)}
      >
        {value}
      </button>
    );
  }
}

export default KeyboardButton;