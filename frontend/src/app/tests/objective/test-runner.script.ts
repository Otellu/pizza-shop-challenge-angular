#!/usr/bin/env ts-node
// ====================================================================
// 🎯 OBJECTIVE TEST RUNNER ORCHESTRATION SCRIPT
// ====================================================================
//
// This script orchestrates the complete objective evaluation process.
// It can be run from the command line to evaluate candidate submissions.
//
// Usage:
//   npm run test:objective
//   npm run test:evaluation
//
// Output:
//   - Detailed test results in console
//   - JSON report for automated processing
//   - Clear PASS/FAIL/PARTIAL recommendation

import { TestBed } from '@angular/core/testing';
import { ObjectiveTestRunner, ObjectiveTestResults } from './objective-test-runner';
import * as fs from 'fs';
import * as path from 'path';

interface EvaluationConfig {
  outputPath: string;
  verboseLogging: boolean;
  timeoutMs: number;
  generateReport: boolean;
}

class TestRunnerOrchestrator {
  private config: EvaluationConfig;
  private runner: ObjectiveTestRunner;

  constructor(config: Partial<EvaluationConfig> = {}) {
    this.config = {
      outputPath: './test-results',
      verboseLogging: true,
      timeoutMs: 300000, // 5 minutes
      generateReport: true,
      ...config
    };
    
    this.runner = new ObjectiveTestRunner();
  }

  async runEvaluation(): Promise<ObjectiveTestResults> {
    console.log('🎯 STARTING OBJECTIVE CHALLENGE EVALUATION');
    console.log('==========================================');
    console.log(`⏱️  Timeout: ${this.config.timeoutMs / 1000}s`);
    console.log(`📊 Report Output: ${this.config.outputPath}`);
    console.log('');

    try {
      // Set up Angular testing environment
      await this.setupTestEnvironment();

      // Run the complete test suite
      const results = await Promise.race([
        this.runner.runAllTests(),
        this.createTimeout()
      ]);

      if (!results) {
        throw new Error('Test execution timed out');
      }

      // Print results to console
      this.runner.printResults(results);

      // Generate detailed report
      if (this.config.generateReport) {
        await this.generateDetailedReport(results);
      }

      // Log final recommendation
      this.logFinalRecommendation(results);

      return results;

    } catch (error) {
      console.error('❌ EVALUATION FAILED:', error.message);
      
      const failureResults: ObjectiveTestResults = {
        componentScore: 0,
        e2eScore: 0,
        totalScore: 0,
        features: [],
        summary: {
          passed: 0,
          failed: 1,
          total: 1,
          executionTime: this.config.timeoutMs
        },
        recommendation: 'FAIL'
      };

      if (this.config.generateReport) {
        await this.generateDetailedReport(failureResults);
      }

      return failureResults;
    }
  }

  private async setupTestEnvironment(): Promise<void> {
    if (this.config.verboseLogging) {
      console.log('🔧 Setting up Angular testing environment...');
    }

    try {
      await TestBed.configureTestingModule({
        imports: [],
        providers: []
      }).compileComponents();

      if (this.config.verboseLogging) {
        console.log('✅ Angular testing environment ready');
      }
    } catch (error) {
      console.error('❌ Failed to setup testing environment:', error.message);
      throw error;
    }
  }

  private createTimeout(): Promise<null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(null), this.config.timeoutMs);
    });
  }

  private async generateDetailedReport(results: ObjectiveTestResults): Promise<void> {
    if (this.config.verboseLogging) {
      console.log('📊 Generating detailed evaluation report...');
    }

    try {
      // Ensure output directory exists
      if (!fs.existsSync(this.config.outputPath)) {
        fs.mkdirSync(this.config.outputPath, { recursive: true });
      }

      // Generate JSON report
      const jsonReport = {
        timestamp: new Date().toISOString(),
        evaluation: results,
        config: this.config,
        summary: {
          overallScore: `${results.totalScore}/100`,
          recommendation: results.recommendation,
          passThreshold: '70 points',
          partialThreshold: '40 points',
          evaluationMethod: 'Component-First Hybrid (80% component + 20% E2E)'
        },
        breakdown: {
          componentTests: {
            score: results.componentScore,
            maxScore: 80,
            percentage: Math.round((results.componentScore / 80) * 100),
            weight: '80%'
          },
          e2eTests: {
            score: results.e2eScore,
            maxScore: 20,
            percentage: Math.round((results.e2eScore / 20) * 100),
            weight: '20%'
          }
        },
        features: results.features.map(feature => ({
          name: feature.featureName,
          score: `${feature.total}/${feature.maxTotal}`,
          percentage: feature.percentage,
          breakdown: {
            functional: feature.functional,
            api: feature.api,
            errorHandling: feature.errorHandling,
            performance: feature.performance
          }
        }))
      };

      const reportPath = path.join(this.config.outputPath, 'evaluation-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));

      // Generate human-readable report
      const humanReport = this.generateHumanReadableReport(results);
      const humanReportPath = path.join(this.config.outputPath, 'evaluation-report.md');
      fs.writeFileSync(humanReportPath, humanReport);

      console.log(`📊 Reports generated:`);
      console.log(`   JSON: ${reportPath}`);
      console.log(`   Markdown: ${humanReportPath}`);

    } catch (error) {
      console.error('❌ Failed to generate report:', error.message);
    }
  }

  private generateHumanReadableReport(results: ObjectiveTestResults): string {
    const { recommendation, totalScore, features } = results;
    
    let report = `# Angular Challenge Evaluation Report\n\n`;
    report += `**Timestamp:** ${new Date().toISOString()}\n\n`;
    report += `## Overall Results\n\n`;
    report += `- **Total Score:** ${totalScore}/100\n`;
    report += `- **Recommendation:** ${recommendation} ${this.getRecommendationEmoji(recommendation)}\n`;
    report += `- **Component Score:** ${results.componentScore}/80 (${Math.round((results.componentScore/80)*100)}%)\n`;
    report += `- **E2E Bonus Score:** ${results.e2eScore}/20 (${Math.round((results.e2eScore/20)*100)}%)\n\n`;

    report += `## Scoring Criteria\n\n`;
    report += `- **PASS:** 70+ points (Strong Angular skills demonstrated)\n`;
    report += `- **PARTIAL:** 40-69 points (Some Angular skills, needs improvement)\n`;
    report += `- **FAIL:** <40 points (Insufficient Angular expertise)\n\n`;

    report += `## Feature Breakdown\n\n`;
    
    features.forEach(feature => {
      const status = feature.percentage >= 70 ? '✅' : feature.percentage >= 40 ? '⚠️' : '❌';
      report += `### ${feature.featureName} ${status}\n\n`;
      report += `- **Score:** ${feature.total}/${feature.maxTotal} (${feature.percentage}%)\n`;
      report += `- **Functional:** ${feature.functional} points\n`;
      report += `- **API Integration:** ${feature.api} points\n`;
      report += `- **Error Handling:** ${feature.errorHandling} points\n`;
      report += `- **Performance:** ${feature.performance} points\n\n`;
    });

    report += `## Evaluation Method\n\n`;
    report += `This evaluation uses a **Component-First Hybrid** approach:\n\n`;
    report += `- **80% Component Tests:** Bulletproof, implementation-agnostic testing\n`;
    report += `- **20% E2E Bonus:** Smoke tests for end-to-end functionality\n\n`;
    report += `This method ensures objective evaluation regardless of coding style,\n`;
    report += `while preventing flaky test failures from affecting the core score.\n\n`;

    report += `## Technical Skills Assessed\n\n`;
    report += `- Angular 18+ features (standalone components, signals)\n`;
    report += `- RxJS operators (debouncing, switchMap, interval)\n`;
    report += `- State management (NgRx Signals)\n`;
    report += `- Reactive Forms with custom validation\n`;
    report += `- Real-time data polling\n`;
    report += `- Infinite scroll implementation\n`;
    report += `- API integration and error handling\n`;
    report += `- Performance optimization\n`;
    report += `- TypeScript proficiency\n\n`;

    return report;
  }

  private getRecommendationEmoji(recommendation: string): string {
    switch (recommendation) {
      case 'PASS': return '✅';
      case 'PARTIAL': return '⚠️';
      case 'FAIL': return '❌';
      default: return '❓';
    }
  }

  private logFinalRecommendation(results: ObjectiveTestResults): void {
    console.log('\n🎯 FINAL EVALUATION RESULT');
    console.log('==========================');
    
    const emoji = this.getRecommendationEmoji(results.recommendation);
    console.log(`${emoji} ${results.recommendation}: ${results.totalScore}/100 points`);
    
    switch (results.recommendation) {
      case 'PASS':
        console.log('✅ Strong Angular expertise demonstrated');
        console.log('   Candidate shows senior-level skills in:');
        console.log('   - State management and RxJS');
        console.log('   - Component architecture');
        console.log('   - API integration and error handling');
        break;
        
      case 'PARTIAL':
        console.log('⚠️  Some Angular skills present, but areas for improvement');
        console.log('   Consider for junior/mid-level positions with mentoring');
        break;
        
      case 'FAIL':
        console.log('❌ Insufficient Angular expertise for senior role');
        console.log('   Recommend additional training or junior position');
        break;
    }
    
    console.log(`\n📊 Detailed report available in: ${this.config.outputPath}/`);
  }
}

// CLI Interface
if (require.main === module) {
  const orchestrator = new TestRunnerOrchestrator({
    verboseLogging: process.argv.includes('--verbose'),
    generateReport: !process.argv.includes('--no-report'),
    outputPath: process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1] || './test-results'
  });

  orchestrator.runEvaluation()
    .then(results => {
      process.exit(results.recommendation === 'FAIL' ? 1 : 0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { TestRunnerOrchestrator };