import React from 'react';
import Popup from 'reactjs-popup';
import Keyboard from './components/Keyboard';
import { io } from 'socket.io-client';

// setup websocket
const socket = io('http://localhost:10942', {
  extraHeaders: {
    'client-type': 'web-interface',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    // bind events to this instance
    this.moveCursor = this.moveCursor.bind(this);
    this.placeCharacter = this.placeCharacter.bind(this);
    this.removeCharacter = this.removeCharacter.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
    this.toggleMode = this.toggleMode.bind(this);

    // set initial state
    this.state = {
      input: '',
      cursorIndex: 0,
      displayAddress: null,
      singleInputMode: true,

      keyboardDim: {
        top: 0,
        left: 0,
        height: 0,
        width: 0,
      },
    };

    // setup webhook listeners
    let self = this;
    socket.on('display-ip', function (address) {
      self.setState({
        displayAddress: address,
      });
    });

    socket.on('set-mode', function(singleInput) {
      self.setState({
        singleInputMode: singleInput,
      });
    });
  }

  moveCursor(left) {
    const { input, cursorIndex } = this.state;
    const offset = (left) ? -1 : 1
    const value = Math.min(input.length, Math.max(0, cursorIndex + offset))

    this.setState({
      cursorIndex: value,
    });
  }

  placeCharacter(char) {
    const { input, cursorIndex } = this.state;
    const prefix = input.slice(0, cursorIndex)
    const suffix = input.slice(cursorIndex)

    this.setState({
      input: prefix + char + suffix,
      cursorIndex: cursorIndex + 1,
    });
  }

  removeCharacter() {
    const { input, cursorIndex } = this.state;
    if (cursorIndex === 0)
      return;

    const prefix = input.slice(0, cursorIndex - 1)
    const suffix = input.slice(cursorIndex)

    this.setState({
      input: prefix + suffix,
      cursorIndex: cursorIndex - 1,
    });
  }

  enterPressed() {
    // TODO: implement
  }

  toggleMode() {
    const { singleInputMode } = this.state;
    socket.emit('set-mode', !singleInputMode);
  }

  render() {
    const { input, displayAddress, singleInputMode, keyboardDim } = this.state;

    return (
      <div className="main">
        <div>
          <div className="inputArea">
            <text className="inputText">{input}</text>
          </div>
          {/* <textarea 
            className="inputArea"
            value={input}
          /> */}
        </div>
        <Keyboard 
          socket={socket}
          singleInputMode={singleInputMode}
          moveCursor={this.moveCursor}
          placeCharacter={this.placeCharacter}
          removeCharacter={this.removeCharacter}
          enterPressed={this.enterPressed}
          dimension={keyboardDim}
        />

        <Popup 
          open={displayAddress != null} 
          closeOnDocumentClick={false}
        >
          <div>
            <h5>Connect a mobile device to continue</h5>
            <h3>{displayAddress}</h3>
          </div>
        </Popup>
        <button onClick={this.toggleMode} >
            Toggle Input Mode
          </button>
      </div>
    );
  }
}

export default App;