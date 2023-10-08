import React from "react";
import { Search } from "@mui/icons-material";

class SuggestionButton extends React.Component {
  render() {
    const { onClick, value, classes } = this.props;

    return (
      <button
        className={`search-suggestion ${classes || ''}`}
        type="button"
        onClick={() => onClick(value)}
      >
        <Search />
        {value}
      </button>
    );
  }
}

export default SuggestionButton;