import { LiteGraph, LGraphNode } from "litegraph.js";
import PubSub from "pubsub-js";


/**
 * @class WebhookNode
 * @extends LGraphNode
 */
function WebhookNode() {
  this.title = "Webhook";
  this.size = [250, 50];
  this.color = "#08a684";
  this.addOutput("On Call", LiteGraph.EVENT);
  // Add an output port named "data"
  this.addOutput("data", "string");

  this.webhookUrlInput = this.addWidget(
    "text",
    "Webhook URL",
    this.properties.webhookUrl
  );
}

WebhookNode.prototype.onRemoved = () => {
  if (this.token) {
    PubSub.unsubscribe(this.token);
  }
};

// Define the node behavior when added to the canvas
WebhookNode.prototype.onAdded = function () {
  let webhookId = this.properties.webhookUrl.split("/")
  this.token = PubSub.subscribe(`webhook/${webhookId[webhookId.length-1]}`, (msg, data) => {
    this.setOutputData(1, data);
    this.triggerSlot(0);
    PubSub.publish(`worker_${this.escrowId}`, JSON.stringify({
      id: this.id,
      1: data
    }))
  });
};



WebhookNode.title = "Webhook";
WebhookNode.desc = "Webhook";
WebhookNode.title_text_color = "#FFFFFF";

// Define the behavior when the webhook URL input is changed
WebhookNode.prototype.onData = function (value) {};

// Register custom node class with LiteGraph and place it under a "Custom" category in the menu
LiteGraph.registerNodeType("Oracles/webhook", WebhookNode);
