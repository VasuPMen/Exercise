import { Logger } from '../core/Logger';
import { 
  NotificationCenter, 
  EmailNotificationService, 
  SMSNotificationService, 
  PushNotificationService,
  Notification,
  NotificationPriority 
} from '../behavioral/observer/NotificationSystem';

export class ObserverDemo {
  private logger: Logger;
  private notificationCenter: NotificationCenter;
  private emailService: EmailNotificationService;
  private smsService: SMSNotificationService;
  private pushService: PushNotificationService;

  constructor() {
    this.logger = Logger.getInstance();
    this.notificationCenter = new NotificationCenter();
    this.emailService = new EmailNotificationService('EMAIL-001');
    this.smsService = new SMSNotificationService('SMS-001');
    this.pushService = new PushNotificationService('PUSH-001');
  }

  public async demonstrate(): Promise<void> {
    console.log('\n🔔 Observer Pattern Demo - Notification System');
    console.log('================================================');

    // Subscribe services
    console.log('\n📋 Setting up notification services...');
    this.notificationCenter.subscribe(this.emailService);
    this.notificationCenter.subscribe(this.smsService);
    this.notificationCenter.subscribe(this.pushService);

    // Send different types of notifications
    console.log('\n📨 Sending notifications with different priorities...');
    
    await this.sleep(1000);
    const lowPriorityNotification = new Notification(
      'notif-001',
      'System Maintenance',
      'Scheduled maintenance will occur tonight at 2 AM',
      NotificationPriority.LOW
    );
    this.notificationCenter.notify(lowPriorityNotification);

    await this.sleep(1500);
    const highPriorityNotification = new Notification(
      'notif-002',
      'Security Alert',
      'Unusual login activity detected on your account',
      NotificationPriority.HIGH
    );
    this.notificationCenter.notify(highPriorityNotification);

    await this.sleep(1500);
    const criticalNotification = new Notification(
      'notif-003',
      'System Down',
      'Critical system failure - immediate attention required',
      NotificationPriority.CRITICAL
    );
    this.notificationCenter.notify(criticalNotification);

    // Demonstrate dynamic subscription changes
    console.log('\n🔄 Demonstrating dynamic subscription management...');
    await this.sleep(1000);
    
    console.log('Unsubscribing SMS service...');
    this.notificationCenter.unsubscribe(this.smsService);
    
    await this.sleep(1000);
    const testNotification = new Notification(
      'notif-004',
      'Test Message',
      'This should only go to Email and Push services',
      NotificationPriority.MEDIUM
    );
    this.notificationCenter.notify(testNotification);

    // Show notification history
    console.log('\n📊 Notification History:');
    const history = this.notificationCenter.getNotificationHistory();
    history.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.priority}] ${notif.title} - ${notif.timestamp.toLocaleTimeString()}`);
    });

    console.log('\n✅ Observer Pattern Demo completed!');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}