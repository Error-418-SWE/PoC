"use client";

export default function SplashScreen() {
  return (
    <div id="splashScreen"
      style={{
        display: "flex",
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        position: "absolute",
      }}

      onClick={function() {
        document.getElementById("splashScreen").style.display = "none";
      }}
    >
      <h1>WMS3</h1>
      <p>
        Produced by Error_418
      </p>
      <canvas id="canvas_sample" style={{
        width: "30%",
        height: "30%",
      }}>
      </canvas>
    </div>
  );
}
