// Install Parcel by typing the following command: npm install parcel -g
//Make sure to install dependencies: open project in VSCode -> open command line -> type: npm install
// per usare dat.gui sevo fare npm install dat.gui con il parcel chiuso
//Run Parcel by typing this command: npx parcel ./src/index.html

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'; //serve per muovere la visuale col mouse
import * as dat from 'dat.gui'; //aggiunge tools alla gui

import nuvolaris from '../img/OIG.N2.jpeg';
import logo from '../img/Logo.jpeg';

 
const renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // se no mette le texture tutte saturate
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene =  new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

const orbit = new OrbitControls(camera, renderer.domElement); //serve per muovere la visuale col mouse

//assi
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);
camera.position.set(-10,30,30);
orbit.update();


//box
const boxGeometry = new THREE.BoxGeometry(2,2,2);
const boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add( box );
box.position.set(5,5,5);
box.castShadow = true;


//cubo con textures
const textureLoader = new THREE.TextureLoader(); // serve per poter caricare le texture
const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Material = new THREE.MeshBasicMaterial({ map: textureLoader.load(logo)});
const box2 = new THREE.Mesh(box2Geometry,box2Material);
const box2CentralObj = new THREE.Object3D();
box2CentralObj.position.set(5,5,5);
scene.add(box2CentralObj);
box2CentralObj.add(box2);
box2.position.x += 10;
box2.castShadow = true;




//sfera
const sphereGeometry = new THREE.SphereGeometry(4,50,50);
const sphereMaterial = new THREE.MeshStandardMaterial( {wireframe: false , color: 0x0000ff } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add( sphere );
sphere.position.set(-10,10,0);
sphere.castShadow = true;

//piano
const plane = new THREE.Mesh( new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial( { color: 0xFFFFFF, side: THREE.DoubleSide, visible:false } ) );
scene.add( plane );
plane.name = 'ground';
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(40,40);
scene.add(gridHelper);

//area della griglia con il mouse sopra
const higlightMesh = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial( {  side: THREE.DoubleSide,transparent:true}) );
scene.add(higlightMesh);
higlightMesh.rotation.x = -0.5 * Math.PI;
higlightMesh.position.set(0.5,0,0.5);


// aggiornamento quadratino sulla griglia in base al movimento del mouse
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove',function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition,camera);
    intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(function(intersect){
        if(intersect.object.name === 'ground'){
            const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            higlightMesh.position.set(highlightPos.x,0,highlightPos.z);
        
            const objectExist = objects.find(function(object){
                return (object.position.x === higlightMesh.position.x) && (object.position.z === higlightMesh.position.z)
            });
            if(!objectExist){
                higlightMesh.material.color.setHex(0xffffff);
            }
            else{
                higlightMesh.material.color.setHex(0xff0000);
            }
        }
    });
});

//creazione di segnalini sui riquadri della griglia cliccati
const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4,4,2),
    new THREE.MeshBasicMaterial({
        color: 0xffea00,
        wireframe: true
    })
);

const objects = []; // utilizzato per non mettere più segnalini nello stesso posto

window.addEventListener('mousedown',function(){
    const objectExist = objects.find(function(object){
        return ((object.position.x === higlightMesh.position.x) && (object.position.z === higlightMesh.position.z));
    });
    if(!objectExist){
        intersects.forEach(function(intersect){
            if(intersect.object.name === 'ground'){
                const sphereClone = sphereMesh.clone();
                sphereClone.position.copy(higlightMesh.position);
                scene.add(sphereClone);
                objects.push(sphereClone);
                higlightMesh.material.color.setHex(0xff0000);
            }
        });
    }
});

//luci

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight); 

/*
//directionalLight
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30,50,0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);
*/


//spotLight
const spotLight = new THREE.SpotLight(0xFFFFFF, 1);
scene.add(spotLight);
spotLight.position.x += 10;
spotLight.position.set(-100, 100, 0);
spotLight.decay = 0;
spotLight.castShadow = true;
spotLight.angle = 0.2;


const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//fog
scene.fog = new THREE.FogExp2(0xFFFFFF,0.005);

//backgroud
//renderer.setClearColor(0xFFEA00);
//scene.background = textureLoader.load(nuvolaris);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([nuvolaris,nuvolaris,nuvolaris,nuvolaris,nuvolaris,nuvolaris]);



//tools gui
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e)
});

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options,'speed',0,0.1);
gui.add(options,'angle',0,1);
gui.add(options,'penumbra',0,1);
gui.add(options,'intensity',0,1);

/*
//creazione di una sfera in mouse.pos quando clicco il mouse
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane2 = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("click", function (e) {
    //console.log('cliccato');
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane2.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane2, intersectionPoint);
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
          color: 0xffea00,
          metalness: 0,
          roughness: 0
        })
      );
    scene.add(sphereMesh);

    sphereMesh.position.copy(intersectionPoint);
  });
*/

// animazione box
let step = 0;
function animate(time) {
    //griglia e segnalini
    higlightMesh.material.opacity = 1 + Math.sin(time/120);
    objects.forEach(function(object){
        object.rotation.x = time/1000;
        object.rotation.z = time/1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time/1000));
    });

    // movimenti box
    box.rotation.x = time/1000;
    box.rotation.y = time/1000; 
    box2CentralObj.rotateY(0.01);
    box2.rotateX(0.05);

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    // tools
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity * Math.PI; // la moltiplicazione per PI è necessaria per il motivo spiegato qua: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733
    ambientLight.intensity = options.intensity * Math.PI;
   

   //helper luce
    sLightHelper.update();


    renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate);

//reshape window
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});
