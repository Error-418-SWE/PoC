"use client";
import React, {useEffect, useState} from "react";
import ItemCard from "./ItemCard";

function SidePanel({showSearchPanel, hideSearchPanel}){
    const [items, setItems] = useState([]);
    
    useEffect(() => {
        if (showSearchPanel) {
            fetch('http://localhost:3001/products')
                .then(response => response.json())
                .then(data => {setItems(data); console.log(data);});
        }
    }, [showSearchPanel]);

    return (
        <aside style={{
            display: showSearchPanel ? "flex" : "none",
            flexDirection: "column",
            maxWidth: "40vw",
            backgroundColor: "#5427ab",
            padding: "1em",
        }}>
            <button id="closePanelButton" onClick={hideSearchPanel} style={{
                alignSelf: "flex-end",
            }}>X</button>
            <div style={{
                marginTop: "1em",
                display: "flex",
                flexDirection: "row",
                columnGap: "1em",
            }}>
                <input id="searchBar" style={{
                    color: "white",
                    background: "transparent",
                    padding: "0.5em",
                    boxShadow: "none",
                    border: "1px solid white",
                    borderRadius: "0.5em",
                }} placeholder="Search..."></input>
                <button id="searchButton">Search</button>
            </div>
            <style jsx>{`

                    #searchBar::placeholder{
                        color: white;
                        font-style: italic;
                    }

                    #closePanelButton:hover{
                        background-color: #8B0000;
                        color: white;
                    }
                    #searchButton:hover{
                        background-color: #3c1687;
                        color: white;
                    }
                `}</style>
            <div id="searchResultContainer" style={{
                marginTop: "1em",
                display: "flex",
                flexDirection: "column",
                rowGap: "1em",
            
            }}> 
            {items.map((item,index) => (
                <ItemCard key={index} id={item.id} nome={item.nome} dimensione={item.dimensione} peso={item.peso}></ItemCard>
            ))}
            </div>
        </aside>
    );
};

export default SidePanel;