const fs = require('fs');
const path = require('path');

class AreaSummaryReporter {
  constructor() {
    this.areaStats = {};
  }

  onTestEnd(test, result) {
    const file = path.basename(test.location.file);

    if (!this.areaStats[file]) {
      this.areaStats[file] = { passed: 0, failed: 0 };
    }

    if (result.status === 'passed') {
      this.areaStats[file].passed++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.areaStats[file].failed++;
    }
  }

  onEnd() {
    const lines = ['Test Summary by File', '=====================', ''];

    for (const [file, stats] of Object.entries(this.areaStats)) {
      lines.push(`${file}: ${stats.passed} passed, ${stats.failed} failed`);
    }

    const outputPath = path.join(__dirname, '..', 'test-results', 'area-summary.txt');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, lines.join('\n'));

    console.log(`\nArea summary written to ${outputPath}`);
  }
}

module.exports = AreaSummaryReporter;