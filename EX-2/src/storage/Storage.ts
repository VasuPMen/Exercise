import fs from 'fs';
import path from 'path';
import { Task } from '../models/Task';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

export class Storage {
  static async ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TASKS_FILE)) {
      await fs.promises.writeFile(TASKS_FILE, '[]', 'utf8');
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    await Storage.ensureDir();
    const tmp = TASKS_FILE + '.tmp';
    const data = JSON.stringify(tasks.map(t => t.toJSON()), null, 2);
    await fs.promises.writeFile(tmp, data, 'utf8');
    await fs.promises.rename(tmp, TASKS_FILE);
  }

  static async loadTasks(): Promise<Task[]> {
    try {
      await Storage.ensureDir();
      const raw = await fs.promises.readFile(TASKS_FILE, 'utf8');
      const arr = JSON.parse(raw);
      return (arr || []).map((o: any) => Task.fromJSON(o));
    } catch (err) {
      // If file missing or corrupt, return empty list
      return [];
    }
  }
}
