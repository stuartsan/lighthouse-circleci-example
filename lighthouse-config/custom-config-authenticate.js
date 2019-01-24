module.exports = {
  extends: "lighthouse:default",

  passes: [{
    passName: 'defaultPass',
    gatherers: [
      'authenticate-gatherer',
    ],
  }],

  audits: ["bundlesize-audit", "authenticate-audit"],

  categories: {
    bundlesize: {
      title: "JS Bundle Size",
      description: "Can we keep it under the threshold???",
      auditRefs: [
        // When we add more custom audits, `weight` controls how they're averaged together.
        { id: "bundlesize-audit", weight: 1 }
      ]
    }
  }
};
