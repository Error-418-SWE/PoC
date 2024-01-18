import React from "react";
import FileUploadModal from "./ModalSVG";

import "./AlertButton.css";

class AlertButtons extends React.Component {
  handleButtonClick = (buttonNumber) => {
    alert(`Hai cliccato sul pulsante ${buttonNumber}!`);
  };

  render() {
    return (
      <div id="buttons">
        <button onClick={() => this.handleButtonClick(1)}>Dimensioni</button>
        <FileUploadModal />
      </div>
    );
  }
}

export default AlertButtons;
