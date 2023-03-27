import { LiteGraph } from "litegraph.js";
import fetch from "node-fetch";
import PubSub from "pubsub-js";

function FetchNode() {
  // Define input and output ports
  this.addInput("On Request", LiteGraph.ACTION);
  this.addInput("url", "string");
  this.addInput("header", "string");
  this.addInput("body", "string");
  this.addOutput("On Response", LiteGraph.EVENT);
  this.addOutput("data", "string");

  this.size = [230, 100];
}

FetchNode.prototype.onAction = async function () {
  try {
    var url = this.getInputData(1); // get the current value of the "url" input port
    var header = this.getInputData(2); // get the current value of the "header" input port
    var body = this.getInputData(3); // get the current value of the "body" input port
    if (!url) {
      return;
    }

    const opt = {};

    if (header) {
      opt["headers"] = JSON.parse(header);
    }
    if (body) {
      opt["body"] = JSON.parse(body);
      opt["method"] = "POST";
    }
    const response = await fetch(url, opt);
    // Trigger the output event and send the response data
    const txtOut = await response.text();

    this.setOutputData(1, txtOut);
    this.trigger(0);
    PubSub.publish(
      `worker_${this.escrowId}`,
      JSON.stringify({
        id: this.id,
        1: txtOut || "",
      })
    );
  } catch (e) {
  }
};

FetchNode.title = "Fetch";
FetchNode.desc = "Fetch";

// Register the node type with LiteGraph.js
LiteGraph.registerNodeType("Oracles/fetch", FetchNode);
