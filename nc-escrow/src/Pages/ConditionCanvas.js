import "litegraph.js/css/litegraph.css";
import { LGraph, LGraphCanvas } from "litegraph.js";
import { useEffect, useRef, useState } from "react";
import CCHeader from "../Components/CCHeader";
import LGKeys from "../Components/LGKeys";
import RemoveNodes from "../Helpers/RemoveNodes";
import "../LGNodes/EscrowFinishNode"
import "../LGNodes/PaymentEventNode"
import "../LGNodes/NFTMintEventNode"
import "../LGNodes/WebhookNode"
import "../LGNodes/FetchNode"
import withAuth from "../Helpers/WithAuth";

export default withAuth(() => {

  const canvasRef = useRef();
  const [lgCanvas, setLgCanvas] = useState(null)
  const [lgGraph, setLgGraph] = useState(null)

  useEffect(() => {
    const graph = new LGraph();
    setLgGraph(graph)
    const canvas = new LGraphCanvas("#graph-canvas", graph);
    canvasRef.current.style.backgroundColor = "black";
    setLgCanvas(canvas)
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = "#39FF14";
    const onResize = () => {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      canvas.graph.setDirtyCanvas(true, true);
    };
    onResize();
    RemoveNodes()
    graph.start();
    window.addEventListener("resize", onResize);
    
    return () => window.removeEventListener("resize", onResize);
  }, []);


  return (
    <div>
      <LGKeys lgCanvas={lgCanvas} />
      <CCHeader lgGraph={lgGraph} />
      <canvas
        ref={canvasRef}
        className="w-full h-full top-0"
        id="graph-canvas"
      ></canvas>
    </div>
  );
});
