import React from "react";
import Keyboard from "./components/Keyboard";

class App extends React.Component {
  constructor(props) {
    super(props);

    // bind events to this instance
    this.moveCursor = this.moveCursor.bind(this);
    this.placeCharacter = this.placeCharacter.bind(this);
    this.removeCharacter = this.removeCharacter.bind(this);
    this.enterPressed = this.enterPressed.bind(this);

    // set initial state
    this.state = {
      input: "",
      cursorIndex: 0,
    };
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

  render() {
    const { input } = this.state;

    return (
      <div>
        <div>
          <textarea 
            value={input}
          />
        </div>
        <Keyboard 
          inputHandler={this} 
        />
      </div>
    );
  }
}

export default App;