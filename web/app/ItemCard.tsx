"use client";

function ItemCard({id, nome, dimensione, peso}){

    return (
        <div style = {{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            backgroundColor: "white",
            borderRadius: "0.5em",
            border: "1px solid white",
            padding: "0.5em",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        }}>
            <div style={{
                display:"grid",
                gridTemplateColumns: "1fr 1fr",
            }}>
                <label style={{ color: 'black' }}>ID</label>
                <label style={{ color: 'black'}}>{id}</label>
                <label style={{ color: 'black' }}>Nome</label>
                <label style={{ color: 'black' }}>{nome}</label>
                <label style={{ color: 'black' }}>Dimensione</label>
                <label style={{ color: 'black' }}>{dimensione}</label>
                <label style={{ color: 'black' }}>Peso</label>
                <label style={{ color: 'black' }}>{peso}</label>
            </div>
        </div>
    );

}

export default ItemCard;