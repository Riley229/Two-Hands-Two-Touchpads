import React from "react";
import { Forward, Backspace, KeyboardTab, PlayArrow, KeyboardReturn, KeyboardCapslock } from "@mui/icons-material";
import { io } from 'socket.io-client';

import "./Keyboard.css"

import KeyboardButton from "./KeyboardButton";
import SimplifiedLayout from "../data/SimplifiedLayout";
import StandardLayout from "../data/StandardLayout";

// setup websocket
const socket = io('http://localhost:10942', {
  extraHeaders: {
    ['client-type']: 'web-interface',
  },
});

class Keyboard extends React.Component {
  static simplifiedLayout = true;
  static numKeyRows = 5;

  constructor(props) {
    super(props);

    // bind events to this instance
    this.onCapsLock = this.onCapsLock.bind(this);
    this.onShiftClick = this.onShiftClick.bind(this);
    this.onBackspace = this.onBackspace.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onKeyClick = this.onKeyClick.bind(this);

    // set initial state
    this.state = {
      uppercase: false,
      capsLock: false,

      // x and y and [0, 100] distance from topleft corner of keyboard
      leftCursor: {
        x: 9.0,
        y: 30.0,
      },

      // x and y and [0, 100] distance from topleft corner of keyboard
      rightCursor: {
        x: 91.0,
        y: 30.0,
      }
    };

    // setup webhook listeners
    let self = this;
    socket.on('cursor-move', function (left, deltaX, deltaY) {
      if (left) {
        const { x, y } = this.state.leftCursor;
        const newX = Math.min(100, Math.max(0, x + deltaX));
        const newY = Math.min(100, Math.max(0, y + deltaY));

        this.setState({
          leftCursor: {
            x: newX,
            y: newY,
          },
        });
      } else {
        const { x, y } = this.state.rightCursor;
        const newX = Math.min(100, Math.max(0, x + deltaX));
        const newY = Math.min(100, Math.max(0, y + deltaY));

        this.setState({
          rightCursor: {
            x: newX,
            y: newY,
          },
        });
      }
    });

    socket.on('click', function (left) {
      if (left) {
        // TODO: implement
      } else {
        // TODO: implement
      }
    });
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

  calculateColumn(keys, posX) {
    // calculate default key width
    const keyWidth = 100 / (Keyboard.simplifiedLayout ? 11 : 14);

    // calculate number of stretch keys and space bars
    const stretchKeys = keys.filter((value) => !["*sp", "*l", "*r"].includes(value) && value.includes("*"));
    const spaceKeys = keys.filter((value) => value === "*sp");
    const normalKeys = keys.filter((value) => (!stretchKeys.includes(value)) && (!spaceKeys.includes(value)));

    // calculate the increments for stretch keys
    const stretchWidthSum = 100 - (normalKeys.length * keyWidth);
    const stretchWidthIncrement = stretchWidthSum / ((spaceKeys.length * 5) + stretchKeys.length); 

    // calculate key widths
    var widthSum = 0;
    const keyWidths = keys.map((value) => {
      var width = 0;

      if (normalKeys.includes(value)) {
        width = keyWidth;
      } else if (stretchKeys.includes(value)) {
        width = stretchWidthIncrement;
      } else if (spaceKeys.includes(value)) {
        width = stretchWidthIncrement * 5;
      }

      widthSum += width;
      return width;
    });

    // calculate key start positions
    var nextStartPos = (100 - widthSum) / 2
    const keyStarts = keyWidths.map((value) => {
      const startPos = nextStartPos;
      nextStartPos += value;

      return startPos;
    })
    keyStarts[0] = 0;

    // determine column number from start positions
    const column = keyStarts.filter((value) => (value < posX)).length - 1;
    return column;
  }

  render() {
    const { uppercase, capsLock, rightCursor, leftCursor } = this.state;
    const keys = this.getLayout();

    // calculate row information to determine currently selected rows
    const rowHeight = 100 / keys.length;
    const maxRowIndex = (100 / rowHeight) - 1;

    // calculate left cursor key position
    const leftRow = Math.min(Math.floor(leftCursor.y / rowHeight), maxRowIndex);
    const leftColumn = this.calculateColumn(keys[leftRow], leftCursor.x);

    console.log(`left: (${leftRow}, ${leftColumn})`)

    // calculate right cursor key position
    const rightRow = Math.min(Math.floor(rightCursor.y / rowHeight), maxRowIndex);
    const rightColumn = this.calculateColumn(keys[rightRow], rightCursor.x);

    console.log(`right: (${rightRow}, ${rightColumn})`);

    return (
      <div className={`keyboard ${Keyboard.simplifiedLayout ? 'simplified-keyboard' : 'standard-keyboard'}`}>
        {keys.map((row, i) => {
          var shiftRow = false;
          if (row.includes("*sh"))
            shiftRow = true;

          return <div className={`keyboard-row ${shiftRow ? 'shift-row' : ''}`}>
            {row.map((button, j) => {
              var selectedClass = "";
              if (i === leftRow && j === leftColumn)
                selectedClass = "left-hover";
              if (i === rightRow && j === rightColumn)
                selectedClass = "right-hover"

              switch (button.toLowerCase()) {
                case "*bs":
                  return <KeyboardButton
                    value={<Backspace />}
                    onClick={this.onBackspace}
                    classes={`stretch-key control-key ${selectedClass}`}
                  />;
                case "*sh":
                  return <KeyboardButton
                    value={<Forward className="shift-icon" />}
                    onClick={this.onShiftClick}
                    classes={`stretch-key control-key ${selectedClass}`}
                  />;
                case "*sp":
                  return <KeyboardButton
                    value=""
                    onClick={() => this.onKeyClick(" ")}
                    classes={`space-bar ${selectedClass}`}
                  />;
                case "*tb":
                  return <KeyboardButton
                    value={<KeyboardTab />}
                    onClick={() => this.onKeyClick("\t")}
                    classes={`stretch-key control-key ${selectedClass}`}
                  />;
                case "*cps":
                  return <KeyboardButton
                    value={<KeyboardCapslock />}
                    onClick={this.onCapsLock}
                    classes={`stretch-key control-key ${selectedClass}`}
                  />;
                case "*e":
                  return <KeyboardButton
                    value={<KeyboardReturn />}
                    onClick={this.onEnter}
                    classes={`stretch-key control-key ${selectedClass}`}
                  />;
                case "\\":
                  return <KeyboardButton
                    value="\"
                    onClick={this.onKeyClick}
                    classes={`stretch-key ${selectedClass}`}
                  />;
                case "*l":
                  return <KeyboardButton
                    value={<PlayArrow className="left-arrow-icon" />}
                    onClick={() => this.onNavigate(true)}
                    classes={`control-key ${selectedClass}`}
                  />;
                case "*r":
                  return <KeyboardButton
                    value={<PlayArrow className="right-arrow-icon" />}
                    onClick={() => this.onNavigate(false)}
                    classes={`control-key ${selectedClass}`}
                  />;
                default:
                  const value = (uppercase || capsLock) ? button.toUpperCase() : button.toLowerCase();
                  return <KeyboardButton
                    value={value}
                    onClick={this.onKeyClick}
                    classes={selectedClass}
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