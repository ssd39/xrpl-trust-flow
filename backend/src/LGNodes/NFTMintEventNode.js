import { LiteGraph } from "litegraph.js";
import PubSub from "pubsub-js";

function NFTMintNode() {
  this.color = "#08a684";
  // add an output trigger port
  this.addOutput("On Mint", LiteGraph.EVENT);

  this.addOutput("NFTokenTaxon", "number");

  this.addOutput("Account", "string");

  this.addOutput("Issuer", "string");

  this.addOutput("URI", "string");
}


NFTMintNode.prototype.onRemoved = () => {
  if (this.token) {
    PubSub.unsubscribe(this.token);
  }
};

NFTMintNode.prototype.onAdded = async function () {
  const onData = (msg, data) => {
    data = JSON.parse(data)
    
    this.setOutputData(1, data.NFTokenTaxon || "");
    this.setOutputData(2, data.Account || "");
    this.setOutputData(3, data.Issuer || "");
    this.setOutputData(4, data.URI || "");
    this.triggerSlot(0);
    PubSub.publish(`worker_${this.escrowId}`, JSON.stringify({
      id: this.id,
      1: data.NFTokenTaxon || "",
      2: data.Account || "",
      3: data.Issuer || "",
      4: data.URI || ""
    }))
  };
  this.token = PubSub.subscribe("xrpl/nftmint_node", onData);
};

NFTMintNode.title = "NFT Mint Event";
NFTMintNode.desc = "NFT Mint Event";
NFTMintNode.title_text_color = "#FFFFFF";

// register the custom node constructor
LiteGraph.registerNodeType("xrpl/nftmint_node", NFTMintNode);
