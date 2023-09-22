import React from "react";
import { KeyboardBackspace, ArrowUpward, KeyboardTab, KeyboardArrowLeft, KeyboardArrowRight, SubdirectoryArrowLeft } from "@mui/icons-material";

import "./Keyboard.css"

import KeyboardButton from "./KeyboardButton";
import SimplifiedLayout from "../data/SimplifiedLayout";
import StandardLayout from "../data/StandardLayout";

class Keyboard extends React.Component {
  static simplifiedLayout = true;

  constructor(props) {
    super(props);

    this.state = {
      uppercase: false,
      capsLock: false,
    };
  }

  getLayout() {
    if (Keyboard.simplifiedLayout)
      return SimplifiedLayout;
    else
      return StandardLayout;
  }

  onCapsLock() {
    const { capsLock } = this.state;

    this.setState({
      capsLock: !capsLock,
    });
  }

  onShiftClick() {
    const { uppercase } = this.state;

    this.setState({
      uppercase: !uppercase,
    });
  }

  onBackspace() {
    // TODO: implement
  }

  onEnter() {
    // TODO: implement
  }

  onNavigate(left) {
    // TODO: implement
  }

  onKeyClick(key) {
    const { uppercase } = this.state;

    // TODO: implement

    if (uppercase) 
      this.setState({
        uppercase: false,
      });
  }

  render() {
    const { uppercase, capsLock } = this.state;
    const keys = this.getLayout();

    return (
      <div className={`keyboard ${Keyboard.simplifiedLayout ? 'simplified-keyboard' : 'standard-keyboard'}`}>
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
                    onClick={() => this.onBackspace()}
                    classes="stretch-key control-key"
                  />;
                case "*sh":
                  return <KeyboardButton 
                    value={<ArrowUpward />}
                    onClick={() => this.onShiftClick()}
                    classes="stretch-key control-key"
                  />;
                case "*sp":
                  return <KeyboardButton
                    value=""
                    onClick={() => this.onKeyClick(" ")}
                    classes="stretch-key"
                  />;
                case "*tb":
                  return <KeyboardButton 
                    value={<KeyboardTab />}
                    onClick={() => this.onKeyClick("\t")}
                    classes="stretch-key control-key"
                  />;
                case "*cps":
                  return <KeyboardButton 
                    value="CAPS"
                    onClick={() => this.onCapsLock()}
                    classes="stretch-key control-key"
                  />;
                case "*e":
                  return <KeyboardButton 
                    value={<SubdirectoryArrowLeft />}
                    onClick={() => this.onEnter()}
                    classes="stretch-key control-key"
                  />;
                case "\\":
                  return <KeyboardButton
                    value="\"
                    onClick={() => this.onKeyClick(value)}
                    classes="stretch-key"
                  />;
                case "*l":
                  return <KeyboardButton 
                    value={<KeyboardArrowLeft />}
                    onClick={() => this.onNavigate(true)}
                    classes="control-key"
                  />;
                case "*r":
                  return <KeyboardButton 
                    value={<KeyboardArrowRight />}
                    onClick={() => this.onNavigate(false)}
                    classes="control-key"
                  />;
                default:
                  const value = (uppercase || capsLock) ? button.toUpperCase() : button.toLowerCase();
                  return <KeyboardButton
                    value={value}
                    onClick={() => this.onKeyClick(value)}
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