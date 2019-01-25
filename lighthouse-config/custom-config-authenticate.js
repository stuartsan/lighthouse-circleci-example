module.exports = {
  extends: "lighthouse:default",

  passes: [{
    passName: 'defaultPass',
    gatherers: [
      'authenticate-gatherer',
    ],
  }],

  audits: ["bundle-size-audit", "authenticate-audit"],

  categories: {
    "bundle-size": {
      title: "JS Bundle Size",
      description: "Can we keep it under the threshold???",
      auditRefs: [
        // When we add more custom audits, `weight` controls how they're averaged together.
        { id: "bundle-size-audit", weight: 1 }
      ]
    }
  }
};
