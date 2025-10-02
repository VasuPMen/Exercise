import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

export class Logger {
  static ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '', { encoding: 'utf8' });
  }

  static async append(message: string) {
    try {
      Logger.ensureLogDir();
      const line = `[${new Date().toISOString()}] ${message}\n`;
      await fs.promises.appendFile(LOG_FILE, line, 'utf8');
    } catch (err) {
      console.error('Failed to write log:', err);
    }
  }

  static async info(msg: string) {
    console.log(`[INFO] ${msg}`);
    await Logger.append(`[INFO] ${msg}`);
  }

  static async error(msg: string) {
    console.error(`[ERROR] ${msg}`);
    await Logger.append(`[ERROR] ${msg}`);
  }
}
