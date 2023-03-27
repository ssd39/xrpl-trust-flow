import { LiteGraph } from "litegraph.js";
function FetchNode() {
 
  // Define input and output ports
  this.addInput("On Request", LiteGraph.ACTION);
  this.addInput("url", "string");
  this.addInput("header", "string");
  this.addInput("body", "string");
  this.addOutput("On Response", LiteGraph.EVENT);
  this.addOutput("data", "string");


}

FetchNode.title = "Fetch";
FetchNode.desc = "Fetch";

// Register the node type with LiteGraph.js
LiteGraph.registerNodeType("Oracles/fetch", FetchNode);
