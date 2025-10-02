import { Logger } from '../../core/Logger';
import { Validator } from '../../core/Validator';

export interface IObserver {
  update(notification: Notification): void;
}

export interface ISubject {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
  notify(notification: Notification): void;
}

export class Notification {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly message: string,
    public readonly priority: NotificationPriority,
    public readonly timestamp: Date = new Date()
  ) {
    Validator.isNotEmpty(title, 'Notification title');
    Validator.isNotEmpty(message, 'Notification message');
  }
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class NotificationCenter implements ISubject {
  private observers: IObserver[] = [];
  private notifications: Notification[] = [];
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public subscribe(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.logger.info(`Observer subscribed. Total observers: ${this.observers.length}`);
    }
  }

  public unsubscribe(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      this.logger.info(`Observer unsubscribed. Remaining observers: ${this.observers.length}`);
    }
  }

  public notify(notification: Notification): void {
    this.notifications.push(notification);
    this.logger.info(`Broadcasting notification: ${notification.title}`);
    
    this.observers.forEach(observer => {
      try {
        observer.update(notification);
      } catch (error) {
        this.logger.error('Error updating observer', error as Error);
      }
    });
  }

  public getNotificationHistory(): Notification[] {
    return [...this.notifications];
  }
}

export class EmailNotificationService implements IObserver {
  private logger: Logger;

  constructor(private serviceId: string) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(serviceId, 'Service ID');
  }

  public update(notification: Notification): void {
    this.logger.info(`Email Service ${this.serviceId}: Sending email for "${notification.title}"`);
    // Simulate email sending
    if (notification.priority === NotificationPriority.CRITICAL) {
      this.logger.warn(`CRITICAL notification sent via email: ${notification.message}`);
    }
  }
}

export class SMSNotificationService implements IObserver {
  private logger: Logger;

  constructor(private serviceId: string) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(serviceId, 'Service ID');
  }

  public update(notification: Notification): void {
    if (notification.priority === NotificationPriority.HIGH || 
        notification.priority === NotificationPriority.CRITICAL) {
      this.logger.info(`SMS Service ${this.serviceId}: Sending SMS for "${notification.title}"`);
    }
  }
}

export class PushNotificationService implements IObserver {
  private logger: Logger;

  constructor(private serviceId: string) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(serviceId, 'Service ID');
  }

  public update(notification: Notification): void {
    this.logger.info(`Push Service ${this.serviceId}: Sending push notification for "${notification.title}"`);
  }
}