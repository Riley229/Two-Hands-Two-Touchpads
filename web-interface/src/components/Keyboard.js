import React from "react";
import { Forward, Backspace, KeyboardTab, PlayArrow, KeyboardReturn, KeyboardCapslock } from "@mui/icons-material";

import "./Keyboard.css"

import KeyboardButton from "./KeyboardButton";
import SimplifiedLayout from "../data/SimplifiedLayout";
import StandardLayout from "../data/StandardLayout";

class Keyboard extends React.Component {
  static simplifiedLayout = true;

  constructor(props) {
    super(props);
    this.onCapsLock = this.onCapsLock.bind(this);
    this.onShiftClick = this.onShiftClick.bind(this);
    this.onBackspace = this.onBackspace.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onKeyClick = this.onKeyClick.bind(this);

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
    const { inputHandler } = this.props;
    inputHandler.removeCharacter();
  }

  onEnter() {
    const { inputHandler } = this.props;
    inputHandler.enterPressed();
  }

  onNavigate(left) {
    const { inputHandler } = this.props;
    inputHandler.moveCursor(left);
  }

  onKeyClick(key) {
    const { inputHandler } = this.props;
    const { uppercase } = this.state;

    inputHandler.placeCharacter(key);

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
                    value={<Backspace />}
                    onClick={this.onBackspace}
                    classes="stretch-key control-key"
                  />;
                case "*sh":
                  return <KeyboardButton 
                    value={<Forward className="shift-icon" />}
                    onClick={this.onShiftClick}
                    classes="stretch-key control-key"
                  />;
                case "*sp":
                  return <KeyboardButton
                    value=""
                    onClick={() => this.onKeyClick(" ")}
                    classes="space-bar"
                  />;
                case "*tb":
                  return <KeyboardButton 
                    value={<KeyboardTab />}
                    onClick={() => this.onKeyClick("\t")}
                    classes="stretch-key control-key"
                  />;
                case "*cps":
                  return <KeyboardButton 
                    value={<KeyboardCapslock />}
                    onClick={this.onCapsLock}
                    classes="stretch-key control-key"
                  />;
                case "*e":
                  return <KeyboardButton 
                    value={<KeyboardReturn />}
                    onClick={this.onEnter}
                    classes="stretch-key control-key"
                  />;
                case "\\":
                  return <KeyboardButton
                    value="\"
                    onClick={this.onKeyClick}
                    classes="stretch-key"
                  />;
                case "*l":
                  return <KeyboardButton 
                    value={<PlayArrow className="left-arrow-icon" />}
                    onClick={() => this.onNavigate(true)}
                    classes="control-key"
                  />;
                case "*r":
                  return <KeyboardButton 
                    value={<PlayArrow className="right-arrow-icon" />}
                    onClick={() => this.onNavigate(false)}
                    classes="control-key"
                  />;
                default:
                  const value = (uppercase || capsLock) ? button.toUpperCase() : button.toLowerCase();
                  return <KeyboardButton
                    value={value}
                    onClick={this.onKeyClick}
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