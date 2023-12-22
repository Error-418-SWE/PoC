"use client";

const ModalSvg = ({showModal, hideModal, setFileContent,setFileName, setManualCreation}) => {

    const handleFileChange = (event) => {
        event.preventDefault();
        const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) => {
            setFileName(file.name);
            setFileContent(event.target.result);
            setManualCreation(false);
            hideModal();
        };

        event.target.value = null;
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };


    return (
        <div className="modal" style={{
            display: showModal ? "block" : "none",
            position: "fixed",
            zIndex: 1,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgba(0,0,0, 0.4)",
        }}>
            <div className="modal-content" style={{
                backgroundColor: "white",
                margin: "15% auto",
                padding: "20px",
                border: "1px solid #888",
                width: "min-content",
                borderRadius: "2em",
            }}>
                <input type="file" id="fileElem" accept=".svg" onChange={handleFileChange} style={{
                    color: "black",
                    textAlign: "center",
                }}/>
                <div id="dropArea" style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "2em",
                    border: "2px dashed #ccc",
                    margin: "20px",
                    color: "black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                }}
                onDrop={handleFileChange}
                onDragOver={handleDragOver}
                >Drag and drop SVG file here</div>
                <button id="backButtonSvg" onClick={hideModal}>Back</button>
                <style jsx>{`

                    #backButtonSvg{
                        color: black;
                    }
                    #backButtonSvg:hover{
                        color: white;
                    }
                    #dropArea:hover{
                        background-color: #DDDDDD;  
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ModalSvg;