const internal = {};
exports = module.exports = internal;

internal.ByEmail = function (data, email="", kindParam = "") {
  return validateParams(data, email, kindParam);
}

internal.ByKind = function (data, kindParam = "") {
  var resultData = [];
  data.map(row => {
    const { kind } = row;
    const kindValidate = kind.includes(kindParam.toUpperCase());
    if (kindValidate)
      resultData = [].concat(resultData, row);
  });

  return resultData;
}
validateParams = (data, email, kindParam) => {
  var resultData = [];
  data.forEach(row => {
    if (typeof row.spec !== "undefined") {
      const { kind } = row;
      let resultSpec = [];
      resultSpec = validateParams(row.spec, email, kindParam);

      if (resultSpec.length > 0)
        resultData = [].concat(resultData, { kind, spec: resultSpec });
    }
    if (typeof row.allowedEmails !== "undefined") {
      let validate = row.allowedEmails.map(value => {
        const allowedEmailtext = value.replace(/\*/g, '\.*');
        let regexAllowedEmail = new RegExp(allowedEmailtext);
        const { allowedEmails, ...nodo } = row;
        return regexAllowedEmail.test(email) && nodo
      }).filter(value => value);
      resultData = (typeof validate !== "undefined") && [].concat(resultData, validate);
    }
  });
  return resultData;
}
