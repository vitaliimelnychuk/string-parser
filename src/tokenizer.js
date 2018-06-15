
module.exports.getTokens = string => {
    if (!string)
        return [];

    let res = string.toString().split(" ").filter(Boolean)

    return res;
}

module.exports.operands = {
    OR: "OR",
    AND: "AND"
}

module.exports.fields = {
    company: "company:",
    query: "q:"
}
