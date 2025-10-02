import { Task } from '../models/Task';
import { Observer } from '../observers/Observer';
import { Storage } from '../storage/Storage';
import { Logger } from '../logger/Logger';

/**
 * Singleton ScheduleManager
 * Maintains tasks sorted by startMinutes.
 */
export class ScheduleManager {
  private static instance: ScheduleManager | null = null;
  private tasks: Task[] = [];
  private observers: Observer[] = [];

  private constructor() {}

  static async getInstance(): Promise<ScheduleManager> {
    if (!ScheduleManager.instance) {
      ScheduleManager.instance = new ScheduleManager();
      await ScheduleManager.instance.load();
    }
    return ScheduleManager.instance;
  }

  subscribe(obs: Observer) {
    this.observers.push(obs);
  }

  unsubscribe(obs: Observer) {
    this.observers = this.observers.filter(o => o !== obs);
  }

  private notify(msg: string) {
    this.observers.forEach(o => {
      try {
        o.update(msg);
      } catch {
        // swallow observer errors
      }
    });
  }

  private findInsertIndex(startMinutes: number): number {
    let low = 0;
    let high = this.tasks.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.tasks[mid].startMinutes < startMinutes) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  private overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    // allow touching boundary (end == start) as non-overlap
    return aStart < bEnd && bStart < aEnd;
  }

  async addTask(task: Task): Promise<{ success: boolean; message: string }> {
    const idx = this.findInsertIndex(task.startMinutes);

    // check previous
    if (idx - 1 >= 0) {
      const prev = this.tasks[idx - 1];
      if (this.overlaps(prev.startMinutes, prev.endMinutes, task.startMinutes, task.endMinutes)) {
        const msg = `Task conflicts with existing task "${prev.title}" (${prev.getStartHHMM()}-${prev.getEndHHMM()}).`;
        this.notify(msg);
        await Logger.info(`Add conflict: ${msg}`);
        return { success: false, message: msg };
      }
    }

    // check next
    if (idx < this.tasks.length) {
      const next = this.tasks[idx];
      if (this.overlaps(next.startMinutes, next.endMinutes, task.startMinutes, task.endMinutes)) {
        const msg = `Task conflicts with existing task "${next.title}" (${next.getStartHHMM()}-${next.getEndHHMM()}).`;
        this.notify(msg);
        await Logger.info(`Add conflict: ${msg}`);
        return { success: false, message: msg };
      }
    }

    // insert
    this.tasks.splice(idx, 0, task);
    await Storage.saveTasks(this.tasks);
    await Logger.info(`Task added: ${task.title} (${task.getStartHHMM()}-${task.getEndHHMM()})`);
    this.notify(`Task added: ${task.title} (${task.getStartHHMM()}-${task.getEndHHMM()})`);
    return { success: true, message: 'Task added successfully.' };
  }

  listTasks(): Task[] {
    return [...this.tasks];
  }

  listTasksByPriority(priority: string): Task[] {
    const pNormalized = (priority || '').trim().toLowerCase();
    if (!pNormalized) return [];
    return this.tasks.filter(t => t.priority.toLowerCase() === pNormalized);
  }

  findTasksByTitle(title: string): Task[] {
    const q = (title || '').trim().toLowerCase();
    return this.tasks.filter(t => t.title.toLowerCase() === q);
  }

  findTaskById(id: string): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  async removeTaskById(id: string): Promise<{ success: boolean; message: string }> {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) {
      const msg = 'Error: Task not found.';
      await Logger.info(msg);
      return { success: false, message: msg };
    }
    const removed = this.tasks.splice(idx, 1)[0];
    await Storage.saveTasks(this.tasks);
    await Logger.info(`Task removed: ${removed.title}`);
    this.notify(`Task removed: ${removed.title}`);
    return { success: true, message: 'Task removed successfully.' };
  }

  async editTask(id: string, updates: Partial<{ title: string; startMinutes: number; endMinutes: number; priority: any; description?: string }>): Promise<{ success: boolean; message: string }> {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return { success: false, message: 'Task not found.' };
    const original = this.tasks[idx];
    // create updated copy
    const updated = new Task(
      original.id,
      updates.title ?? original.title,
      updates.startMinutes ?? original.startMinutes,
      updates.endMinutes ?? original.endMinutes,
      updates.priority ?? original.priority,
      updates.description ?? original.description,
      original.completed,
      original.createdAt
    );

    // remove temporarily
    const arr = [...this.tasks];
    arr.splice(idx, 1); // remove original

    // find insertion index in arr
    const insertIdx = (() => {
      let low = 0;
      let high = arr.length;
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid].startMinutes < updated.startMinutes) low = mid + 1;
        else high = mid;
      }
      return low;
    })();

    // check neighbors for conflict
    if (insertIdx - 1 >= 0) {
      const prev = arr[insertIdx - 1];
      if (this.overlaps(prev.startMinutes, prev.endMinutes, updated.startMinutes, updated.endMinutes)) {
        const msg = `Edit conflicts with existing task "${prev.title}".`;
        await Logger.info(`Edit conflict: ${msg}`);
        this.notify(msg);
        return { success: false, message: msg };
      }
    }
    if (insertIdx < arr.length) {
      const next = arr[insertIdx];
      if (this.overlaps(next.startMinutes, next.endMinutes, updated.startMinutes, updated.endMinutes)) {
        const msg = `Edit conflicts with existing task "${next.title}".`;
        await Logger.info(`Edit conflict: ${msg}`);
        this.notify(msg);
        return { success: false, message: msg };
      }
    }

    // commit
    arr.splice(insertIdx, 0, updated);
    this.tasks = arr;
    await Storage.saveTasks(this.tasks);
    await Logger.info(`Task edited: ${updated.title}`);
    this.notify(`Task edited: ${updated.title}`);
    return { success: true, message: 'Task edited successfully.' };
  }

  async markCompleted(id: string): Promise<{ success: boolean; message: string }> {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return { success: false, message: 'Task not found.' };
    t.completed = true;
    await Storage.saveTasks(this.tasks);
    await Logger.info(`Task completed: ${t.title}`);
    this.notify(`Task completed: ${t.title}`);
    return { success: true, message: 'Task marked as completed.' };
  }

  async load(): Promise<void> {
    try {
      const arr = await Storage.loadTasks();
      // ensure sorted
      this.tasks = arr.sort((a, b) => a.startMinutes - b.startMinutes);
      await Logger.info('Tasks loaded from storage.');
    } catch (err) {
      this.tasks = [];
    }
  }
}
  