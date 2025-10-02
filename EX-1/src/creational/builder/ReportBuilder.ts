import { Logger } from '../../core/Logger';
import { Validator } from '../../core/Validator';
import { ApplicationError } from '../../core/ErrorHandler';

export interface ReportSection {
  title: string;
  content: string;
  order: number;
}

export interface ReportMetadata {
  title: string;
  author: string;
  createdDate: Date;
  version: string;
  tags: string[];
}

export enum ReportFormat {
  HTML = 'HTML',
  PDF = 'PDF',
  CSV = 'CSV',
  JSON = 'JSON'
}

export class Report {
  private sections: ReportSection[] = [];
  private metadata: ReportMetadata;
  private format: ReportFormat;
  private logger: Logger;

  constructor(metadata: ReportMetadata, format: ReportFormat) {
    this.metadata = metadata;
    this.format = format;
    this.logger = Logger.getInstance();
    
    Validator.isNotEmpty(metadata.title, 'Report title');
    Validator.isNotEmpty(metadata.author, 'Report author');
  }

  public addSection(section: ReportSection): void {
    Validator.isNotEmpty(section.title, 'Section title');
    Validator.isNotEmpty(section.content, 'Section content');
    
    this.sections.push(section);
    this.sections.sort((a, b) => a.order - b.order);
  }

  public getSections(): ReportSection[] {
    return [...this.sections];
  }

  public getMetadata(): ReportMetadata {
    return { ...this.metadata };
  }

  public getFormat(): ReportFormat {
    return this.format;
  }

  public generateOutput(): string {
    this.logger.info(`Generating report in ${this.format} format`);
    
    switch (this.format) {
      case ReportFormat.HTML:
        return this.generateHTML();
      case ReportFormat.PDF:
        return this.generatePDF();
      case ReportFormat.CSV:
        return this.generateCSV();
      case ReportFormat.JSON:
        return this.generateJSON();
      default:
        throw new ApplicationError(
          `Unsupported report format: ${this.format}`,
          'REPORT_FORMAT_ERROR'
        );
    }
  }

  private generateHTML(): string {
    let html = `<!DOCTYPE html>
<html>
<head>
    <title>${this.metadata.title}</title>
    <meta name="author" content="${this.metadata.author}">
    <meta name="created" content="${this.metadata.createdDate.toISOString()}">
</head>
<body>
    <h1>${this.metadata.title}</h1>
    <p><strong>Author:</strong> ${this.metadata.author}</p>
    <p><strong>Created:</strong> ${this.metadata.createdDate.toLocaleString()}</p>
    <p><strong>Version:</strong> ${this.metadata.version}</p>
    <p><strong>Tags:</strong> ${this.metadata.tags.join(', ')}</p>
`;

    this.sections.forEach(section => {
      html += `
    <h2>${section.title}</h2>
    <div>${section.content}</div>
`;
    });

    html += `
</body>
</html>`;

    return html;
  }

  private generatePDF(): string {
    // Simulated PDF generation - in real implementation would use PDF library
    return `[PDF Format]\nTitle: ${this.metadata.title}\nAuthor: ${this.metadata.author}\n\n${
      this.sections.map(s => `${s.title}\n${s.content}\n`).join('\n')
    }`;
  }

  private generateCSV(): string {
    let csv = 'Section,Content\n';
    this.sections.forEach(section => {
      csv += `"${section.title}","${section.content.replace(/"/g, '""')}"\n`;
    });
    return csv;
  }

  private generateJSON(): string {
    return JSON.stringify({
      metadata: this.metadata,
      sections: this.sections,
      format: this.format
    }, null, 2);
  }
}

export interface IReportBuilder {
  setTitle(title: string): IReportBuilder;
  setAuthor(author: string): IReportBuilder;
  setVersion(version: string): IReportBuilder;
  addTag(tag: string): IReportBuilder;
  setFormat(format: ReportFormat): IReportBuilder;
  addSection(title: string, content: string, order?: number): IReportBuilder;
  addExecutiveSummary(content: string): IReportBuilder;
  addDataAnalysis(content: string): IReportBuilder;
  addConclusions(content: string): IReportBuilder;
  build(): Report;
}

export class ReportBuilder implements IReportBuilder {
  private title: string = '';
  private author: string = '';
  private version: string = '1.0';
  private tags: string[] = [];
  private format: ReportFormat = ReportFormat.HTML;
  private sections: ReportSection[] = [];
  private sectionOrder: number = 1;
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public setTitle(title: string): IReportBuilder {
    Validator.isNotEmpty(title, 'Report title');
    this.title = title;
    this.logger.debug(`Report title set: ${title}`);
    return this;
  }

  public setAuthor(author: string): IReportBuilder {
    Validator.isNotEmpty(author, 'Report author');
    this.author = author;
    this.logger.debug(`Report author set: ${author}`);
    return this;
  }

  public setVersion(version: string): IReportBuilder {
    Validator.isNotEmpty(version, 'Report version');
    this.version = version;
    return this;
  }

  public addTag(tag: string): IReportBuilder {
    Validator.isNotEmpty(tag, 'Tag');
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
    return this;
  }

  public setFormat(format: ReportFormat): IReportBuilder {
    this.format = format;
    this.logger.debug(`Report format set: ${format}`);
    return this;
  }

  public addSection(title: string, content: string, order?: number): IReportBuilder {
    const section: ReportSection = {
      title,
      content,
      order: order || this.sectionOrder++
    };
    
    this.sections.push(section);
    this.logger.debug(`Added section: ${title}`);
    return this;
  }

  public addExecutiveSummary(content: string): IReportBuilder {
    return this.addSection('Executive Summary', content, 0);
  }

  public addDataAnalysis(content: string): IReportBuilder {
    return this.addSection('Data Analysis', content);
  }

  public addConclusions(content: string): IReportBuilder {
    return this.addSection('Conclusions', content, 1000);
  }

  public build(): Report {
    if (!this.title || !this.author) {
      throw new ApplicationError(
        'Report must have both title and author before building',
        'BUILDER_VALIDATION_ERROR'
      );
    }

    const metadata: ReportMetadata = {
      title: this.title,
      author: this.author,
      createdDate: new Date(),
      version: this.version,
      tags: [...this.tags]
    };

    const report = new Report(metadata, this.format);
    
    this.sections.forEach(section => {
      report.addSection(section);
    });

    this.logger.info(`Report built successfully: "${this.title}" by ${this.author}`);
    return report;
  }
}