import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import scheduler from './scheduler'
import xrpl_worker from './data_workers/xrpl'
import PubSub from 'pubsub-js'
import cors from 'cors'
const escrow = require('./escrow/escrow');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected!'));


const app = express();
require('express-ws')(app);
app.use(cors())
app.use(bodyParser.json())
app.use('/escrow', escrow);

const port = process.env.PORT || 4001;

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

app.ws('/live_view/:escrowId', function(ws, req) {
    let escrowId = req.params.escrowId
    let token = null
    let tempId = `${makeid(6)}_${escrowId}`
    const onGraphUpdate = (msg, data) => {
        ws.send(data)
    }
    const onLatestGraph = (msg, data) => {
        ws.send(JSON.stringify({ action: 'graph_update', data: JSON.parse(data) }));
        PubSub.unsubscribe(token);
        token = PubSub.subscribe(`worker_${escrowId}`, onGraphUpdate);
    }

    token = PubSub.subscribe(`REQ_GRAPH_${tempId}`, onLatestGraph);

    PubSub.publish(`worker_gr_${escrowId}`, tempId);
    ws.on('close', () => {
        if (token) {
            PubSub.unsubscribe(token);
        }
    })
});

app.post("/webhook/:id", (req, res) => {
  let id = req.params.id
  if(id){
    PubSub.publish(`webhook/${id}`, JSON.stringify(req.body))
  }
  res.send("OK!");
});

app.get("/", (req, res) => {
    res.send("OK!");
});

app.listen(port, () => {
    console.log(`Api listening on port ${port}`);
    xrpl_worker.start()
    scheduler.run()
});