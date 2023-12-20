"use client";

function NavBar({onManualCreation, onButtonClick, onDatabaseButtonClick, showSearchPanel}) {
    return (
        <nav style={{   backgroundColor: "#030303",
                        display: "flex", 
                        flexDirection:"row", 
                        justifyContent: "space-between"
                    }}>

            <ul style={{    display: "flex", 
                            flexDirection: "row", 
                            columnGap:"1em", 
                            listStyle:"none"}}> 
                <li>
                    <button onClick={onManualCreation}>
                        Manual Creation
                    </button>
                </li>
                <li>
                    <button onClick={onButtonClick}>
                        SVG import
                    </button>
                </li>
                <li>
                    <button onClick={onDatabaseButtonClick}>
                        Database setup
                    </button>
                </li>
            </ul>

            <button onClick={showSearchPanel}>
                Show Search Panel
            </button>
        </nav>
    );
};

export default NavBar;