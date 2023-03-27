import { LiteGraph } from "litegraph.js";

function NFTMintNode() {
  this.color = "#08a684";
  // add an output trigger port
  this.addOutput("On Mint", LiteGraph.EVENT);

  this.addOutput("NFTokenTaxon", "number");

  this.addOutput("Account", "string");

  this.addOutput("Issuer", "string");

  this.addOutput("URI", "string");
}

// define the receivePayment function to trigger the output port and set its data
NFTMintNode.prototype.nftMint = function (paymentData) {

  // set the output data
 /* this.setOutputData(0, paymentData.Account);
  this.setOutputData(1, paymentData.Destination);
  this.setOutputData(2, paymentData.Amount.currency);
  this.setOutputData(3, paymentData.Amount.value);
  this.setOutputData(4, paymentData.Amount.issuer);*/

  // trigger the output port
  this.triggerSlot(0);
};

NFTMintNode.prototype.onConnectionsChange = function () {
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

NFTMintNode.title = "NFT Mint Event";
NFTMintNode.desc = "NFT Mint Event";
NFTMintNode.title_text_color = "#FFFFFF";

// register the custom node constructor
LiteGraph.registerNodeType("xrpl/nftmint_node", NFTMintNode);
