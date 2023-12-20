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
        display: showDatabaseModal ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
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
      <div
        className="modal-content"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "25%",
          height: "40%",
          backgroundColor: "white",
          borderRadius: "2em",
          padding: "20px",
          rowGap: "10px",
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

        <div
          style={{
            marginTop: "20px",
            gridColumn: "1 / span 2",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <button id="backButtonDatabase" onClick={hideDatabaseModal}>
            Back
          </button>
          <button id="tryConnection" onClick={tryConnection}>
            Connect
          </button>
        </div>
      </div>
      <style jsx>{`
        input {
          border-radius: 5px;
        }

        .exitButton::hover {
          background-color: red;
        }

        label {
          color: black;
        }

        button {
          width: 30%;
          border-radius: 2em;
        }

        input {
          border: none;
          padding: 0.5em;
          border: 1px solid black;  
        }

        #backButtonDatabase {
          color: black;
        }

        #tryConnection {
          color: black;
        }

        #backButtonDatabase:hover {
          border: none;
          color: white;
          background-color: #8b0000;
        }

        #tryConnection:hover {
          border: none;
          color: white;
          background-color: green;
        }
      `}</style>
    </div>
  );
};

export default ModalDatabase;
