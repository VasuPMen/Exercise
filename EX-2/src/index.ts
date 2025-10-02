import readline from 'readline';
import { TaskFactory } from './factories/TaskFactory';
import { ScheduleManager } from './managers/ScheduleManager';
import { ConsoleObserver } from './observers/Observer';
import { minutesToHHMM, parseTimeToMinutes } from './utils/timeUtils';
import { Logger } from './logger/Logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });
}

function printMenu() {
  console.log('\n--- Astronaut Daily Schedule ---');
  console.log('Commands:');
  console.log('  add           -> Add a task');
  console.log('  remove        -> Remove a task (by id or title)');
  console.log('  view          -> View all tasks (sorted)');
  console.log('  view:prio     -> View tasks by priority (Low/Medium/High)');
  console.log('  edit          -> Edit a task (by id)');
  console.log('  complete      -> Mark task as completed (by id)');
  console.log('  help          -> Show this menu');
  console.log('  exit          -> Exit app');
  console.log('');
}

async function run() {
  await Logger.info('Starting CLI');
  const manager = await ScheduleManager.getInstance();
  const observer = new ConsoleObserver();
  manager.subscribe(observer);

  printMenu();
  rl.prompt();

  rl.on('line', async line => {
    const cmd = (line || '').trim();

    try {
      if (!cmd || cmd === 'help') {
        printMenu();
      } else if (cmd === 'add') {
        const title = await ask('Title: ');
        const description = await ask('Description (optional): ');
        const start = await ask('Start (HH:mm): ');
        const end = await ask('End (HH:mm): ');
        const priority = await ask('Priority (Low/Medium/High): ');
        try {
          const task = TaskFactory.create(title, start, end, priority, description);
          const res = await manager.addTask(task);
          if (res.success) console.log('Task added successfully. No conflicts.');
          else console.log(`Error: ${res.message}`);
        } catch (err: any) {
          console.log(`Error: ${err.message}`);
          await Logger.error(`Add failed: ${err.message}`);
        }
      } else if (cmd === 'view') {
        const tasks = manager.listTasks();
        if (tasks.length === 0) {
          console.log('No tasks scheduled for the day.');
        } else {
          console.log('\nScheduled tasks:');
          tasks.forEach(t => {
            console.log(`${t.id} | ${t.toDisplayString()}`);
            if (t.description) console.log(`    -> ${t.description}`);
          });
        }
      } else if (cmd.startsWith('view:')) {
        const parts = cmd.split(':');
        if (parts.length === 2) {
          const pr = parts[1];
          const filtered = manager.listTasksByPriority(pr);
          if (filtered.length === 0) console.log(`No tasks with priority ${pr}.`);
          else filtered.forEach(t => console.log(`${t.id} | ${t.toDisplayString()}`));
        } else {
          console.log('Usage: view:<priority>');
        }
      } else if (cmd === 'remove') {
        const q = await ask('Enter task id or exact title to remove: ');
        const byId = manager.findTaskById(q);
        if (byId) {
          const res = await manager.removeTaskById(byId.id);
          console.log(res.message);
        } else {
          const matches = manager.findTasksByTitle(q);
          if (matches.length === 0) {
            console.log('Error: Task not found.');
          } else if (matches.length === 1) {
            const res = await manager.removeTaskById(matches[0].id);
            console.log(res.message);
          } else {
            console.log('Multiple tasks match that title:');
            matches.forEach((m, i) => console.log(`${i + 1}) ${m.id} | ${m.toDisplayString()}`));
            const sel = await ask('Enter number of task to remove: ');
            const idx = parseInt(sel, 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= matches.length) {
              console.log('Invalid selection.');
            } else {
              const res = await manager.removeTaskById(matches[idx].id);
              console.log(res.message);
            }
          }
        }
      } else if (cmd === 'edit') {
        const id = await ask('Enter task id to edit: ');
        const task = manager.findTaskById(id);
        if (!task) {
          console.log('Task not found.');
        } else {
          console.log(`Editing ${task.toDisplayString()}`);
          const title = await ask(`Title [${task.title}]: `);
          const description = await ask(`Description [${task.description ?? ''}]: `);
          const start = await ask(`Start (HH:mm) [${task.getStartHHMM()}]: `);
          const end = await ask(`End (HH:mm) [${task.getEndHHMM()}]: `);
          const priority = await ask(`Priority (Low/Medium/High) [${task.priority}]: `);
          try {
            const updates: any = {};
            if (title) updates.title = title;
            if (description) updates.description = description;
            if (start) updates.startMinutes = parseTimeToMinutes(start);
            if (end) updates.endMinutes = parseTimeToMinutes(end);
            if (priority) updates.priority = priority;
            const res = await manager.editTask(id, updates);
            console.log(res.message);
          } catch (err: any) {
            console.log(`Error: ${err.message}`);
          }
        }
      } else if (cmd === 'complete') {
        const id = await ask('Enter task id to mark completed: ');
        const res = await manager.markCompleted(id);
        console.log(res.message);
      } else if (cmd === 'exit') {
        console.log('Exiting... Goodbye!');
        await Logger.info('Exiting CLI');
        rl.close();
        process.exit(0);
      } else {
        console.log('Unknown command. Type "help" for menu.');
      }
    } catch (err: any) {
      console.log(`Unexpected error: ${err.message}`);
      await Logger.error(`Unexpected error: ${err.stack ?? err.message}`);
    }

    rl.prompt();
  });

  rl.on('close', async () => {
    await Logger.info('CLI closed');
    process.exit(0);
  });
}

run().catch(async err => {
  // eslint-disable-next-line no-console
  console.error('Failed to start app:', err);
  await Logger.error(`Startup failed: ${err.stack ?? err.message}`);
  process.exit(1);
});
