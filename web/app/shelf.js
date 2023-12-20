import * as THREE from 'three'; 

export const ancorObjectColor = 0xBE7363; // Colore del box scaffale
export const ancorObjectCollisionColor = 0xFF0000; // Colore del box ancorato in caso di collisione


export const gridOptions = {
    GridSize: 1
};

const stuff = ["rasoio elettrico", "televisore", "smartphone", ["televisione, playstation"], ["mouse", "tastiera"]];

// funzione che crea una griglia capace di coprire l'oggetto plane
function coverGrid(plane, width, depth) {
    // Create a grid geometry
    var gridGeometry = new THREE.BufferGeometry();

    var divisionsX = width / gridOptions.GridSize; // Number of grid divisions along the x-axis
    var divisionsY = depth / gridOptions.GridSize; // Number of grid divisions along the y-axis
    var sizeX = plane.geometry.parameters.width; // Size of the plane along the x-axis
    var sizeY = plane.geometry.parameters.height; // Size of the plane along the y-axis

    var vertices = [];

    for (var i = 0; i <= divisionsX; i++) {
    var x = (i / divisionsX) * sizeX - sizeX / 2;
    vertices.push(x, -sizeY / 2, 0, x, sizeY / 2, 0);
    }

    for (var i = 0; i <= divisionsY; i++) {
    var y = (i / divisionsY) * sizeY - sizeY / 2;
    vertices.push(-sizeX / 2, y, 0, sizeX / 2, y, 0);
    }

    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    // Create a material for the grid
    var gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create a grid mesh
    var grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    return grid;
}


//creazione scaffale
export function createShelf(width, height, depth, planes, columns, orientamento){
    if (planes > height - 1) //i piani devono essere max altezza - 1
        planes = height - 1;
    if (columns > width)
        columns = width;
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    const boxMaterial = new THREE.MeshBasicMaterial({color: ancorObjectColor, transparent:true, opacity:0.01});
    const shelf = new THREE.Mesh(boxGeometry, boxMaterial);
    const edges = new THREE.EdgesGeometry(boxGeometry); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xA9A9A9, linewidth: 2})); 
    shelf.add(line);

    const step = (height - 1) / planes;
    let yPlane = (- height / 2) + 0.08; // il piano viene posizionato alla creazione nel punto 0,0,0 relativo a suo padre(lo scaffale), quindi per portarlo in basso allo scaffale imposto un'altezza pari a - altezzascaffale/2.
    for (let i = 0; i < planes; i++) {
        const planeGeometry = new THREE.PlaneGeometry(width, depth);
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xD2B48C, side:THREE.DoubleSide});
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.name = "plane";
        plane.rotation.x = Math.PI / 2;

        if(gridOptions.GridSize > 0){
            const grid = coverGrid(plane, width, depth);
            grid.name = "grid";
            plane.add(grid);    
        }
        
        shelf.add(plane);
        plane.position.y = yPlane;

        //creazione bin
        const binHeight = step - 0.2;
        const binDepth = depth - 0.4;
        const binWidth = width / columns - 0.1;
        //nela geomeria dei bin altezza e profondità sono invertite, in modo da inserirsi verticalmente nello scaffale con la funzione add (che normalmente fa rotazioni esotiche)
        const binGeometry = new THREE.BoxGeometry(binWidth,  binHeight, binDepth);
        const binMaterial = new THREE.MeshBasicMaterial({color: 0x4169E1});

    
        const stepX = width / columns;
        let xBin = - width / 2 + binWidth / 2; //binWidth/2 gap per buttare dentro il bin
        for (let j = 0; j < columns; j++) {
            let bin = new THREE.Mesh(binGeometry, binMaterial);
            bin.name = "bin";
            
            //bordi bin
            const bedges = new THREE.EdgesGeometry(binGeometry); 
            const bline = new THREE.LineSegments(bedges, new THREE.LineBasicMaterial({ color: 0x111111 })); 
            bin.add(bline);
            //merce random
            let m = Math.floor((Math.random() * stuff.length));
            bin.userData = {content: stuff[m]};
            plane.add(bin);

            //rotazione di 90 necessaria, il piano su sui viene applicato è stato anche egli ruotato
            //poichè il bin è ruotato, bisogna considerare l'altezza(y) come profondita(z) e viceversa
            bin.rotation.x = Math.PI / 2; //ok
            bin.position.z = - step / 2; //ok

            bin.position.x = xBin;
            xBin += stepX;
        }

        yPlane += step;
    }

    shelf.name = "shelf";
    if (orientamento == "verticale")
        shelf.rotation.y = Math.PI / 2;
    return shelf;
}