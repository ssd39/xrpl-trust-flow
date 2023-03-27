import "../LGNodes/EscrowFinishNode"
import "../LGNodes/PaymentEventNode"
import "../LGNodes/NFTMintEventNode"
import "../LGNodes/WebhookNode"
import "../LGNodes/FetchNode"
import  worker from '../worker'
import testData from '../graph.json'
import escrow from "../escrow/escrowmodel"
import escmod from "../escrow/Escmod"

const run = async () => {
  worker.start({escrowId:'one', condition: testData})
  const data = await escrow.find({ status: false })
  for(let d of data){
    try {
      const m =  await escmod.findById(d.nodeid)
      worker.start({ escrowId: d.txid , condition: m.model });
    } catch (e) {
      console.error(`Scheduler Error: ${e}`);//aa
    }
  }
};

const scheduler = {
  run,
};

export default scheduler;
