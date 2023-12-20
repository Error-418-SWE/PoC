"use client";
import * as Three from 'three';
import { useEffect, useRef } from 'react';
import { render } from 'react-dom';

function ItemCard({id, nome, dimensione, peso}){

    const canvasRef = useRef();

    useEffect(() => {
        const scene = new Three.Scene();
        const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setClearColor("#3f3f3f", 1);

        const geometry = new Three.BoxGeometry(2,2,2);
        const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new Three.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();
    }, []);

    return (
        <div style = {{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            backgroundColor: "#0f0f0f",
            borderRadius: "0.5em",
            border: "1px solid white",
            padding: "0.5em",
            boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.75)",
        }}>
            <div style={{
                display:"grid",
                gridTemplateColumns: "1fr 1fr",
            }}>
                <label style={{ color: 'white' }}>ID</label>
                <label style={{ color: 'white'}}>{id}</label>
                <label style={{ color: 'white' }}>Nome</label>
                <label style={{ color: 'white' }}>{nome}</label>
                <label style={{ color: 'white' }}>Dimensione</label>
                <label style={{ color: 'white' }}>{dimensione}</label>
                <label style={{ color: 'white' }}>Peso</label>
                <label style={{ color: 'white' }}>{peso}</label>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', borderRadius: "0.5em" }}></canvas>
        </div>
    );

}

export default ItemCard;