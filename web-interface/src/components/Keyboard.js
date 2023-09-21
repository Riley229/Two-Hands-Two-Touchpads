import React from "react";
import KeyboardButton from "./KeyboardButton";
import keyboardLayout from "../data/KeyboardLayout";
import BackspaceIcon from "./icons/BackspaceIcon";
import ShiftIcon from "./icons/ShiftIcon";

class Keyboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uppercase: false,
    };
  }

  onShiftClick() {
    const { uppercase } = this.state;

    this.setState({
      uppercase: !uppercase,
    });
  }

  render() {
    const { uppercase } = this.state;
    const keys = keyboardLayout;

    return (
      <div>
        {keys.map((row, i) =>
          <div>
            {row.map((button, j) => {
              switch (button.toLowerCase()) {
                case "*bs":
                  return <KeyboardButton 
                    value={<BackspaceIcon />}
                    onClick={() => true}
                  />;
                case "*sh":
                  return <KeyboardButton 
                    value={<ShiftIcon />}
                    onClick={() => this.onShiftClick()}
                  />;
                default:
                  const value = uppercase ? button.toUpperCase() : button.toLowerCase();
                  return <KeyboardButton
                    value={value}
                    onClick={() => true}
                  />
              }
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Keyboard;