import React, { useState } from "react";
import "./ModalSVG.css";

const FileUploadModal = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    // Puoi aggiungere qui la logica per gestire il file caricato
    alert(`File "${selectedFile.name}" caricato con successo!`);
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal}>Apri Modal</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Carica un file</h2>
            <input type="file" onChange={handleFileUpload} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadModal;
