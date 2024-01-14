"use client";
import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { createShelf } from "./shelf";

export var shelf;
var scene = null;
var camera = null;
var renderer = null;
var controls = null;
var animating = false;

const ModalShelf = ({ showShelfModal, hideShelfModal, setShelfDimensions }) => {
  useEffect(() => {
    console.log("modalShelf");
    var canvas = document.getElementById("currentShelf") as HTMLCanvasElement;

    function createCamera() { 
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        5000
      );
      camera.position.set(0, -5, 12);
      camera.lookAt(0, 0, 0);
      return camera;
    }

    function createRenderer() {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });
      renderer.setClearColor(0xf5f5f5);
      renderer.setSize(canvas.width, canvas.height * 1.2);
      return renderer;
    }

    function createControls(camera: THREE.Camera, renderer: THREE.Renderer) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // Enable damping (inertia)
      controls.dampingFactor = 0.05; // Damping factor
      controls.screenSpacePanning = false;
      controls.minDistance = 10; // Minimum distance for zoom
      controls.maxDistance = 80; // Maximum distance for zoom
      controls.minPolarAngle = Math.PI / 2.5; // Minimum polar angle
      controls.maxPolarAngle = Math.PI / 2.5; // Maximum polar angle

      controls.enablePan = false;

      return controls;
    }

    scene = new THREE.Scene();
    camera = createCamera();
    renderer = createRenderer();
    controls = createControls(camera, renderer);


    function updateShelf() {
      scene.clear();
      shelf = createShelf(
        document.getElementById("sldLarghezza")?.value,
        document.getElementById("sldAltezza")?.value,
        document.getElementById("sldProfondita")?.value,
        document.getElementById("sldPiani")?.value,
        document.getElementById("sldColonne")?.value,
        document.getElementById("orientamento")?.value
      );

      scene.add(shelf);
    }

    updateShelf();

    var sliderContainer = document.getElementById("sliderContainer");
    for (var slider of sliderContainer.children) {
      slider.addEventListener("input", updateShelf);
    }

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      camera.lookAt(0, 0, 0);
    };

    animate();
  }, []);

  return (
    <div
      style={{
        display: showShelfModal ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0, 0.4)",
      }}
    >
      <div
        className="modal-content"
        style={{
          display: "grid",
          width: "30%",
          height: "40%",
          backgroundColor: "white",
          borderRadius: "2em",
          padding: "20px",
          rowGap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <canvas
              id="currentShelf"
              style={{
                heigth: "100%",
                border: "1px solid black",
                borderRadius: "2em",
                paddingTop: "10px",
              }}
            ></canvas>
          </div>
          <div
            id="sliderContainer"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <label>Altezza</label>
            <input type="range" min="1" max="10" id="sldAltezza"></input>
            <label>Larghezza</label>
            <input type="range" min="1" max="10" id="sldLarghezza"></input>
            <label>Profondità</label>
            <input type="range" min="1" max="10" id="sldProfondita"></input>
            <label>Piani</label>
            <input type="range" min="1" max="10" id="sldPiani"></input>
            <label>Colonne</label>
            <input type="range" min="1" max="10" id="sldColonne"></input>
            <label>Orientamento</label>
            <select id="orientamento">
              <option value="orizzontale">Orizzontale</option>
              <option value="verticale">Verticale</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <button onClick={hideShelfModal} style={{ color: "black" }}>
            BACK
          </button>
          <button style={{ color: "black" }} onClick={
            function () {
              setShelfDimensions({
                altezza: document.getElementById("sldAltezza")?.value,
                larghezza: document.getElementById("sldLarghezza")?.value,
                profondita: document.getElementById("sldProfondita")?.value,
                piani: document.getElementById("sldPiani")?.value,
                colonne: document.getElementById("sldColonne")?.value,
                orientamento: document.getElementById("orientamento")?.value
              });
              hideShelfModal();
            }
          }>
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalShelf;
