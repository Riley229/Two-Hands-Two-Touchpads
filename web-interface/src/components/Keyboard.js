import React from "react";
import { Forward, Backspace, KeyboardTab, PlayArrow, KeyboardCapslock, Search } from "@mui/icons-material";

import "./Keyboard.css"

import KeyboardButton from "./KeyboardButton";
import SimplifiedLayout from "../data/SimplifiedLayout";
import StandardLayout from "../data/StandardLayout";

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
        click: false,
      },

      // x and y and [0, 100] distance from topleft corner of keyboard
      rightCursor: {
        x: 91.0,
        y: 30.0,
        click: false,
      },
    };

    // setup webhook listeners
    const { socket } = this.props;
    let self = this;
    socket.on('cursor-move', function (left, deltaX, deltaY) {
      if (left) {
        const { x, y } = self.state.leftCursor;
        const newX = Math.min(100, Math.max(0, x + deltaX));
        const newY = Math.min(100, Math.max(0, y + deltaY));

        self.setState({
          leftCursor: {
            x: newX,
            y: newY,
            click: false,
          },
        });
      } else {
        const { x, y } = self.state.rightCursor;
        const newX = Math.min(100, Math.max(0, x + deltaX));
        const newY = Math.min(100, Math.max(0, y + deltaY));

        self.setState({
          rightCursor: {
            x: newX,
            y: newY,
            click: false,
          },
        });
      }
    });

    socket.on('cursor-set', function (left, posX, posY) {
      const newX = Math.min(100, Math.max(0, posX));
      const newY = Math.min(100, Math.max(0, posY));

      if (left) {
        self.setState({
          leftCursor: {
            x: newX,
            y: newY,
            click: false,
          },
        });
      } else {
        self.setState({
          rightCursor: {
            x: newX,
            y: newY,
            click: false,
          },
        });
      }
    });

    socket.on('click', function (left) {
      if (left) {
        const { x, y } = self.state.leftCursor;

        self.setState({
          leftCursor: {
            x: x,
            y: y,
            click: true,
          },
        });
      } else {
        const { x, y } = self.state.rightCursor;

        self.setState({
          rightCursor: {
            x: x,
            y: y,
            click: true,
          },
        });
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
    const { removeCharacter } = this.props;
    removeCharacter();
  }

  onEnter() {
    const { enterPressed } = this.props;
    enterPressed();
  }

  onNavigate(left) {
    const { moveCursor } = this.props;
    moveCursor(left);
  }

  onKeyClick(key) {
    const { placeCharacter } = this.props;
    const { uppercase } = this.state;

    placeCharacter(key);

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
    const stretchWidthIncrement = stretchWidthSum / ((spaceKeys.length * 3) + stretchKeys.length);

    // calculate key widths
    var widthSum = 0;
    const keyWidths = keys.map((value) => {
      var width = 0;

      if (normalKeys.includes(value)) {
        width = keyWidth;
      } else if (stretchKeys.includes(value)) {
        width = stretchWidthIncrement;
      } else if (spaceKeys.includes(value)) {
        width = stretchWidthIncrement * 3;
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
    const { singleInputMode } = this.props;
    const keys = this.getLayout();

    // calculate row information to determine currently selected rows
    const rowHeight = 100 / keys.length;
    const maxRowIndex = (100 / rowHeight) - 1;

    // calculate left cursor key position
    const leftRow = Math.min(Math.floor(leftCursor.y / rowHeight), maxRowIndex);
    const leftColumn = this.calculateColumn(keys[leftRow], leftCursor.x);

    // calculate right cursor key position
    const rightRow = Math.min(Math.floor(rightCursor.y / rowHeight), maxRowIndex);
    const rightColumn = this.calculateColumn(keys[rightRow], rightCursor.x);

    // create return value
    const value = (
      <div className={`keyboard ${Keyboard.simplifiedLayout ? 'simplified-keyboard' : 'standard-keyboard'}`}>
        <div
          className='cursor left-cursor'
          style={{
            top: `calc(${leftCursor.y}% - 5px)`,
            left: `calc(${leftCursor.x}% - 5px)`,
          }}
        />

        {!singleInputMode &&
          <div
            className='cursor right-cursor'
            style={{
              top: `calc(${rightCursor.y}% - 5px)`,
              left: `calc(${rightCursor.x}% - 5px)`,
            }}
          />
        }

        {keys.map((row, i) => {
          var shiftRow = false;
          if (row.includes("*sh"))
            shiftRow = true;

          return <div className={`keyboard-row ${shiftRow ? 'shift-row' : ''}`}>
            {row.map((button, j) => {
              // determine if key is hovered
              var selectedClass = "";
              if (i === leftRow && j === leftColumn)
                selectedClass = "left-hover";
              if (i === rightRow && j === rightColumn && !singleInputMode)
                selectedClass = "right-hover"

              // determine if key is being clicked
              var clicking = false;
              if (i === leftRow && j === leftColumn && leftCursor.click)
                clicking = true;
              if (i === rightRow && j === rightColumn && rightCursor.click)
                clicking = true;

              // button values
              var buttonValue = "";
              var classes = "";
              var handleClick = this.onKeyClick;

              switch (button.toLowerCase()) {
                case "*bs":
                  // @ts-ignore
                  buttonValue = <Backspace />;
                  classes = "stretch-key control-key";
                  handleClick = this.onBackspace;
                  break;
                case "*sh":
                  // @ts-ignore
                  buttonValue = <Forward className="shift-icon" />;
                  classes = "stretch-key control-key";
                  handleClick = this.onShiftClick;
                  break;
                case "*sp":
                  buttonValue = " ";
                  classes = "space-bar";
                  break;
                case "*tb":
                  // @ts-ignore
                  buttonValue = <KeyboardTab />;
                  classes = "stretch-key control-key";
                  handleClick = () => this.onKeyClick("\t");
                  break;
                case "*cps":
                  // @ts-ignore
                  buttonValue = <KeyboardCapslock />;
                  classes = "stretch-key control-key";
                  handleClick = this.onCapsLock;
                  break;
                case "*e":
                  // @ts-ignore
                  buttonValue = <Search />;
                  classes = "stretch-key control-key";
                  handleClick = this.onEnter;
                  break;
                case "\\":
                  buttonValue = "\\";
                  classes = "stretch-key";
                  break;
                case "*l":
                  // @ts-ignore
                  buttonValue = <PlayArrow className="left-arrow-icon" />;
                  classes = "control-key";
                  handleClick = () => this.onNavigate(true);
                  break;
                case "*r":
                  // @ts-ignore
                  buttonValue = <PlayArrow className="right-arrow-icon" />;
                  classes = "control-key";
                  handleClick = () => this.onNavigate(false);
                  break;
                default:
                  buttonValue = (uppercase || capsLock) ? button.toUpperCase() : button.toLowerCase();
              }

              if (clicking)
                handleClick(buttonValue);

              return <KeyboardButton
                value={buttonValue}
                onClick={handleClick}
                classes={`${classes} ${selectedClass}`}
                clicking={clicking}
              />;
            })}
          </div>
        })}
      </div>
    );

    // override state if clicking == true
    if (rightCursor.click || leftCursor.click) {
      const leftX = leftCursor.x, leftY = leftCursor.y;
      const rightX = rightCursor.x, rightY = rightCursor.y;

      this.setState({
        leftCursor: {
          x: leftX,
          y: leftY,
          click: false,
        },

        rightCursor: {
          x: rightX,
          y: rightY,
          click: false,
        },
      })
    }

    return value;
  }
}

export default Keyboard;