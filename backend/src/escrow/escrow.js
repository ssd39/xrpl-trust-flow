const express = require("express");
const router = express.Router();
const Escrowc = require("./escrowmodel");
const nodec = require("./Escmod");
import worker from "../worker";

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/", (req, res) => {
  res.send("Birds home page");
});
// define the about route
router.post("/newescrow", async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    const es = new Escrowc({
      creator: data.creator,
      receiver: data.receiver,
      condition: data.condition,
      conditionSolution: data.solution,
      amount: parseInt(data.amount),
      nodeid: data.nodeid,
      txid: data.txid,
      sequence: data.sequence,
      status: false,
      past: false
    });
    await es.save();
    const model = await nodec.findById(data.nodeid);
    worker.start({escrowId: data.txid, condition: model.model})
    res.json({ status: true });
  } catch (e) {
    console.log(e);
    res.json({ status: false });
  }
});

router.get('/claimed/:escrowid', async(req, res) => {
  try {
      const escrow = await Escrowc.findOne({ txid: req.params.escrowid });
      if (!escrow) {
          return res.status(404).json({ message: 'Escrow not found' });
      }
      escrow.past = true
      await escrow.save();
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/newnode", async (req, res) => {
  try {
    let data = req.body;
    const es = new nodec({
      creator: data.creator,

      name: data.name,
      model: data.model,
    });
    await es.save();
    res.json({ status: true });
  } catch (e) {
    console.log(e);
    res.json({ status: false });
  }
});

router.get("/escmod/:creator", async (req, res) => {
  const creator = req.params.creator;
  try {
    const results = await nodec.find({ creator: creator });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/escrows', async (req, res) => {
  try {
    const query = {};
    if (req.query.creator) {
      query.creator = req.query.creator;
    }
    if (req.query.status !== undefined) {
      query.past = req.query.status;
    }
    const escrows = await Escrowc.find(query);
    const filteredEscrows = escrows.map((escrow) => {
      if (!escrow.status) {
        // If the status is false, remove the `conditionSolution` field from the escrow object
        const { conditionSolution, ...rest } = escrow._doc;
        return rest;
      }
      return escrow;
    });
    return res.json(filteredEscrows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/escrow/:escrowid', async (req, res) => {
  try {
    const escrow = await Escrowc.findOne({ txid: req.params.escrowid });
    if (!escrow) {
      return res.status(404).json({ message: 'Escrow not found' });
    }
    const { status, nodeid, ...escrowData } = escrow.toObject();
    if (!status) {
      delete escrowData.conditionSolution;
    }
    escrowData.status = status
    const model = await nodec.findById(nodeid);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    escrowData.model = model.model;
    return res.json(escrowData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/newnode", async (req, res) => {
  try {
    let data = req.body;
    const es = new es({
      creator: data.creator,
      name: data.name,
      model: data.model,
    });
    await es.save();
    res.json({ status: true });
  } catch (e) {
    res.json({ status: false });
  }
});

module.exports = router;
