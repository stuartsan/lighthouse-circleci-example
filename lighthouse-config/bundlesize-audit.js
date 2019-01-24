const Audit = require("/usr/local/lib/node_modules/lighthouse").Audit;

class LoadAudit extends Audit {
  static get meta() {
    return {
      id: "bundlesize-audit",
      title: "JS bundle size",
      failureTitle: `JS bundle exceeds your threshold of ${
        process.env.MAX_BUNDLE_SIZE_KB
      }kb`,
      description: "Compares JS bundle sizes with predefined thresholds.",

      requiredArtifacts: ["devtoolsLogs"]
    };
  }

  static async audit(artifacts, context) {
    const devtoolsLogs = artifacts.devtoolsLogs["defaultPass"];
    const networkRecords = await artifacts.requestNetworkRecords(devtoolsLogs);

    const bundleRecord = networkRecords.find(
      record =>
        record.resourceType === "Script" &&
        new RegExp(process.env.JS_BUNDLE_REGEX).test(record.url)
    );

    const belowThreshold =
      bundleRecord.transferSize <= process.env.MAX_BUNDLE_SIZE_KB * 1024;

    return {
      rawValue: (bundleRecord.transferSize / 1024).toFixed(1),
      // Cast true/false to 1/0
      score: Number(belowThreshold),
      displayValue: `${bundleRecord.url} was ${(
        bundleRecord.transferSize / 1024
      ).toFixed(1)}kb`
    };
  }
}

module.exports = LoadAudit;
