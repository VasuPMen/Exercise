import { Logger } from '../core/Logger';
import { ReportBuilder, ReportFormat } from '../creational/builder/ReportBuilder';
import { ErrorHandler } from '../core/ErrorHandler';

export class BuilderDemo {
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async demonstrate(): Promise<void> {
    console.log('\n📊 Builder Pattern Demo - Report Generation');
    console.log('==========================================');

    // Create different types of reports
    await this.createBusinessReport();
    await this.sleep(2000);
    
    await this.createTechnicalReport();
    await this.sleep(2000);
    
    await this.demonstrateErrorHandling();

    console.log('\n✅ Builder Pattern Demo completed!');
  }

  private async createBusinessReport(): Promise<void> {
    console.log('\n📈 Creating Business Report using Builder...');
    
    try {
      const report = new ReportBuilder()
        .setTitle('Q4 2024 Business Performance Report')
        .setAuthor('John Smith - Business Analyst')
        .setVersion('2.1')
        .addTag('quarterly')
        .addTag('business')
        .addTag('performance')
        .setFormat(ReportFormat.HTML)
        .addExecutiveSummary(
          'Q4 2024 showed remarkable growth with 25% increase in revenue compared to Q3. ' +
          'Customer satisfaction improved by 15% and operational efficiency reached 94%.'
        )
        .addSection(
          'Revenue Analysis',
          'Total revenue for Q4 reached $2.5M, exceeding our target by 12%. ' +
          'The growth was primarily driven by new customer acquisitions and increased retention rates.',
          10
        )
        .addSection(
          'Market Expansion', 
          'Successfully expanded to 3 new markets in Asia-Pacific region. ' +
          'Market penetration in existing regions improved by 8%.',
          20
        )
        .addDataAnalysis(
          'Key metrics analysis shows strong performance across all departments. ' +
          'Sales conversion rate improved from 12% to 18%. Customer lifetime value increased by 22%.'
        )
        .addConclusions(
          'Q4 2024 results exceed expectations. Recommend continued investment in customer acquisition ' +
          'and market expansion strategies for Q1 2025.'
        )
        .build();

      console.log('✅ Business Report Generated Successfully!');
      console.log(`📋 Report Info: ${report.getMetadata().title}`);
      console.log(`👤 Author: ${report.getMetadata().author}`);
      console.log(`📅 Created: ${report.getMetadata().createdDate.toLocaleString()}`);
      console.log(`🏷️ Tags: ${report.getMetadata().tags.join(', ')}`);
      console.log(`📑 Sections: ${report.getSections().length}`);
      console.log(`📄 Format: ${report.getFormat()}`);
      
      // Show a sample of the generated output
      const output = report.generateOutput();
      console.log('\n📄 Sample HTML Output (first 300 chars):');
      console.log(output.substring(0, 300) + '...');
      
    } catch (error) {
      this.errorHandler.handleError(error, 'BusinessReportCreation');
    }
  }

  private async createTechnicalReport(): Promise<void> {
    console.log('\n🔧 Creating Technical Report using Builder...');
    
    try {
      const report = new ReportBuilder()
        .setTitle('System Architecture Analysis')
        .setAuthor('Alice Johnson - System Architect')
        .setVersion('1.0')
        .addTag('technical')
        .addTag('architecture')
        .addTag('analysis')
        .addTag('infrastructure')
        .setFormat(ReportFormat.JSON)
        .addExecutiveSummary(
          'Comprehensive analysis of current system architecture reveals opportunities ' +
          'for optimization and scalability improvements.'
        )
        .addSection(
          'Current Infrastructure',
          'System currently runs on AWS with 12 EC2 instances, RDS database cluster, ' +
          'and CloudFront CDN. Average response time is 250ms.',
          5
        )
        .addSection(
          'Performance Metrics',
          'System handles 10K concurrent users with 99.9% uptime. Memory utilization ' +
          'averages 65% during peak hours.',
          15
        )
        .addSection(
          'Scalability Analysis',
          'Current architecture can scale to 50K concurrent users with additional instances. ' +
          'Database sharding recommended for further scaling.',
          25
        )
        .addSection(
          'Security Assessment',
          'All endpoints secured with OAuth 2.0. SSL/TLS encryption in place. ' +
          'Regular security audits conducted monthly.',
          30
        )
        .addConclusions(
          'System architecture is solid with room for optimization. Recommend implementing ' +
          'microservices architecture and container orchestration for improved scalability.'
        )
        .build();

      console.log('✅ Technical Report Generated Successfully!');
      console.log(`📋 Report Info: ${report.getMetadata().title}`);
      console.log(`👤 Author: ${report.getMetadata().author}`);
      console.log(`📅 Created: ${report.getMetadata().createdDate.toLocaleString()}`);
      console.log(`🏷️ Tags: ${report.getMetadata().tags.join(', ')}`);
      console.log(`📑 Sections: ${report.getSections().length}`);
      console.log(`📄 Format: ${report.getFormat()}`);
      
      // Show JSON output sample
      const output = report.generateOutput();
      const jsonOutput = JSON.parse(output);
      console.log('\n📄 JSON Output Structure:');
      console.log(`   - Metadata: ${Object.keys(jsonOutput.metadata).join(', ')}`);
      console.log(`   - Sections: ${jsonOutput.sections.length} sections`);
      console.log(`   - Format: ${jsonOutput.format}`);
      
    } catch (error) {
      this.errorHandler.handleError(error, 'TechnicalReportCreation');
    }
  }

  private async demonstrateErrorHandling(): Promise<void> {
    console.log('\n⚠️ Demonstrating error handling with incomplete builder...');
    
    try {
      // Attempt to build report without required fields
      const incompleteReport = new ReportBuilder()
        .addSection('Test Section', 'Test content')
        .build();
        
    } catch (error) {
      console.log('❌ Expected error caught and handled properly');
      this.errorHandler.handleError(error, 'IncompleteReportBuilding');
    }

    try {
      // Attempt to build report with valid fields
      const validReport = new ReportBuilder()
        .setTitle('Test Title')
        .setAuthor('Test Author')
        .addSection('Test Section', 'Test content')
        .build();

      console.log('✅ Valid Report Generated Successfully!');
      console.log(`📋 Report Info: ${validReport.getMetadata().title}`);
      console.log(`👤 Author: ${validReport.getMetadata().author}`);
      console.log(`📅 Created: ${validReport.getMetadata().createdDate.toLocaleString()}`);
      console.log(`🏷️ Tags: ${validReport.getMetadata().tags.join(', ')}`);
      console.log(`📑 Sections: ${validReport.getSections().length}`);
      console.log(`📄 Format: ${validReport.getFormat()}`);
      
      // Show a sample of the generated output
      const output = validReport.generateOutput();
      console.log('\n📄 Sample HTML Output (first 300 chars):');
      console.log(output.substring(0, 300) + '...');
      
    } catch (error) {
      this.errorHandler.handleError(error, 'ValidReportCreation');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}