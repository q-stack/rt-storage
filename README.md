## Rt Storage API

Demo implementation of [Rule Template (Rt)](https://rt.qiangc.net) storage api to serve both GraphQL and RESTFul calls.

Default Rt storage is implemented using AWS Amplify Datastore saved to broswer cache.  To sync data to AWS cloud, user needs to login and subscribe.  For user want to save data off browser cache, user can implement Rt Storage API and use custom storage host in [Rt Service Hosts Settings](https://rt.qiangc.net/settings).  Both RESTful and GraphQL API are supported.

## RESTful API

```
/engines (GET, POST)
/engines/:id (GET, POST, DELETE)
```

_src/RESTful/restful.js has reference RESTful API implementation_

## GraphsQL API

src/GraphQL/schema.graphql

```
type Engine {
  id: ID!
  name: String
  desc: String
  tags: [String]
  rules: [Rule]
  shareId: String
  syncId: String
  keys: [String]
}

type Rule {
  name: String
  desc: String
  action: Action!
  templates: [String]
}

type Action {
  annotate: String!
}

input EngineInput {
  id: ID
  name: String
  desc: String
  tags: [String]
  rules: [RuleInput]
  shareId: String
  syncId: String
  keys: [String]
}

input RuleInput {
  name: String
  desc: String
  action: ActionInput
  templates: [String]
}

input ActionInput {
  annotate: String!
}

type Query {
  engines: [Engine]!
  engine(id: ID!): Engine
}

type Mutation {
  createEngine(engine: EngineInput!): Engine!
  updateEngine(engine: EngineInput!): Engine!
  deleteEngine(id: ID!): Engine!
}

```

_src/GraphQL/resolvers.js has reference GraphsQL resolvers implementation_

### File based api host: server.js

server.js is a node express application.  It sets up routing for RESTful API and adds handler for GraphsQL API.  In practice, you only need one api.  Here for demo, both api implementation are provided.

Both RESTful and GraphsQL load and save to the same sample.json file. If you prefer database, feel free to update it as you need.

For GraphsQL, there is added feature for introspection.

### To install and run

```
npm i
npm start
```

### RESTful api routes

[http://localhost:4000/api/engines](http://localhost:4000/api/engines)

[http://localhost:4000/api/engines/6ca2aa61-36cb-4f7b-89b5-bd568ff50345](http://localhost:4000/api/engines/6ca2aa61-36cb-4f7b-89b5-bd568ff50345)

### GraphiQL IDE

Navigate to [localhost](http://localhost:4000) to load GraphiQL IDE

List all

```
{
  engines {
    id
    name
    tags
    shareId
  }
}
```

Select one

```
query ($id: ID!) {
  engine(id: $id) {
    id
    name
    desc
    tags
    rules {
      name
      desc
      action {
        annotate
      }
      templates
    }
    shareId
    syncId
    keys
  }
}
```

Then add variable at the bottom pane

```
{
  "id": "6ca2aa61-36cb-4f7b-89b5-bd568ff50345"
}
```

## Note

After server start, data loaded to RESTful and GraphiQL are independent.  To sync, restart the service.