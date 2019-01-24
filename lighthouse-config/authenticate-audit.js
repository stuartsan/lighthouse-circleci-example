const Audit = require("/usr/local/lib/node_modules/lighthouse").Audit;
  // HACK! the "Authenticate" audit only exists to pull in its gatherer; 
  // otherwise no audits depend on the gatherer and it is not run.

class AuthenticateAudit extends Audit {
  static get meta() {
    return {
      id: "authenticate-audit",
      title: "Authenticate",
      failureTitle: "Did not authenticate (?)",
      description: "HACK! defining this just to depend on the Authenticate gatherer, so it runs.",

      requiredArtifacts: ["Authenticate"]
    };
  }

  static async audit(artifacts, context) {
    return {
      rawValue: 420,
      score: 100,
      displayValue: 'Ok',
    };
  }
}

module.exports = AuthenticateAudit;
