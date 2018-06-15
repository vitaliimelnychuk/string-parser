const QueryBuilder = require("./src/query-builder");

const queryBuilder = new QueryBuilder();

queryBuilder.build("company: test OR test2 q:").getQuery()