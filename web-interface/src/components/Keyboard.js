import React from "react";
import KeyboardButton from "./KeyboardButton";
import keyboardLayout from "../data/KeyboardLayout";

class Keyboard extends React.Component {
  render() {
    const keys = keyboardLayout;

    return (
      <div>
        {keys.map((row, i) =>
          <div>
            {row.map((button, j) =>
              <KeyboardButton
                value={button}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Keyboard;