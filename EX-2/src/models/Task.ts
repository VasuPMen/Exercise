export type Priority = 'Low' | 'Medium' | 'High';

export class Task {
  id: string;
  title: string;
  description?: string;
  startMinutes: number; 
  endMinutes: number;
  priority: Priority;
  completed: boolean;
  createdAt: number;

  constructor(
    id: string,
    title: string,
    startMinutes: number,
    endMinutes: number,
    priority: Priority,
    description?: string,
    completed = false,
    createdAt = Date.now()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startMinutes = startMinutes;
    this.endMinutes = endMinutes;
    this.priority = priority;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  getStartHHMM(): string {
    const h = Math.floor(this.startMinutes / 60).toString().padStart(2, '0');
    const m = (this.startMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  getEndHHMM(): string {
    const h = Math.floor(this.endMinutes / 60).toString().padStart(2, '0');
    const m = (this.endMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  toDisplayString(): string {
    const status = this.completed ? '✓' : ' ';
    return `${this.getStartHHMM()} - ${this.getEndHHMM()}: ${this.title} [${this.priority}] ${status}`;
  }

  toJSON() {
    // for persistence
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      startMinutes: this.startMinutes,
      endMinutes: this.endMinutes,
      priority: this.priority,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }

  static fromJSON(obj: any): Task {
    return new Task(
      obj.id,
      obj.title,
      obj.startMinutes,
      obj.endMinutes,
      obj.priority,
      obj.description,
      obj.completed,
      obj.createdAt
    );
  }
}
