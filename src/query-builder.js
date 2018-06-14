const { getTokens, operands, fields } = require("./tokenizer")

class QueryBuidler {
    constructor(string) {
        this.string = string;
        this.query = {
            q: {
                should: [],
            },
            company: {
                should: [],
            },
        };
    }

    buildStringFromQuery(query) {
        this.query = query;

        return this;
    }

    build(string) {
        this.string = string;
        const tokens = getTokens(string);
        this.processTokensByField(tokens);
        return this;
    }

    getQuery() {
        return this.query;
    }

    getString() {
        return this.string;
    }

    processTokensByField(tokens) {
        let field = this.query.q;

        for (let i in tokens) {
            switch (tokens[i]) {
                case fields.company:
                    field = this.query.company;
                    break;
                case fields.query:
                    field = this.query.q;
                    break;
                default:
                    this.processToken(field, tokens[i]);
            }
        }
    }

    processToken(object, token) {
        switch (token) {
            case operands.OR:
                break;
            default:
                object.should.push(token);
                return;
        }
    }

}

module.exports = QueryBuidler;