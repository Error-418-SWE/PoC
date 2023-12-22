import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const dimension = {
  x: 70,
  y: 70,
};
var plane: THREE.Mesh;
var gridHelper: THREE.GridHelper;

function setGridSize(value: number = 0) {
  if (value === 0) {
    if (plane) plane.remove(gridHelper);
  } else {
    const numberOfGridRows = dimension.x / value;
    if (gridHelper) {
      gridHelper.dispose();
      plane.remove(gridHelper);
    }
    gridHelper = new THREE.GridHelper(dimension.x, numberOfGridRows);
    gridHelper.divisions = numberOfGridRows;
    gridHelper.name = "ground";
    gridHelper.rotation.x = -0.5 * Math.PI;
    plane.add(gridHelper);
  }
}

function loadSVG(filecontent: string): THREE.Group {
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
        depthWrite: false,
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

function createBasicGround() {
  const ground = new THREE.Group();
  ground.name = "ground";
  plane = new THREE.Mesh(
    new THREE.PlaneGeometry(dimension.x, dimension.y),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  plane.name = "ground";
  plane.position.y = 0.1;
  plane.rotation.x = -0.5 * Math.PI;
  setGridSize(0);
  ground.add(plane);

  return ground;
}

function createGroundWithSVG(fileContent: string) {
  const ground = new THREE.Group();
  ground.name = "ground";
  const svg_group = loadSVG(fileContent);
  svg_group.name = "ground";

  const box = new THREE.Box3().setFromObject(svg_group);
  const center = box.getCenter(new THREE.Vector3());
  svg_group.position.x -= center.x;
  svg_group.position.z -= center.z;

  const size = box.getSize(new THREE.Vector3());
  dimension.x = size.x;
  dimension.y = size.z;
  const planeGeometry = new THREE.PlaneGeometry(dimension.x, dimension.y);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });

  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.name = "ground";
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = 0.1;
  plane.position.x += center.x;
  plane.position.z += center.z;

  ground.add(svg_group);
  svg_group.add(plane);
  setGridSize(0);
  return ground;
}

export default {
  createBasicGround,
  createGroundWithSVG,
  setGridSize,
};
