import { parseTimeToMinutes } from '../utils/timeUtils';
import { Task, Priority } from '../models/Task';

export class TaskFactory {
  static create(
    title: string,
    startHHMM: string,
    endHHMM: string,
    priority: string,
    description?: string
  ): Task {
    const start = parseTimeToMinutes(startHHMM);
    const end = parseTimeToMinutes(endHHMM);
    if (end <= start) throw new Error('End time must be after start time.');
    const p = TaskFactory.parsePriority(priority);
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return new Task(id, title.trim(), start, end, p, description?.trim());
  }

  static parsePriority(s: string): Priority {
    const normalized = (s || '').trim().toLowerCase();
    if (normalized === 'high') return 'High';
    if (normalized === 'medium') return 'Medium';
    if (normalized === 'low') return 'Low';
    throw new Error('Priority must be Low, Medium or High.');
  }
}
