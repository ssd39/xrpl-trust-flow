import { useEffect } from "react"
import LiteGraph from 'litegraph.js';


/**
 * @param {Object} data
 * @param {HTMLElement} data.canvasRef
 * @param {LiteGraph.LGraphCanvas} data.lgCanvas
 */
export default ({ lgCanvas}) => {
    useEffect(()=>{
        if(lgCanvas){
            const onKey = (e) =>{
                if (e.keyCode== 46){
                    if(lgCanvas){
                        lgCanvas.deleteSelectedNodes()
                    }
                }
            }
            window.addEventListener('keydown', onKey);
            return () => window.removeEventListener('keydown', onKey)
        }
               
    }, [lgCanvas])
    return(
        <div className="absolute -z-50"></div>
    )
}