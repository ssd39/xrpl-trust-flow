import { LiteGraph } from "litegraph.js";

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

// define the receivePayment function to trigger the output port and set its data
PaymentNode.prototype.receivePayment = function (paymentData) {
  // check if the input data is valid
  if (
    !paymentData ||
    !paymentData.TransactionType ||
    paymentData.TransactionType !== "Payment" ||
    !paymentData.Account ||
    !paymentData.Destination ||
    !paymentData.Amount ||
    !paymentData.Amount.currency ||
    !paymentData.Amount.value ||
    !paymentData.Amount.issuer
  ) {
    return;
  }

  // set the output data
  this.setOutputData(0, paymentData.Account);
  this.setOutputData(1, paymentData.Destination);
  this.setOutputData(2, paymentData.Amount.currency);
  this.setOutputData(3, paymentData.Amount.value);
  this.setOutputData(4, paymentData.Amount.issuer);

  // trigger the output port
  this.triggerSlot(0);
};

PaymentNode.prototype.onConnectionsChange = function () {
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

PaymentNode.title = "Payment Event";
PaymentNode.desc = "Payment Event";
PaymentNode.title_text_color = "#FFFFFF";

// register the custom node constructor
LiteGraph.registerNodeType("xrpl/payment_node", PaymentNode);
