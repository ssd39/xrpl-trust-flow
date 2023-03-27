import { LiteGraph } from "litegraph.js";
import PubSub from "pubsub-js";

function PaymentNode() {
  this.color = "#08a684";
  // add an output trigger port
  this.addOutput("On Receive", LiteGraph.EVENT);

  // add an output port for the account
  this.addOutput("Account", "string");

  // add an output port for the destination
  this.addOutput("Destination", "string");

  // add an output port for the currency
  this.addOutput("Currency", "string");

  // add an output port for the value
  this.addOutput("Value", "number");

  // add an output port for the issuer
  this.addOutput("Issuer", "string");
}

PaymentNode.prototype.onRemoved = () => {
  if (this.token) {
    PubSub.unsubscribe(this.token);
  }
};

PaymentNode.prototype.onAdded = async function () {
  const onData = (msg, data) => {
    data = JSON.parse(data)
    // set the output data
    console.log(data)
    this.setOutputData(1, data.Account || "");
    this.setOutputData(2, data.Destination || "");
    this.setOutputData(3, data.currency || "");
    this.setOutputData(4, data.value || 0);
    this.setOutputData(5, data.issuer || "");

    // trigger the output port
    this.triggerSlot(0);

    PubSub.publish(`worker_${this.escrowId}`, JSON.stringify({
      id: this.id,
      1: data.Account || "",
      2: data.Destination || "",
      3: data.currency || "",
      4: data.value || 0,
      5: data.issuer || ""
    }))

  };
  this.token = PubSub.subscribe("xrpl/payment_node", onData);
};

PaymentNode.title = "Payment Event";
PaymentNode.desc = "Payment Event";
PaymentNode.title_text_color = "#FFFFFF";

// register the custom node constructor
LiteGraph.registerNodeType("xrpl/payment_node", PaymentNode);
