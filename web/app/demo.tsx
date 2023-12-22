"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {
  createShelf,
  ancorObjectCollisionColor,
  ancorObjectColor,
  gridOptions,
} from "./shelf";

import groundHandler from "./ground";


function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.set(0, 0, 60);
  camera.lookAt(0, 0, 0);
  return camera;
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#F7EFE5", 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function createControls(camera: THREE.Camera, renderer: THREE.Renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable damping (inertia)
  controls.dampingFactor = 0.05; // Damping factor
  controls.screenSpacePanning = false;
  controls.minDistance = 20; // Minimum distance for zoom
  controls.maxDistance = 80; // Maximum distance for zoom
  controls.minPolarAngle = Math.PI / 2.5; // Minimum polar angle
  controls.maxPolarAngle = Math.PI / 2.5; // Maximum polar angle

  return controls;
}

// Funzione per verificare collisioni con altri oggetti
function checkCollision(scene: THREE.Scene, ancoredObject: any) {
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

const scene = new THREE.Scene();
var camera: THREE.Camera;
var renderer: THREE.Renderer;
var controls: any;

var ground: THREE.Group;

// variabili per traking del mouse e il posizionamento dei box ancorati
let notPlaced = false;
var ancoredObject: any;
const mousePosition = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

let isGridOn = true;
let intersects;

var gui = null;
// var clock = new THREE.Clock();

function removeMouseAnchor(scene: THREE.Scene, ancoredObject: any) {
  notPlaced = false;
  scene.remove(ancoredObject);
}

function App({ fileContent, fileName, manualCreation }) {
  const mountRef = useRef(null);

  //+++++++++++++++++++++++++++++++++++UTILITIES+++++++++++++++++++++++++++++++++++++++++++++++

  // funzione che ritorna una posizione nell'ambiente di lavoro (3d) data la posizione del mouse (2d)
  function getMouse3DPos() {
    const planeNormal = new THREE.Vector3();
    const plane2 = new THREE.Plane();

    planeNormal.copy(camera.position).normalize();
    plane2.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane2, intersectionPoint);
    return intersectionPoint;
  }

  // funzione che posiziona ancoredObject alla posizione corrispondente nel piano se si passa con il mouse sopra ad esso
  function hoverGround(intersects: any) {
    let isIntersectionFound = false;
    intersects.forEach(function (intersect: any) {
      if (intersect.object.name === "ground") {
        if (isGridOn) {
          ancoredObject.position
            .copy(intersect.point)
            .divideScalar(gridOptions.GridSize)
            .floor()
            .multiplyScalar(gridOptions.GridSize);
          //correzione posizionamento lunghezza dispari
          if (ancoredObject.geometry.parameters.width % 2 !== 0) {
            ancoredObject.position.x -=
              (ancoredObject.geometry.parameters.width / 2) %
              gridOptions.GridSize;
          }

          //correzione posizionamento profondità dispari
          if (ancoredObject.geometry.parameters.depth % 2 !== 0) {
            ancoredObject.position.z -=
              (ancoredObject.geometry.parameters.depth / 2) %
              gridOptions.GridSize;
          }
        } else {
          ancoredObject.position.copy(intersect.point);
        }

        ancoredObject.position.y +=
          ancoredObject.geometry.parameters.height / 2;

        ancoredObject.material.color.setHex(
          checkCollision(scene, ancoredObject)
            ? ancorObjectCollisionColor
            : ancorObjectColor
        );

        isIntersectionFound = true;
        return isIntersectionFound;
      }
    });
    return isIntersectionFound;
  }

  function createGui() {
    const dat = require("dat.gui");
    //gui per scaffale
    if (gui) gui.destroy();
    gui = new dat.GUI();

    const boxDimensions = {
      larghezza: 2,
      altezza: 2,
      profondita: 2,
      piani: 2,
      colonne: 2,
      orientamento: "orizzontale",
    };

    var obj = {
      "Crea scaffale": function () {
        const shelf = createShelf(
          boxDimensions.larghezza,
          boxDimensions.altezza,
          boxDimensions.profondita,
          boxDimensions.piani,
          boxDimensions.colonne,
          boxDimensions.orientamento
        );
        notPlaced = true;
        ancoredObject = shelf;
        shelf.position.copy(getMouse3DPos());
        shelf.position.y += shelf.geometry.parameters.height / 2;
        scene.add(shelf);
      },
    };

    const folder = gui.addFolder("Dimensioni Scaffale");
    folder.add(boxDimensions, "larghezza", 1, 10).step(1).name("Larghezza");
    folder.add(boxDimensions, "altezza", 1, 10).step(1).name("Altezza");
    folder.add(boxDimensions, "profondita", 1, 10).step(1).name("Profondità");
    folder.add(boxDimensions, "piani", 1, 10).step(1).name("Piani");
    folder.add(boxDimensions, "colonne", 1, 10).step(1).name("Colonne");
    folder
      .add(boxDimensions, "orientamento", ["orizzontale", "verticale"])
      .name("Orientamento");
    folder.open();
    gui.add(obj, "Crea scaffale");

    var gridSize = gui
      .add({ GridSize: 1 }, "GridSize", 0, 1)
      .step(0.1)
      .name("Grid Size")
      .onChange(function (value: any) {
        groundHandler.setGridSize(value);
      });
    gridSize.setValue(0);
  }

  useEffect(() => {
    camera = createCamera();
    renderer = createRenderer();
    controls = createControls(camera, renderer);

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    

    animate();

    if (mountRef.current) {
      (mountRef.current as HTMLElement).appendChild(renderer.domElement);
    }

    // se si preme backspace, canc, esc o il tasto destro del mouse viene rimossa l'ancora
    window.addEventListener("keydown", function (e) {
      if (notPlaced) {
        if (e.key === "Delete" || e.key === "Backspace" || e.key === "Escape") {
          removeMouseAnchor(scene, ancoredObject);
        }
      }
    });

    window.addEventListener("mousedown", function (e) {
      if (notPlaced) {
        if (e.button === 2) {
          removeMouseAnchor(scene, ancoredObject);
        }
      }
    });

    // allo spostamento del mouse:
    window.addEventListener("mousemove", function (e) {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (notPlaced) {
        raycaster.setFromCamera(mousePosition, camera);
        intersects = raycaster.intersectObjects(scene.children);
        if (hoverGround(intersects)) {
          return;
        }
        ancoredObject.position.copy(getMouse3DPos());
      }
    });

    window.addEventListener("mousedown", function () {
      if (notPlaced && ancoredObject) {
        console.log("mouse down");
        if (!checkCollision(scene, ancoredObject)) {
          console.log("collisione");
          raycaster.setFromCamera(mousePosition, camera);
          intersects = raycaster.intersectObjects(scene.children);
          intersects.forEach(function (intersect) {
            if (intersect.object.name === "ground") {
              console.log("ground toccato");
              const shelf = ancoredObject.clone();
              scene.add(shelf);
              shelf.material.visible = false;
              removeMouseAnchor(scene, ancoredObject);
            }
          });
        }
      }
    });

    window.addEventListener("dblclick", function () {
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      for (let item of intersects) {
        if (item.object.name == "bin" && !notPlaced) {
          alert(item.object.userData.content);
          break;
        }
      }
    });

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    return () => {
      if (mountRef.current) {
        if (mountRef.current as HTMLElement) {
          (mountRef.current as HTMLElement).removeChild(renderer.domElement);
        }
      }
    };
  });

  useEffect(() => {
    if (manualCreation || fileContent != null) {
      console.log("ECCOMI QUI");
      scene.clear();

      ground = manualCreation
        ? groundHandler.createBasicGround()
        : groundHandler.createGroundWithSVG(fileContent);

      scene.add(ground);
      createGui();
    }
  }, [manualCreation, fileContent]);

  return <div ref={mountRef}></div>;
}

export default App;
