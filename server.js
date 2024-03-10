const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server");
const restful = require('./src/RESTful/restful');
const resolvers = require("./src/GraphQL/resolvers");

const app = express();

app.use(cors());
app.use(express.json());

// RESTful api routes
app.use('/api', restful);

// GraphQL handler
app.all(
  "/graphql",
  createHandler({
    schema: buildSchema(fs.readFileSync("./src/GraphQL/schema.graphql", "utf8")),
    rootValue: {
      ...resolvers.Query,
      ...resolvers.Mutation
    },
  })
);

// Serve GraphiQL IDE for introspection.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
});

// Start the server at port
app.listen(4000, () => {
  console.log("Running a RESTful API server at http://localhost:4000/api/engines");
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
