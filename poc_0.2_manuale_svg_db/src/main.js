import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener("DOMContentLoaded", function(event) {

    let products = [];
    var sidePanel = document.getElementById("side-panel");
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            console.log(products);
            products.forEach(element => {
                var label = document.createElement("label");
                label.textContent = element["nome"];
                sidePanel.appendChild(label);
            });
        })
        .catch(error => console.error('Error:', error));

    //perfectly works
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 0, 500);
    camera.lookAt(0, 0, 0);


    // Create a renderer
    var mainContent = document.getElementById("main-content");
    var canvas = document.getElementById("render_canvas");
    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor("#c9cdd2");
    mainContent.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.05; // Damping factor
    controls.screenSpacePanning = false;
    controls.minDistance = 300; // Minimum distance for zoom
    controls.maxDistance = 2500; // Maximum distance for zoom
    controls.minPolarAngle = Math.PI / 2.5; // Minimum polar angle
    controls.maxPolarAngle = Math.PI / 2.5; // Maximum polar angle

    // Load the SVG file


    function loadSVG(filename, filecontent) {
        const loader = new SVGLoader();
        const data = loader.parse(filecontent);
        const paths = data.paths;
        const group = new THREE.Group(); // Create a group to hold the SVG

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
                mesh.rotation.x = -Math.PI / 2; // Rotate the mesh to lie flat
                mesh.scale.set(0.3, 0.3, 0.3); // Make the SVG bigger
                group.add(mesh); // Add the mesh to our group

                // Make the first shape non-clickable
                mesh.userData.clickable = !(i === 0 && j === 0);
            }
        }

        console.log(group); // Log the group object
        console.log(paths); // Log the paths array

        const box = new THREE.Box3().setFromObject(group); // Get the bounding box of the group
        group.position.x -= box.getCenter(new THREE.Vector3()).x; // Center the group on the X axis   
        group.position.z -= box.getCenter(new THREE.Vector3()).z; // Center the group on the Y axis   

        scene.add(group); // Add the group to the scene

        console.log('SVG loaded successfully'); // Debug line
        animate();
    }



    document.getElementById("manualCreation").addEventListener("click", function() {
        document.getElementById("modalDimensions").style.display = "block";
    });

    document.getElementById("backButton").addEventListener("click", function() {
        document.getElementById("modalDimensions").style.display = "none";
    });

    document.getElementById("importSvg").addEventListener("click", function() {
        document.getElementById("svgModal").style.display = "block";
    });

    document.getElementById("backButtonSvg").addEventListener("click", function() {
        document.getElementById("svgModal").style.display = "none";
    });

    document.getElementById("svgFile").addEventListener("change", function(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function(event) {
            loadSVG(file["name"], event.target.result);
        };
        try {
            reader.readAsText(file);
            scene.clear();
            document.getElementById("svgModal").style.display = "none";
        } catch (e) {
            console.log(e);
        }
    });

    let dropArea = document.getElementById("dropArea");

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        console.log(`... file[${0}].name = ${file.name}`);
        let reader = new FileReader();
        reader.onload = function(event) {
            loadSVG(file["name"], event.target.result);
        };

        try {
            reader.readAsText(file);
            scene.clear();
            document.getElementById("svgModal").style.display = "none";
        } catch (e) {
            console.log(e);
        }
    }

    document.getElementById("searchbar").addEventListener("keyup", function() {
        
    });

    document.getElementById("submitDimensions").addEventListener("click", function() {
        let width = document.getElementById("dimension1").value;
        let height = document.getElementById("dimension2").value;
        document.getElementById("modalDimensions").style.display = "none";

        // Now you can use dimension1 and dimension2 to create the scene
        // Create a plane geometry for the house
        const geometry = new THREE.PlaneGeometry(width * 100, height * 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x72787f,
            side: THREE.DoubleSide
        });
        const house = new THREE.Mesh(geometry, material);
        house.rotation.x = -Math.PI / 2;

        scene.clear();
        scene.add(house);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update the controls
        renderer.render(scene, camera);
        camera.lookAt(0, 0, 0);
    }

    animate();
});