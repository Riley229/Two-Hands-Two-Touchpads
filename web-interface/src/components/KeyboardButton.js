import React from "react";

class KeyboardButton extends React.Component {
  onClick() {
    const { onClick, value } = this.props;

    if (typeof(onClick) !== 'undefined')
      onClick(value);
  }

  render() {
    const { value } = this.props;

    return (
      <button
        type="button"
        onClick={this.onClick}
      >
        {value}
      </button>
    );
  }
}

export default KeyboardButton;