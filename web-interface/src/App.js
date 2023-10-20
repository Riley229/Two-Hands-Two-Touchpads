import { Settings } from "@mui/icons-material";
import React from "react";
import Switch from "react-switch";
import Popup from "reactjs-popup";
import { io } from "socket.io-client";
import Keyboard from "./components/Keyboard";
import { GetSearchSuggestions, LoadSearchData } from "./data/GetSearchSuggestions";

// setup websocket
const socket = io("http://localhost:10942", {
  extraHeaders: {
    "client-type": "web-interface",
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    // bind events to this instance
    this.moveCursor = this.moveCursor.bind(this);
    this.placeCharacter = this.placeCharacter.bind(this);
    this.removeCharacter = this.removeCharacter.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
    this.toggleTextSuggestions = this.toggleTextSuggestions.bind(this);
    this.toggleAbsolutePositioning = this.toggleAbsolutePositioning.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

    // set initial state
    this.state = {
      input: "",
      cursorIndex: 0,
      displayAddress: null,
      menuOpen: false,
      singleInputMode: true,
      textSuggestions: false,
      absolutePositioning: false,
      generatedTextSuggestions: [],
      suggestionDataLoaded: false,
    };

    // setup webhook listeners
    let self = this;
    socket.on("display-ip", function (address) {
      self.setState({
        displayAddress: address,
      });
    });

    socket.on("set-mode", function (singleInput) {
      self.setState({
        singleInputMode: singleInput,
      });
    });

    socket.on("set-absolute", function (absolute) {
      self.setState({
        absolutePositioning: absolute,
      });
    });

    // start loading and parsing search data
    LoadSearchData(() => {
      this.setState({
        suggestionDataLoaded: true,
      });
    });
  }

  moveCursor(left) {
    const { input, cursorIndex } = this.state;
    const offset = left ? -1 : 1;
    const value = Math.min(input.length, Math.max(0, cursorIndex + offset));

    this.setState({
      cursorIndex: value,
    });
  }

  placeCharacter(char) {
    const { input, cursorIndex } = this.state;
    const prefix = input.slice(0, cursorIndex);
    const suffix = input.slice(cursorIndex);

    this.setState({
      input: prefix + char + suffix,
      cursorIndex: cursorIndex + 1,
    });
  }

  removeCharacter() {
    const { input, cursorIndex } = this.state;
    if (cursorIndex === 0) return;

    const prefix = input.slice(0, cursorIndex - 1);
    const suffix = input.slice(cursorIndex);

    this.setState({
      input: prefix + suffix,
      cursorIndex: cursorIndex - 1,
    });
  }

  setInputValue(value) {
    this.setState({
      input: value,
      cursorIndex: value.length,
    });

    this.enterPressed();
  }

  enterPressed() {
    // TODO: implement
  }

  toggleMode(checked) {
    socket.emit("set-mode", !checked);
  }

  toggleTextSuggestions(checked) {
    this.setState({
      textSuggestions: checked,
    });
  }

  toggleAbsolutePositioning(checked) {
    socket.emit("set-absolute", checked);
  }

  toggleMenu() {
    const { menuOpen } = this.state;
    this.setState({
      menuOpen: !menuOpen,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.input !== prevState.input) {
      this.setState({
        generatedTextSuggestions: GetSearchSuggestions(this.state.input),
      });
    }
  }

  render() {
    const {
      input,
      displayAddress,
      singleInputMode,
      textSuggestions,
      menuOpen,
      absolutePositioning,
      suggestionDataLoaded,
    } = this.state;

    return (
      <div>
        <div className="main">
          <div>
            <div className="inputArea">
              <text className="inputText">{input}</text>
            </div>
          </div>
          <Keyboard
            socket={socket}
            singleInputMode={singleInputMode}
            textSuggestionsEnabled={textSuggestions}
            textSuggestions={
              textSuggestions && this.state.generatedTextSuggestions
            }
            absolute={absolutePositioning}
            moveCursor={this.moveCursor}
            placeCharacter={this.placeCharacter}
            removeCharacter={this.removeCharacter}
            setInputValue={this.setInputValue}
            enterPressed={this.enterPressed}
          />

          <Popup open={!suggestionDataLoaded} closeOnDocumentClick={false}>
            <div>
              <h5>Pre-loading text-suggestions...</h5>
              <h3>Please Wait</h3>
            </div>
          </Popup>

          <Popup open={suggestionDataLoaded && displayAddress != null} closeOnDocumentClick={false}>
            <div>
              <h5>Connect a mobile device to continue</h5>
              <h3>{displayAddress}</h3>
            </div>
          </Popup>
        </div>

        <button className="toggle-menu" onClick={this.toggleMenu}>
          <Settings />
        </button>

        {menuOpen && (
          <div className="menu">
            <h4>Settings</h4>
            <div className="menu-option">
              <Switch
                className="menu-input"
                height={20}
                width={40}
                checkedIcon={false}
                uncheckedIcon={false}
                checked={!singleInputMode}
                onChange={this.toggleMode}
              />
              <text className="menu-label">Multi-touch Input</text>
            </div>
            <div className="menu-option">
              <Switch
                className="menu-input"
                height={20}
                width={40}
                checkedIcon={false}
                uncheckedIcon={false}
                checked={textSuggestions}
                onChange={this.toggleTextSuggestions}
              />
              <text className="menu-label">Text Suggestions</text>
            </div>{" "}
            <div className="menu-option">
              <Switch
                className="menu-input"
                height={20}
                width={40}
                checkedIcon={false}
                uncheckedIcon={false}
                checked={absolutePositioning}
                onChange={this.toggleAbsolutePositioning}
              />
              <text className="menu-label">Absolute Positioning</text>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
