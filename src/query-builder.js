const { getTokens, operands, fields } = require("./tokenizer")

class QueryBuidler {
    constructor(string) {
        this.string = string;
        this.query = {
            q: {
                must: [],
                should: [],
            },
            company: {
                must: [],
                should: [],
            },
        };
        this.operands = {
            OR: 'should',
            AND: 'must'
        }
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
        let operand = this.operands.AND;

        for (let i in tokens) {
            i = parseInt(i);
            if (this.isField(tokens[i])) {
                field = this.getField(tokens[i])
            } else {
                operand = this.processToken(field, operand, tokens[i], tokens[i + 1]);
            }
        }
    }

    getField(token) {
        switch (token) {
            case fields.company:
                return this.query.company;
            case fields.query:
                return this.query.q;
            default:
                return false;
        }
    }

    isField(token) {
        return Object.values(fields).includes(token);
    }

    getOperand(token) {
        return this.operands[token];
    }

    isOperand(token) {
        return operands[token];
    }

    processToken(object, currentOperand, token, nextToken, prev) {
        if (this.isOperand(token))
            return this.getOperand(token)

        if (this.isOperand(nextToken))
            currentOperand = this.getOperand(nextToken);

        object[currentOperand].push(token);

        if (!this.isOperand(nextToken))
            currentOperand = this.operands[operands.AND];

        return currentOperand;

    }

}

module.exports = QueryBuidler;