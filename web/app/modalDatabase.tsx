"use client";

const ModalDatabase = ({
  showDatabaseModal,
  hideDatabaseModal,
  tryConnection,
}) => {
  return (
    <div
      className="modal"
      style={{
        display: showDatabaseModal ? "grid" : "none",
        gridTemplateColumns: "1fr 1fr",
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0,0,0, 0.4)",
      }}
    >
      <button
        className="exitButton"
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          border: "none",
          backgroundColor: "transparent",
        }}
      ></button>
      <style jsx>{`
        .exitButton::hover {
          background-color: red;
        }
      `}</style>

      <label>Host</label>
      <input id="host" type="text" placeholder="localhost" />
      <label>Username</label>
      <input id="username" type="text" placeholder="Username" />
      <label>Password</label>
      <input id="password" type="password" placeholder="Password" />
      <label>Database</label>
      <input id="database" type="text" placeholder="Database" />
      <label>Port</label>
      <input id="port" type="text" placeholder="Port" />
      <button id="backButtonDatabase" onClick={hideDatabaseModal}>
        Back
      </button>
      <button id="tryConnection" onClick={tryConnection}>
        Try connection
      </button>
    </div>
  );
};

export default ModalDatabase;
