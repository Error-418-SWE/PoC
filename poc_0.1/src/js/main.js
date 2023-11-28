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

//piano 
const plane = new THREE.Mesh( new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial( { color: 0xFFFFFf, side: THREE.DoubleSide } ) );
scene.add( plane );
plane.name = 'ground';
plane.rotation.x = -0.5 * Math.PI;

const gridHelper = new THREE.GridHelper(40,40);
scene.add(gridHelper);

//tools gui
const gui = new dat.GUI();

//mesh scaffale
const box = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial( { color: 0xBE7363 } ));

let isScaffaleDaPosizionare = false;
let ancoredObject;
const mousePosition = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane2 = new THREE.Plane();
const raycaster = new THREE.Raycaster();

function getMouse3DPos(){
    planeNormal.copy(camera.position).normalize();
    plane2.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane2, intersectionPoint);
    return intersectionPoint;
}


var obj = { 
    'Crea scaffale':function(){ 
        const nuovoScaffale = box.clone();
        scene.add( nuovoScaffale );
        isScaffaleDaPosizionare = true;
        ancoredObject = nuovoScaffale;
        nuovoScaffale.position.copy(getMouse3DPos());
    }
}

gui.add(obj,'Crea scaffale');

window.addEventListener('mousemove',function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (isScaffaleDaPosizionare){
        
        ancoredObject.position.copy(getMouse3DPos());
    }  
});

function removeMouseAnchor(){
    isScaffaleDaPosizionare = false;
    scene.remove(ancoredObject);
}


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


function animate(time) {
    renderer.render( scene, camera );
}

renderer.setAnimationLoop(animate);

//reshape window
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});