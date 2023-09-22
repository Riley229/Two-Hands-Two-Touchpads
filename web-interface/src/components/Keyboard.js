import React from "react";
import { KeyboardBackspace, ArrowUpward, KeyboardTab, KeyboardArrowLeft, KeyboardArrowRight, SubdirectoryArrowLeft } from "@mui/icons-material";

import "./Keyboard.css"

import KeyboardButton from "./KeyboardButton";
import keyboardLayout from "../data/KeyboardLayout";

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
      <div className="keyboard">
        {keys.map((row, i) => {
          var shiftRow = false;
          if (row.includes("*sh"))
            shiftRow = true;

          return <div className={`keyboard-row ${shiftRow ? 'shift-row' : ''}`}>
            {row.map((button, j) => {
              switch (button.toLowerCase()) {
                case "*bs":
                  return <KeyboardButton 
                    value={<KeyboardBackspace />}
                    onClick={() => true}
                    classes="fill-key"
                  />;
                case "*sh":
                  return <KeyboardButton 
                    value={<ArrowUpward />}
                    onClick={() => this.onShiftClick()}
                    classes="fill-key"
                  />;
                case "*sp":
                  return <KeyboardButton
                    value=""
                    onClick={() => true}
                    classes="fill-key"
                  />;
                case "*tb":
                  return <KeyboardButton 
                    value={<KeyboardTab />}
                    onClick={() => true}
                    classes="fill-key"
                  />;
                case "*cps":
                  return <KeyboardButton 
                    value="CAPS"
                    onClick={() => true}
                    classes="fill-key"
                  />;
                case "*e":
                  return <KeyboardButton 
                    value={<SubdirectoryArrowLeft />}
                    onClick={() => true}
                    classes="fill-key"
                  />;
                case "\\":
                  return <KeyboardButton
                    value="\"
                    onClick={() => true}
                    classes="fill-key"
                  />;
                case "*l":
                  return <KeyboardButton 
                    value={<KeyboardArrowLeft />}
                    onClick={() => true}
                  />;
                case "*r":
                  return <KeyboardButton 
                    value={<KeyboardArrowRight />}
                    onClick={() => true}
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
        })}
      </div>
    );
  }
}

export default Keyboard;