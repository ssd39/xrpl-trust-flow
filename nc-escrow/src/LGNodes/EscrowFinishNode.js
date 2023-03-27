import { LiteGraph } from "litegraph.js";
// Define custom node class
function EscrowFinishNode() {
  this.color = "#66CC66"; // green
  this.size = [120, 60];
  // Add input trigger port
  this.addInput("OnFinish", LiteGraph.ACTION);
}

EscrowFinishNode.title = "Escrow Finish";
EscrowFinishNode.desc = "Escrow Finish";
EscrowFinishNode.title_text_color = "#000000";

EscrowFinishNode.prototype.onConnectionsChange = function () {

  // loop through all the input connections
  for (var i = 0; i < this.inputs.length; i++) {
    var input = this.inputs[i];
    if (!input || !input.link) {
      continue;
    }
    // get the origin node of the connected link
    var link = this.graph.links[input.link];
    link.color = "red";
  }
};

// Register custom node class with LiteGraph and place it under a "Custom" category in the menu
LiteGraph.registerNodeType("Escrow/EscrowFinish", EscrowFinishNode);
