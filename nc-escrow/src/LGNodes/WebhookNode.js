import { LiteGraph, LGraphNode } from "litegraph.js";
import SpinnerWidget from "../LGCustomWidgets/Spinner";

/**
 * @class WebhookNode
 * @extends LGraphNode
 */
function WebhookNode() {
  // Set the node title and size
  this.title = "Webhook";
  this.size = [250, 50];
  this.color = "#08a684";

  this.addCustomWidget(SpinnerWidget);
  this.addWidget("spinner");
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
  }
  return result;
}

// Define the node behavior when added to the canvas
WebhookNode.prototype.onAdded = function () {
  // Call the API to get the webhook URL
  /*fetch("http://your-api-url.com/")
    .then((response) => response.json())
    .then((data) => {

    })
    .catch((error) => {
        alert("Error while creating webhook endpoint!")
    });*/

  setTimeout(() => {
    this.widgets[0].isStarted = false
    this.widgets = [];
    this.addOutput("On Call", LiteGraph.EVENT);
    // Add an output port named "data"
    this.addOutput("data", "string");
    // Add an input field for the webhook URL
    this.properties.webhookUrl = process.env.REACT_APP_API_ENDPOINT + "/webhook/" + makeid(8)
    this.webhookUrlInput = this.addWidget(
      "text",
      "Webhook URL",
      this.properties.webhookUrl
    );
    this.size = [300, 80];
    this.setDirtyCanvas(true, true);
  }, [3000]);
};

WebhookNode.prototype.onConnectionsChange = function () {
  var output = this.outputs[0];
  if (!output || !output.links) {
    return;
  }
  for (let linkId of output.links) {
    // get the origin node of the connected link
    var link = this.graph.links[linkId];
    link.color = "#A020F0";
  }
};

WebhookNode.title = "Webhook";
WebhookNode.desc = "Webhook";
WebhookNode.title_text_color = "#FFFFFF";

// Define the behavior when the webhook URL input is changed
WebhookNode.prototype.onData = function (value) {};

// Register custom node class with LiteGraph and place it under a "Custom" category in the menu
LiteGraph.registerNodeType("Oracles/webhook", WebhookNode);
