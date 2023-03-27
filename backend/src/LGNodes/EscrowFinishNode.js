
import { LiteGraph } from "litegraph.js";
import escrow from "../escrow/escrowmodel";
// Define custom node class
function EscrowFinishNode() {
  this.color = "#66CC66"; // green
  this.size = [120, 60];
  // Add input trigger port
  this.addInput("OnFinish", LiteGraph.ACTION);
}

EscrowFinishNode.prototype.onAction = async function () {
  if(this.escrowId=='one'){
    return;
  }
  const updatedEscrow = await escrow.findOneAndUpdate(
    { txid: this.escrowId },
    { status: true },
    { new: true } // return the updated document
  );
  if (updatedEscrow) {
  
    this.graph.stop()
  }
}

EscrowFinishNode.prototype.onAdded = async function () {
  /*var token = PubSub.subscribe('xrpl_transaction', (msg, data)=>{
    console.log(msg, data)
  });*/
}

EscrowFinishNode.title = "Escrow Finish";
EscrowFinishNode.desc = "Escrow Finish";
EscrowFinishNode.title_text_color = "#000000";

// Register custom node class with LiteGraph and place it under a "Custom" category in the menu
LiteGraph.registerNodeType("Escrow/EscrowFinish", EscrowFinishNode);
