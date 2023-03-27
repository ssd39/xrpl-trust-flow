const xrpl = require("xrpl");
import PubSub from "pubsub-js";

const start = async () => {
  try {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();
    const response = await client.request({
      command: "subscribe",
      streams: ["transactions"],
    });
    client.on("disconnected", () => {
      console.log("Disconnected!");
      start();
    });

    client.on("transaction", (tx) => {
      if (tx.status == "closed") {
        if (tx.transaction.TransactionType == "Payment") {
          const data = JSON.stringify({
            Account: tx.transaction.Account,
            Destination: tx.transaction.Destination,
            currency: tx.transaction.Amount.currency,
            value: tx.transaction.Amount.value || tx.transaction.Amount,
            issuer: tx.transaction.Amount.issuer,
          });
          PubSub.publish("xrpl/payment_node", data);
        } else if (tx.transaction.TransactionType == "NFTokenMint") {
          const data = JSON.stringify({
            Account: tx.transaction.Account,
            NFTokenTaxon: tx.transaction.NFTokenTaxon,
            URI: tx.transaction.URI,
            Issuer: tx.transaction.Issuer,
          });
          PubSub.publish("xrpl/nftmint_node", data);
        }
      }
    });
  } catch (e) {
    start();
    console.error(e);
  }
};

const xrpl_worker = {
  start,
};

export default xrpl_worker;
