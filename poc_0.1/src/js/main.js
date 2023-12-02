import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'; //serve per muovere la visuale col mouse
import * as dat from 'dat.gui'; 

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene =  new THREE.Scene();
scene.background = new THREE.Color( 0x2E313F );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-10,30,30);


const orbit = new OrbitControls(camera, renderer.domElement); //serve per muovere la visuale col mouse
orbit.update();


//tools gui
// Aggiungi campi di input per larghezza, altezza e profondità nella GUI
const boxDimensions = { larghezza: 2, altezza: 2, profondita: 2 };
const gui = new dat.GUI();
const folder = gui.addFolder('Dimensioni Scaffale');
folder.add(boxDimensions, 'larghezza', 1, 10).step(1).name('Larghezza');
folder.add(boxDimensions, 'altezza', 1, 10).step(1).name('Altezza');
folder.add(boxDimensions, 'profondita', 1, 10).step(1).name('Profondità');
folder.open();

// dimensione della cella della griglia del piano
const gridOptions = {
    GridSize: 1
};

//piano 
const latoPiano = 40;
const plane = new THREE.Mesh( new THREE.PlaneGeometry(latoPiano, latoPiano), new THREE.MeshBasicMaterial( { color: 0xFFFFFf, side: THREE.DoubleSide } ) );
scene.add( plane );
plane.name = 'ground';
plane.rotation.x = -0.5 * Math.PI;

//griglia
let numberOfGridRows =  latoPiano / gridOptions.GridSize;
let gridHelper = new THREE.GridHelper(latoPiano,numberOfGridRows);
gridHelper.rotation.x = -0.5 * Math.PI;
plane.add(gridHelper);


//mesh scaffale
let ancorObjectColor = 0xBE7363; // colore del box scaffale
let ancorObjectCollisionColor = 0xFF0000; // Colore del box ancorato in caso di collisione
function creaScaffale(larghezza, altezza, profondita){
    const boxGeometry = new THREE.BoxGeometry(larghezza, altezza, profondita);
    const boxMaterial = new THREE.MeshBasicMaterial({color: ancorObjectColor});
    const box = new THREE.Mesh( boxGeometry,boxMaterial);
    const edges = new THREE.EdgesGeometry( boxGeometry ); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 })); 
    box.add(line);
    return box;
}

// variabili per traking del mouse e il posizionamento dei box ancorati
let isScaffaleDaPosizionare = false;
let ancoredObject;
const mousePosition = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane2 = new THREE.Plane();
const raycaster = new THREE.Raycaster();


// funzione che ritorna una posizione nell'ambiente di lavoro (3d) data la posizione del mouse (2d)
function getMouse3DPos(){
    planeNormal.copy(camera.position).normalize();
    plane2.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane2, intersectionPoint);
    return intersectionPoint;
}

//bottone della gui per creare lo scaffale
var obj = { 
    'Crea scaffale':function(){ 
        const nuovoScaffale = creaScaffale(boxDimensions.larghezza ,boxDimensions.altezza ,boxDimensions.profondita);
        scene.add( nuovoScaffale );
        isScaffaleDaPosizionare = true;
        ancoredObject = nuovoScaffale;
        nuovoScaffale.position.copy(getMouse3DPos());
    }
}

gui.add(obj,'Crea scaffale');
let isGridOn = true;
gui.add( gridOptions, 'GridSize', 0, 1.5).step(0.5).name('Grid Size').onChange(function(value){
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

// Funzione per verificare collisioni con altri oggetti
function checkCollision() {
    const boundingBox = new THREE.Box3().setFromObject(ancoredObject); //serve perchè l'intersectsBox funziona su tipi box3
    let collision = false;
    scene.children.forEach((object) => {
        if (object !== ancoredObject && object.name !== 'ground') {
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
function hoverGround(intersects){
    let isIntersectionFound = false;
    intersects.forEach(function(intersect){
        if(intersect.object.name === 'ground'){
            if(isGridOn){
                ancoredObject.position.copy(intersect.point).divideScalar(gridOptions.GridSize).floor().multiplyScalar(gridOptions.GridSize);
                //correzione posizionamento lunghezza dispari
                if((ancoredObject.geometry.parameters.width % 2) !== 0){
                    ancoredObject.position.x -= (ancoredObject.geometry.parameters.width / 2) % gridOptions.GridSize;
                }
 
                //correzione posizionamento profondità dispari
                if((ancoredObject.geometry.parameters.depth % 2) !== 0){
                    ancoredObject.position.z -= (ancoredObject.geometry.parameters.depth / 2) % gridOptions.GridSize;
                }

            }
            else{
                ancoredObject.position.copy(intersect.point);
            }

            ancoredObject.position.y = ancoredObject.geometry.parameters.height / 2 ;
        
            // Verifica collisioni con altri oggetti
            if (checkCollision()) {
                ancoredObject.material.color.setHex(ancorObjectCollisionColor);
            } else {
                ancoredObject.material.color.setHex(ancorObjectColor);
            }


            isIntersectionFound = true;
            return isIntersectionFound;
        }
    });
    return isIntersectionFound;
}

// allo spostamento del mouse:
window.addEventListener('mousemove',function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (isScaffaleDaPosizionare){
        raycaster.setFromCamera(mousePosition,camera);
        intersects = raycaster.intersectObjects(scene.children);
        if(hoverGround(intersects)){
            return;
        }
        ancoredObject.position.copy(getMouse3DPos());
    }  
});

function removeMouseAnchor(){
    isScaffaleDaPosizionare = false;
    scene.remove(ancoredObject);
}

// se si preme backspace, canc, esc o il tasto destro del mouse viene rimossa l'ancora
document.addEventListener('keydown', function(event) {
    if (isScaffaleDaPosizionare){
        if (event.key === "Delete" || event.key === "Backspace" || event.key === "Escape" || event.button === 2)  {
            removeMouseAnchor();
        }
    }
});

document.addEventListener('mousedown', function(event) {
    if (isScaffaleDaPosizionare){
        if ( event.button === 2)  {
            removeMouseAnchor();
        }
    }
});

// quando si preme il mouse sx:
let intersects;
window.addEventListener('mousedown',function(){
        if(isScaffaleDaPosizionare){
            if(!checkCollision()){
                raycaster.setFromCamera(mousePosition,camera);
                intersects = raycaster.intersectObjects(scene.children);
                intersects.forEach(function(intersect){
                    if(intersect.object.name === 'ground'){
                        const nuovoBlocco = ancoredObject.clone();
                        scene.add(nuovoBlocco);
                        removeMouseAnchor();                
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
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}); 
