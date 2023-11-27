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