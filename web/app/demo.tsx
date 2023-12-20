"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createShelf, ancorObjectCollisionColor, ancorObjectColor, gridOptions} from './shelf';
import * as dat from 'dat.gui';
import { render } from "react-dom";

function loadSVG(filename:string, filecontent:string): THREE.Group {
  const loader = new SVGLoader();
  const group = new THREE.Group(); // Create a group to hold the SVG
  
  const data = loader.parse(filecontent);
  const paths = data.paths;
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const shapes = path.toShapes(true);

    for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = "ground";
        mesh.rotation.x = -Math.PI / 2; // lo ruota leggermente per farlo sembrare in prospettiva
        mesh.scale.set(0.05, 0.05, 0.05); // scale serve a ridimensionare l'oggetto
        group.add(mesh);
    }
  }
  group.name = "ground";
  return group;
}

function App ({fileContent, fileName, manualCreation, setManualCreation}) {

  const mountRef = useRef(null);

  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 0, 60);
    camera.lookAt(0, 0, 0);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( "#F7EFE5", 1);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.05; // Damping factor
    controls.screenSpacePanning = false;
    controls.minDistance = 20; // Minimum distance for zoom
    controls.maxDistance = 80; // Maximum distance for zoom
    controls.minPolarAngle = Math.PI / 2.5; // Minimum polar angle
    controls.maxPolarAngle = Math.PI / 2.5; // Maximum polar angle

    // variabili per traking del mouse e il posizionamento dei box ancorati
    let notPlaced = false;
    var ancoredObject:any;
    const mousePosition = new THREE.Vector2();
    const intersectionPoint = new THREE.Vector3();
    const planeNormal = new THREE.Vector3();
    const plane2 = new THREE.Plane();
    const raycaster = new THREE.Raycaster();

    var plane:THREE.Mesh;
    var planeSide = 70;
    var gridHelper:THREE.GridHelper;

    var gui:dat.GUI;
    let isGridOn = true;
    let intersects;

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
    function hoverGround(intersects:any) {
      let isIntersectionFound = false;
      intersects.forEach(function(intersect:any){
          if(intersect.object.name === "ground"){
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

              ancoredObject.position.y += ancoredObject.geometry.parameters.height / 2 ;
          
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

    if(fileContent != null && fileName != null){
      setManualCreation(false);
      scene.clear();

      const svg_group = loadSVG(fileName, fileContent);

      const box = new THREE.Box3().setFromObject(svg_group);
      const center = box.getCenter(new THREE.Vector3());
      svg_group.position.x -= center.x;
      svg_group.position.z -= center.z;
    
        // Adjust the grid size to match the SVG
      const size = box.getSize(new THREE.Vector3());
      planeSide = Math.max(size.x, size.y);
      plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSide, planeSide), new THREE.MeshBasicMaterial({ color: 0xFFFFFf, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }));
      plane.name = "ground";
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = 0.1;
    
      var numberOfGridRows = planeSide / 10;
      gridHelper = new THREE.GridHelper(planeSide, numberOfGridRows);
      gridHelper.rotation.x = -0.5 * Math.PI;
      gridHelper.name = "ground";
      plane.add(gridHelper);
    
      plane.position.x += center.x;
      plane.position.z += center.z;
      svg_group.add(plane);

      scene.add(svg_group);
      renderer.render( scene, camera );
    }



    if(manualCreation){
      scene.clear();
      console.log("manual creation");
      //piano
      plane = new THREE.Mesh( new THREE.PlaneGeometry(planeSide , planeSide ), new THREE.MeshBasicMaterial( { color: 0xFFFFFf, side: THREE.DoubleSide} ) );
      plane.name = "ground";
      plane.position.y = 0.1;
      plane.rotation.x = -0.5 * Math.PI;


      //griglia
      var numberOfGridRows =  planeSide  / 10;
      gridHelper = new THREE.GridHelper(planeSide ,numberOfGridRows);
      gridHelper.rotation.x = -0.5 * Math.PI;
      gridHelper.name = "ground";
      plane.add(gridHelper);

      scene.add(plane);
    }

    renderer.setSize( window.innerWidth, window.innerHeight );
    if (mountRef.current) {
        (mountRef.current as HTMLElement).appendChild(renderer.domElement);
    }
    
    if(manualCreation || (fileContent != null && fileName != null)){
        var obj = { 
          "Crea scaffale":function(){ 
              const shelf = createShelf(boxDimensions.larghezza ,boxDimensions.altezza, boxDimensions.profondita, boxDimensions.piani, boxDimensions.colonne, boxDimensions.orientamento);
              notPlaced = true;
              ancoredObject = shelf;
              shelf.position.copy(getMouse3DPos());
              shelf.position.y += shelf.geometry.parameters.height / 2 ;
              scene.add(shelf);
          }
        }
      
        //tools gui
        // Aggiungi campi di input per larghezza, altezza e profondità nella GUI

        const boxDimensions = { larghezza: 2, altezza: 2, profondita: 2, piani: 2, colonne: 2, orientamento: "orizzontale"};
        //gui per scaffale
        gui = new dat.GUI();
        const folder = gui.addFolder("Dimensioni Scaffale");
        folder.add(boxDimensions, "larghezza", 1, 10).step(1).name("Larghezza");
        folder.add(boxDimensions, "altezza", 1, 10).step(1).name("Altezza");
        folder.add(boxDimensions, "profondita", 1, 10).step(1).name("Profondità");
        folder.add(boxDimensions, "piani", 1, 10).step(1).name("Piani");
        folder.add(boxDimensions, "colonne", 1, 10).step(1).name("Colonne");
        folder.add(boxDimensions, "orientamento", ["orizzontale", "verticale"]).name("Orientamento");
        folder.open();
        gui.add(obj,"Crea scaffale");

        var gridSize = gui.add( gridOptions, "GridSize", 0, 1).step(0.1).name("Grid Size").onChange(function(value){
          if(value === 0){
              plane.remove(gridHelper);
              isGridOn = false;
          }
          else{
              if(!isGridOn)isGridOn = true;
              numberOfGridRows =  planeSide / value;
              gridHelper.divisions = numberOfGridRows;
              plane.remove(gridHelper);
              gridHelper = new THREE.GridHelper(planeSide,numberOfGridRows);
              gridHelper.name = "ground"; 
              plane.add(gridHelper);
              gridHelper.rotation.x = -0.5 * Math.PI;
          }
      });

      gridSize.setValue(0.5);
    }

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
    window.addEventListener("keydown", function(e) {
        if (notPlaced){
            if (e.key === "Delete" || e.key === "Backspace" || e.key === "Escape" || e.button === 2)  {
                removeMouseAnchor();
            }
        }
    });
    
    window.addEventListener("mousedown", function(e) {
        if (notPlaced){
            if ( e.button === 2)  {
                removeMouseAnchor();
            }
        }
    });

    window.addEventListener('mousedown',function(){
      if(notPlaced){
          if(!checkCollision()){
              raycaster.setFromCamera(mousePosition,camera);
              intersects = raycaster.intersectObjects(scene.children);
              console.log(intersects);
              intersects.forEach(function(intersect){
                  if(intersect.object.name === "ground"){
                      const shelf = ancoredObject.clone();
                      scene.add(shelf);
                      removeMouseAnchor();                
                  }
              });
          }
      }
    });
    
    window.addEventListener("dblclick", function() {
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      for (let item of intersects) {
          if (item.object.name == "bin" && !notPlaced) {
              alert(item.object.userData.content);
              break;
          }
      }
    });

    var animate = function () {
      requestAnimationFrame( animate );
      controls.update();
      camera.lookAt(0, 0, 0);
      renderer.render( scene, camera );
    }

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => {
        if (mountRef.current) {
            if (mountRef.current as HTMLElement) {
                (mountRef.current as HTMLElement).removeChild(renderer.domElement);
            }
        }
    };
  }, [fileContent, fileName, manualCreation]);

  return (
    <div ref={mountRef}>
      
    </div>
  );
}

export default App;