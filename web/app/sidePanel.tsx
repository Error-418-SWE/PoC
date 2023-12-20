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
            backgroundColor: "#030303",
            padding: "1em",
        }}>
            <button onClick={hideSearchPanel} style={{
                alignSelf: "flex-end",
            }}>X</button>
            <div style={{
                marginTop: "1em",
                display: "flex",
                flexDirection: "row",
                columnGap: "1em",
            }}>
                <input placeholder="search" style={{
                    color: "white",
                    background: "#030303",
                    padding: "0.5em",
                    boxShadow: "none",
                    border: "1px solid white",
                }}></input>
                <button>Search</button>
            </div>
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