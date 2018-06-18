const sinon = require("sinon");
const assert = require("chai").assert;
const QueryBuilder = require("../src/query-builder");

describe("query-builder", () => {
    const getQuery = () => {
        return {
            company: {
                must: [],
                should: []
            },
            q: {
                must: [],
                should: []
            }
        }
    }
    describe("#build", () => {
        it("should return string-builder object", () => {
            const queryBuilder = new QueryBuilder();
            assert.equal(queryBuilder.build(), queryBuilder)
        })
    });
    describe("#getQuery()", () => {
        it("should return empty query object when you pass empty string", () => {
            const queryBuilder = new QueryBuilder();
            assert.deepEqual(queryBuilder.build("").getQuery(), getQuery())
        })
        it("should return query object when you pass empty int", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.q.must.push("123");

            assert.deepEqual(queryBuilder.build(123).getQuery(), expectedQuery)
        })
        it("should return empty query object when you pass empty field", () => {
            const queryBuilder = new QueryBuilder();
            assert.deepEqual(queryBuilder.build("company:").getQuery(), getQuery())
        })
        it("should return empty query object when you pass empty field", () => {
            const queryBuilder = new QueryBuilder();
            assert.deepEqual(queryBuilder.build("company: q:").getQuery(), getQuery())
        })
        it("should return company values", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.must.push("test");
            assert.deepEqual(queryBuilder.build("company: test q:").getQuery(), expectedQuery)
        })
        it("should return company values when there are two mentions", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.must.push("test");
            expectedQuery.company.must.push("test2");
            assert.deepEqual(queryBuilder.build("company: test q: company: test2").getQuery(), expectedQuery)
        });
        it("should return company values when there are two mentions with OR operand", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.should.push("test");
            expectedQuery.company.should.push("test2");
            assert.deepEqual(queryBuilder.build("company: test OR test2 q:").getQuery(), expectedQuery)
        })

        it("should return company values when there are two mentions with one field", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.must.push("test");
            expectedQuery.company.must.push("test2");
            assert.deepEqual(queryBuilder.build("company: test test2 q:").getQuery(), expectedQuery)
        })
        it("should return company values when there are two mentions by each field", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.must.push("test");
            expectedQuery.q.must.push("test2");
            assert.deepEqual(queryBuilder.build("company: test q: test2").getQuery(), expectedQuery)
        })

        it("should return company values when there are two mentions by each field with additional spaces", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.must.push("test");
            expectedQuery.q.must.push("test2");
            assert.deepEqual(queryBuilder.build(" company:  test  q:  test2 ").getQuery(), expectedQuery)
        })

        it("should return company values when there are two mentions by each field with OR conditions", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.should.push("test");
            expectedQuery.company.should.push("test2");
            expectedQuery.q.should.push("test3");
            expectedQuery.q.should.push("test4");
            assert.deepEqual(queryBuilder.build("company: test OR test2 q: test3 OR test4").getQuery(), expectedQuery)
        })
        it("should return company values when there are a lot of conditions with spaces", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.should = ["test1", "test2"];
            expectedQuery.company.must = ["Must", "be", "words", "here", "Software", "Engineer"];

            assert.deepEqual(queryBuilder.build("company: Must be words here test1 OR test2 Software Engineer").getQuery(), expectedQuery)
        })
        it("should return company values when there are a lot of conditions with AND", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.should = ["test1", "test2"];
            expectedQuery.company.must = ["Must", "be", "words", "here", "Software", "Engineer"];

            assert.deepEqual(queryBuilder.build("company: Must be words here test1 OR test2 Software AND Engineer").getQuery(), expectedQuery)
        })
    })
    describe("#buildStringFromQuery", () => {
        it("should return string builded from query", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.should = ["test1", "test2"];
            expectedQuery.company.must = ["Must", "be", "words", "here", "Software", "Engineer"];

            assert.deepEqual(queryBuilder.buildStringFromQuery(expectedQuery).getString(), "company: Must be words here Software Engineer test1 OR test2")
        });
        it("should return empty string", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            assert.deepEqual(queryBuilder.buildStringFromQuery(expectedQuery).getString(), "")
        })
        it("should return must results string", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.must = ["test1", "test2"];
            expectedQuery.q.must = ["test3", "test4"];
            assert.equal(queryBuilder.buildStringFromQuery(expectedQuery).getString(), "test3 test4 company: test1 test2")
        })
        it("should return should results string", () => {
            const queryBuilder = new QueryBuilder();
            const expectedQuery = getQuery();
            expectedQuery.company.should = ["test1", "test2"];
            expectedQuery.q.should = ["test3", "test4"];
            assert.equal(queryBuilder.buildStringFromQuery(expectedQuery).getString(), "test3 OR test4 company: test1 OR test2")
        })
    })
});