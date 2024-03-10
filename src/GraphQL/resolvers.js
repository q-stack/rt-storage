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

function convertRuleTemplates(rules) {
  return (rules) ? rules.map(rule => ({
    ...rule,
    templates: (rule.templates) ? rule.templates.map(t => ((typeof t) === "string") ? JSON.parse(t) : JSON.stringify(t)) : null
  })) : null;
}

const resolvers = {
  Query: {
    engines: (obj, args, context, info) => {
      return engines;
    },
    engine: (obj, args, context, info) => {
      const engine = engines.find(item => item.id === obj.id);
  
      return {
        ...engine,
        rules: convertRuleTemplates(engine.rules)
      };
    },
  },
  Mutation: {
    createEngine: (obj, args, context, info) => {
      const engine = {
        ...obj.engine,
        id: uuidv4(),
        rules: convertRuleTemplates(obj.engine.rules)
      };
  
      engines.push(engine);
  
      save();
  
      return engine;
    },
    updateEngine: (obj, args, context, info) => {
      const engine = engines.find(item => item.id === obj.engine.id);
  
      if (engine) {
        engine.name = obj.engine.name;
        engine.desc = obj.engine.desc;
        engine.tags = obj.engine.tags;
        engine.rules = convertRuleTemplates(obj.engine.rules);
        engine.shareId = obj.engine.shareId;
        engine.syncId = obj.engine.syncId;
        engine.keys = obj.engine.keys;
  
        save();
      }      
  
      return engine;
    },
    deleteEngine: (obj, args, context, info) => {
      const index = engines.findIndex(item => item.id === obj.id);
  
      if (index === -1) throw new Error("Engine not found.");
  
      const deletedItem = engines.splice(index, 1);
  
      save();
  
      return deletedItem[0];
    }
  }
};

module.exports = resolvers;
