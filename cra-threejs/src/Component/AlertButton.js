import React from "react";
import FileUploadModal from "./ModalSVG";

class AlertButtons extends React.Component {
  handleButtonClick = (buttonNumber) => {
    alert(`Hai cliccato sul pulsante ${buttonNumber}!`);
  };

  render() {
    return (
      <div>
        <button onClick={() => this.handleButtonClick(1)}>Dimensioni</button>
        <FileUploadModal />
        <button onClick={() => this.handleButtonClick(3)}>Ricerca</button>
      </div>
    );
  }
}

export default AlertButtons;
