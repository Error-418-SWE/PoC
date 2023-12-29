"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import groundHandler from "./ground";

import {
  createShelf,
} from "./shelf";

var renderer: THREE.Rendere;
var controls: OrbitControls;

import React from "react";

export default function SplashScreen(): React.JSX.Element {
  useEffect(() => {
    var canvas = document.getElementById("canvas_sample") as HTMLCanvasElement;

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
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
      renderer.setClearColor(0xf5f5f5);
      renderer.setSize(canvas.width * 1.5, canvas.height * 1.5);
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

      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableRotate = false;

      return controls;
    }

    const scene = new THREE.Scene();
    const camera = createCamera();
    renderer = createRenderer();
    controls = createControls(camera, renderer);

    const ground = groundHandler.createBasicGround();
    groundHandler.setGroundColor(0xffffff);
    ground.scale.set(0.9, 0.9, 0.9);
    groundHandler.setGridSize(2);

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var shelf = createShelf(5, (i + 2) * 2, 6, 5, 5, "orrizzontale", true);
        shelf.scale.set(1.8, 1.8, 1.8);
        shelf.position.set(20 * (i - 1), (i + 2) * 2, 20 * (j - 1));
        shelf.material.visible = false;
        ground.add(shelf);
      }
    }
    scene.add(ground);

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      camera.lookAt(0, 0, 0);

      ground.rotation.y += 0.005;
    };

    animate();
  });
 
  return (
    <div
      id="splashScreen"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#f5f5f5",
        position: "absolute",
        zIndex: 1,
      }}
      onClick={function () {
        renderer.dispose();
        controls.dispose();
        document.getElementById("splashScreen").style.display = "none";
      }}
    >
      <h1>WMS3</h1>
      <p>Concept by Error_418</p>
      <canvas
        id="canvas_sample"
        style={{
          marginTop: "2%",
        }}
      ></canvas>
      <p style={{
        marginTop: "2%",
      }}>Tap to access the Demo</p>
    </div>
  );
}
