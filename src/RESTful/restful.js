const express = require('express');
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const sample = "./sample.json";
const engines = load();

function load() {
  return JSON.parse(fs.readFileSync(sample, "utf8"));
}

function save() {
  fs.writeFileSync(sample, JSON.stringify(engines));
};

router.get('/engines', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(engines));
});

router.post('/engines', (req, res) => {
  const id = uuidv4();

  engines.push({
    ...req.body,
    id: id
  });

  save();

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ id: id }));
});

router.get('/engines/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(engines.find(item => item.id === req.params.id)));
});

router.post('/engines/:id', (req, res) => {
  const index = engines.findIndex(item => item.id === req.params.id);
  
  if (index > 0) {
    engines[index] = req.body;
    save();
  }

  res.sendStatus(200);
});

router.delete('/engines/:id', (req, res) => {
  const index = engines.findIndex(item => item.id === req.params.id);
  
  if (index > -1) {
    engines.splice(index, 1);
    save();
  }

  res.sendStatus(200);
});

module.exports = router;
