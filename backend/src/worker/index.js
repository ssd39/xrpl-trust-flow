import LiteGraph from "litegraph.js";
import PubSub from "pubsub-js";

const start = async ({ escrowId, condition }) => {
  const graph = new LiteGraph.LGraph();

  let token;

  const onLatestGraphReq = (msg, data) => {
    if (data == "CLOSE") {
      PubSub.unsubscribe(token);
    } else {
      PubSub.publish(`REQ_GRAPH_${data}`, JSON.stringify(graph.serialize()));
    }
  };

  token = PubSub.subscribe(`worker_gr_${escrowId}`, onLatestGraphReq);

  graph.onNodeAdded = (node) => {
    node.escrowId = escrowId;
  };
  graph.configure(condition);

  graph.start();
};

const worker = {
  start,
};

export default worker;
