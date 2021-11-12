const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const {graphqlHTTP} = require("express-graphql");
const {makeExecutableSchema} = require("@graphql-tools/schema");
const {configResolver} = require("./configResolver");

module.exports = ({app}) => {
  const schema = makeExecutableSchema({
    "typeDefs": fs.readFileSync(path.resolve(__dirname, "./schema.graphql"), "utf8"),
    "resolvers": [configResolver],
  });

  app.use(morgan("tiny"));
  app.use(cors());
  app.use("/graphql", graphqlHTTP({
    schema,
    "graphiql": true,
  }));
};
