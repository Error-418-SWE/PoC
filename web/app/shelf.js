import * as THREE from "three";

export const ancorObjectColor = 0xbe7363; // Colore del box scaffale
export const ancorObjectCollisionColor = 0xff0000; // Colore del box ancorato in caso di collisione

export const gridOptions = {
  GridSize: 1,
};

const stuff = [
  "rasoio elettrico",
  "televisore",
  "smartphone",
  ["televisione, playstation"],
  ["mouse", "tastiera"],
  "macchina fotografica",
  "telecamera",
  "cuscino"
];

//creazione scaffale
export function createShelf(
  width,
  height,
  depth,
  planes,
  columns,
  orientamento,
  toPopulate
) {
  if (planes > height - 1)
    //i piani devono essere max altezza - 1
    planes = height - 1;
  //if (columns > width) columns = width;
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: ancorObjectColor,
    transparent: true,
    opacity: 0.4,
  });
  const shelf = new THREE.Mesh(boxGeometry, boxMaterial);
  const edges = new THREE.EdgesGeometry(boxGeometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xa9a9a9, linewidth: 2 })
  );
  shelf.add(line);

  const step = (height - 1) / planes;
  let yPlane = -height / 2 + 0.08; // il piano viene posizionato alla creazione nel punto 0,0,0 relativo a suo padre(lo scaffale), quindi per portarlo in basso allo scaffale imposto un'altezza pari a - altezzascaffale/2.
  for (let i = 0; i < planes; i++) {
    const planeGeometry = new THREE.PlaneGeometry(width, depth);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xd2b48c,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "plane";
    plane.rotation.x = Math.PI / 2;

    shelf.add(plane);
    plane.position.y = yPlane;

    //creazione bin
    const binHeight = step - 0.2;
    const binDepth = depth - 0.4;
    const binWidth = width / columns - 0.1;

    const stepX = width / columns;
    let xBin = -width / 2 + binWidth / 2; //binWidth/2 gap per buttare dentro il bin
    for (let j = 0; j < columns; j++) {
      //nela geomeria dei bin altezza e profondità sono invertite, in modo da inserirsi verticalmente nello scaffale con la funzione add (che normalmente fa rotazioni esotiche)
      const binGeometry = new THREE.BoxGeometry(binWidth, binHeight, binDepth);
      const binMaterial = new THREE.MeshBasicMaterial({ color: 0x4169e1 });
      binGeometry.name = "bin";
      binMaterial.name = "bin";

      let bin = new THREE.Mesh(binGeometry, binMaterial);
      bin.name = "bin";

      //bordi bin
      const bedges = new THREE.EdgesGeometry(binGeometry);
      const bline = new THREE.LineSegments(
        bedges,
        new THREE.LineBasicMaterial({ color: 0x111111 })
      );
      bin.add(bline);
      //merce random
      if (toPopulate) {
        let m = Math.floor(Math.random() * stuff.length) + 2;
        if (m < stuff.length) {
          bin.userData = { content: stuff[m] };
          binMaterial.color.setHex(0x4169e1);
        }else {
          binMaterial.color.setHex(0x5f5f5f);
          binMaterial.transparent = true;
          binMaterial.opacity = 0.5;
        }
      }else {
        binMaterial.color.setHex(0x5f5f5f);
        binMaterial.transparent = true;
        binMaterial.opacity = 0.5;
      }

      plane.add(bin);

      //rotazione di 90 necessaria, il piano su sui viene applicato è stato anche egli ruotato
      //poichè il bin è ruotato, bisogna considerare l'altezza(y) come profondita(z) e viceversa
      bin.rotation.x = Math.PI / 2; //ok
      bin.position.z = -step / 2; //ok

      bin.position.x = xBin;
      xBin += stepX;
    }

    yPlane += step;
  }

  shelf.name = "shelf";
  if (orientamento == "verticale") shelf.rotation.y = Math.PI / 2;
  return shelf;
}
