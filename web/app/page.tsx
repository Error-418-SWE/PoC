"use client";
import React, { useState } from "react";
import App from "./demo";
import NavBar from "./NavBar";
import ModalSvg from "./modalSvg";
import SidePanel from "./sidePanel";
import ModalDatabase from "./modalDatabase";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  var [manualCreation, setManualCreation] = useState(false);
  var [fileContent, setFileContent] = useState(null);
  var [fileName, setFileName] = useState(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const showPanel = () => {
    setShowSearchPanel(true);
  };

  const hidePanel = () => {
    setShowSearchPanel(false);
  };

  const clickSvgButton = () => {
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const clickDatabaseButton = () => {
    setShowDatabaseModal(true);
  };

  const hideDatabaseModal = () => {
    setShowDatabaseModal(false);
  };

  const clickManualButton = () => {
    setFileName(null);
    setFileContent(null);
    setManualCreation(true);
  };

  const tryConnection = () => {
    let host =      (document.getElementById("host") as HTMLInputElement)?.value;
    let username =  (document.getElementById("username") as HTMLInputElement)?.value;
    let password =  (document.getElementById("password") as HTMLInputElement)?.value;
    let database =  (document.getElementById("database") as HTMLInputElement)?.value;
    let port =      (document.getElementById("port") as HTMLInputElement)?.value;
    
    hideDatabaseModal();
  };

  return (
    <main>
      <NavBar
        onManualCreation={clickManualButton}
        onButtonClick={clickSvgButton}
        onDatabaseButtonClick={clickDatabaseButton}
        showSearchPanel={showPanel}
      />
      <ModalSvg
        showModal={showModal}
        hideModal={hideModal}
        setFileContent={setFileContent}
        setFileName={setFileName}
        setManualCreation={setManualCreation}
      />
      <ModalDatabase
        showDatabaseModal={showDatabaseModal}
        hideDatabaseModal={hideDatabaseModal}
        tryConnection={tryConnection} 
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: showSearchPanel ? "80vw" : "100vw",
          }}
        >
          <App
            fileContent={fileContent}
            fileName={fileName}
            manualCreation={manualCreation}
          ></App>
        </div>
        <SidePanel
          showSearchPanel={showSearchPanel}
          hideSearchPanel={hidePanel}
        ></SidePanel>
      </div>
    </main>
  );
}
