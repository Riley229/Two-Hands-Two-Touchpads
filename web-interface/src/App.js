import React from "react";
import Keyboard from "./components/Keyboard";

class App extends React.Component {
  state = {
    input: "",
  };

  render() {
    const { input } = this.state;

    return (
      <div>
        <div>
          <textarea value={input} />
        </div>
        <Keyboard/>
      </div>
    );
  }
}

export default App;