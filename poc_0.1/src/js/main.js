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

/*
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
let objects = []  
const box = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial( { color: 0xBE7363 } ));
const edges = new THREE.EdgesGeometry( box.geometry ); 
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) ); 
box.add( line );

var obj = { 
    'Crea scatola':function(){ 
        //box
        const clonedBox = box.clone();
        scene.add( clonedBox );
        clonedBox.position.set(getRandomInt(40) - 20 + 0.5,0.5,getRandomInt(40) - 20 + 0.5);
        objects.push(clonedBox);
    },
    'Elimina scatole':function(){ 
        objects.forEach(function(object){
            scene.remove(object);
        })
        objects = [];
    }
};


gui.add(obj,'Crea scatola');
gui.add(obj,'Elimina scatole');


const raycaster = new THREE.Raycaster();
let intersects;

const mousePosition = new THREE.Vector2();
const normalizedMousePosition = new THREE.Vector2();

window.addEventListener('mousemove',function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    normalizedMousePosition.x = (mousePosition.x).floor().addScalar(0.5);
    normalizedMousePosition.y = (mousePosition.y).floor().addScalar(0.5);
});


window.addEventListener('mousedown',function(){
    const objectExist = objects.find(function(object){
        return ((object.position.x === normalizedMousePosition.x) && (object.position.z === normalizedMousePosition.z));
    });
    if(!objectExist){
        intersects = raycaster.intersectObjects(scene.children);
        intersects.forEach(function(intersect){
            if(intersect.object.name === 'ground'){
                const clonedBox = box.clone();
                scene.add( clonedBox );
                objects.push(clonedBox);
                clonedBox.position.copy(intersect.point).floor().addScalar(0.5);
            }
        });
    }
});

*/

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