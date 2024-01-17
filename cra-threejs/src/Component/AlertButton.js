import React from "react";

class AlertButtons extends React.Component {
  handleButtonClick = (buttonNumber) => {
    alert(`Hai cliccato sul pulsante ${buttonNumber}!`);
  };

  render() {
    return (
      <div>
        <button onClick={() => this.handleButtonClick(1)}>Pulsante 1</button>
        <button onClick={() => this.handleButtonClick(2)}>Pulsante 2</button>
        <button onClick={() => this.handleButtonClick(3)}>Pulsante 3</button>
      </div>
    );
  }
}

export default AlertButtons;
