// problema: scaffali e bin non si allineano alla griglia 

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'; //serve per muovere la visuale col mouse
import * as dat from 'dat.gui'; 


//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//scene
const scene =  new THREE.Scene();
scene.background = new THREE.Color( 0x2E313F );

//camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-10,30,30);


//orbit
const orbit = new OrbitControls(camera, renderer.domElement); //serve per muovere la visuale col mouse
orbit.update();



// variabili per traking del mouse e il posizionamento dei box ancorati
let notPlaced = false;
let ancoredObject;
const mousePosition = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane2 = new THREE.Plane();
const raycaster = new THREE.Raycaster();

// dimensione della cella della griglia del piano
const gridOptions = {
    GridSize: 1
};

//piano 
const latoPiano = 40;
const plane = new THREE.Mesh( new THREE.PlaneGeometry(latoPiano, latoPiano), new THREE.MeshBasicMaterial( { color: 0xFFFFFf, side: THREE.DoubleSide } ) );
scene.add( plane );
plane.name = "ground";
plane.rotation.x = -0.5 * Math.PI;

//griglia
let numberOfGridRows =  latoPiano / gridOptions.GridSize;
let gridHelper = new THREE.GridHelper(latoPiano,numberOfGridRows);
gridHelper.rotation.x = -0.5 * Math.PI;
plane.add(gridHelper);

//+++++++++++++++++++++++++++++++++++UTILITIES+++++++++++++++++++++++++++++++++++++++++++++++

// funzione che ritorna una posizione nell'ambiente di lavoro (3d) data la posizione del mouse (2d)
function getMouse3DPos(){
    planeNormal.copy(camera.position).normalize();
    plane2.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane2, intersectionPoint);
    return intersectionPoint;
}

// Funzione per verificare collisioni con altri oggetti
function checkCollision() {
    const boundingBox = new THREE.Box3().setFromObject(ancoredObject); //serve perchè l'intersectsBox funziona su tipi box3
    let collision = false;
    scene.children.forEach((object) => {
        if (object !== ancoredObject && object.name !== "ground") {
            const otherBoundingBox = new THREE.Box3().setFromObject(object); //serve perchè l'intersectsBox funziona su tipi box3
            otherBoundingBox.expandByScalar(-0.01); // riduco un minimo il box se no due box in contatto li conta come in collisione
            if (boundingBox.intersectsBox(otherBoundingBox)) { 
                collision = true;
                return collision;
            }
        }
    });
    return collision;
}


// funzione che posiziona ancoredObject alla posizione corrispondente nel piano se si passa con il mouse sopra ad esso 
function hoverGround(intersects) {
    let isIntersectionFound = false;
    intersects.forEach(function(intersect) {
        // Posizionamento scaffali e bin
        if (
            (ancoredObject.name === "shelf" && intersect.object.name === "ground") ||
            (ancoredObject.name === "bin" && (intersect.object.name === "ground" || intersect.object.name === "plane"))
          ) {
            positionObjectOnSurface(intersect, ancoredObject);
            setColorBasedOnCollision(ancoredObject);
            isIntersectionFound = true;
        }
    });

    return isIntersectionFound;
}

/*
function positionObjectOnSurface(intersect, object) {

    const intersectionPoint = intersect.point;

    const normal = intersect.face.normal;
    // Mi sposto nell'origine
    object.position.set(0, 0, 0);
    // Allineamento con il punto di intersezione
    object.position.copy(intersectionPoint);
    // Sposto l'oggetto in superficie
    object.position.y += object.geometry.parameters.height / 2;
}
*/


function positionObjectOnSurface(intersect, object) {
    if (isGridOn) {
        object.position.copy(intersect.point).divideScalar(gridOptions.GridSize).floor().multiplyScalar(gridOptions.GridSize);
        
        // Correzione posizionamento lunghezza dispari
        if ((object.geometry.parameters.width % 2) !== 0) {
            object.position.x -= (object.geometry.parameters.width / 2) % gridOptions.GridSize;
        }

        // Correzione posizionamento profondità dispari
        if ((object.geometry.parameters.depth % 2) !== 0) {
            object.position.z -= (object.geometry.parameters.depth / 2) % gridOptions.GridSize;
        }
    } else {
        object.position.copy(intersect.point);
    }

    object.position.y = object.geometry.parameters.height / 2;
}


function setColorBasedOnCollision(object) {
    // Verifica collisioni con altri oggetti
    if (checkCollision()) {
        if (object.name === "shelf") {
            object.material.color.setHex(ancorObjectCollisionColor);
        } else if (object.name === "bin") {
            object.material.color.setHex(ancorBinCollisionColor);
        }
    } else {
        if (object.name === "shelf") {
            object.material.color.setHex(ancorObjectColor);
        } else if (object.name === "bin") {
            object.material.color.setHex(ancorBinColor);
        }
    }
}



//funzione che crea una griglia capace di coprire l'oggetto plane)
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
//+++++++++++++++++++++++++++++++CREAZIONE++++++++++++++++++++++++++++++++++++++++++++++++++++++



//SHELF
let ancorObjectColor = 0xBE7363; // colore del box scaffale
let ancorObjectCollisionColor = 0xFF0000; // Colore del box ancorato in caso di collisione

function createShelf(width, height, depth, planes){
    if (planes > height - 1)
        planes = height - 1;
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    const boxMaterial = new THREE.MeshBasicMaterial({color: ancorObjectColor, transparent:true, opacity:0.2});
    const shelf = new THREE.Mesh( boxGeometry,boxMaterial);
    const edges = new THREE.EdgesGeometry( boxGeometry ); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 })); 
    shelf.add(line);


    let step = height / planes;
    let yPlane = - height / 2;
    for (let i = 0; i < planes; i++) {
        const planeGeometry = new THREE.PlaneGeometry(width, depth);
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA, side:THREE.DoubleSide});
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.name = "plane";
        plane.rotation.x = Math.PI / 2;

        const grid = coverGrid(plane, width, depth);
        grid.name = "grid";
        plane.add(grid);

        shelf.add(plane);
        plane.position.y = yPlane;
        yPlane += step;
    }

    shelf.name = "shelf";
    return shelf;
}


//bottone della gui per creare lo scaffale
var obj = { 
    "Crea scaffale":function(){ 
        const shelf = createShelf(boxDimensions.larghezza ,boxDimensions.altezza, boxDimensions.profondita, boxDimensions.piani);
        scene.add(shelf);
        notPlaced = true;
        ancoredObject = shelf;
        shelf.position.copy(getMouse3DPos());
    }
}

//BIN
let ancorBinColor = 0x444444; // colore del bin
let ancorBinCollisionColor = 0xffff00; // Colore del bin in caso di contatto con lo scaffale

function createBin(larghezza, altezza, profondita){
    const boxGeometry = new THREE.BoxGeometry(larghezza, altezza, profondita);
    const boxMaterial = new THREE.MeshBasicMaterial({color: ancorBinColor});
    const box = new THREE.Mesh( boxGeometry,boxMaterial);
    const edges = new THREE.EdgesGeometry( boxGeometry ); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 })); 
    box.name = "bin";
    box.add(line);
    return box;
}


//bottone della gui per creare il bin
var obj2 = { 
    "Crea bin":function(){ 
        const bin = createBin(binDimensions.larghezzaB ,binDimensions.altezzaB ,binDimensions.profonditaB);
        scene.add(bin);
        notPlaced = true;
        ancoredObject = bin;
        bin.position.copy(getMouse3DPos());
    }
}






//++++++++++++++++++++++++GUI+++++++++++++++++++++++++++++++++++++++++++

//tools gui
// Aggiungi campi di input per larghezza, altezza e profondità nella GUI
const boxDimensions = { larghezza: 2, altezza: 2, profondita: 2, piani: 2};
const binDimensions = { larghezzaB: 2, altezzaB: 2, profonditaB: 2 };

const gui = new dat.GUI();
//gui per scaffale
const folder = gui.addFolder("Dimensioni Scaffale");
folder.add(boxDimensions, "larghezza", 1, 10).step(1).name("Larghezza");
folder.add(boxDimensions, "altezza", 1, 10).step(1).name("Altezza");
folder.add(boxDimensions, "profondita", 1, 10).step(1).name("Profondità");
folder.add(boxDimensions, "piani", 1, 10).step(1).name("Piani");
folder.open();
gui.add(obj,"Crea scaffale");


//gui per bin
const folder2 = gui.addFolder("Dimensioni Bin");
folder2.add(binDimensions, "larghezzaB", 1, 10).step(1).name("Larghezza");
folder2.add(binDimensions, "altezzaB", 1, 10).step(1).name("Altezza");
folder2.add(binDimensions, "profonditaB", 1, 10).step(1).name("Profondità");

folder2.open();
gui.add(obj2,"Crea bin");

let isGridOn = true;
gui.add( gridOptions, "GridSize", 0, 1.5).step(0.5).name("Grid Size").onChange(function(value){
    if(value === 0){
        plane.remove(gridHelper);
        isGridOn = false;
    }
    else{
        if(!isGridOn)isGridOn = true;
        numberOfGridRows =  latoPiano / value;
        gridHelper.divisions = numberOfGridRows;
        plane.remove(gridHelper);
        gridHelper = new THREE.GridHelper(latoPiano,numberOfGridRows);
        plane.add(gridHelper);
        gridHelper.rotation.x = -0.5 * Math.PI;
    }
});


//+++++++++++++++++EVENTI++++++++++++++++++++++++++++++++++++++++++++++


// allo spostamento del mouse:
window.addEventListener("mousemove",function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (notPlaced){
        raycaster.setFromCamera(mousePosition,camera);
        intersects = raycaster.intersectObjects(scene.children);
        if(hoverGround(intersects)){
            return;
        }
        ancoredObject.position.copy(getMouse3DPos());
    }  
});


function removeMouseAnchor(){
    notPlaced = false;
    scene.remove(ancoredObject);
}

// se si preme backspace, canc, esc o il tasto destro del mouse viene rimossa l'ancora
document.addEventListener("keydown", function(e) {
    if (notPlaced){
        if (e.key === "Delete" || e.key === "Backspace" || e.key === "Escape" || e.button === 2)  {
            removeMouseAnchor();
        }
    }
});

document.addEventListener("mousedown", function(e) {
    if (notPlaced){
        if ( e.button === 2)  {
            removeMouseAnchor();
        }
    }
});

// quando si da doppio click
let intersects;
window.addEventListener("dblclick",function(){
        if(notPlaced){
            if((ancoredObject.name == "shelf" && !checkCollision()) || (ancoredObject.name == "bin" && checkCollision())){
                raycaster.setFromCamera(mousePosition,camera);
                intersects = raycaster.intersectObjects(scene.children);
                intersects.forEach(function(intersect){
                    if (ancoredObject.name = "shelf") {
                        if(intersect.object.name == "ground"){
                            const nbox = ancoredObject.clone();
                            scene.add(nbox);
                            removeMouseAnchor();                
                        }
                    } else if (ancoredObject.name = "bin") {
                        if(intersect.object.name == "plane"){
                            const nbox = ancoredObject.clone();
                            intersect.object.add(nbox);
                            removeMouseAnchor();                
                        }
                    }
                });
            }
        }
});


function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//reshape window
window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}); 
