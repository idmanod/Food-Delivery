import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

interface EmailContext {
  [key: string]: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private mailerService: MailerService) {}

  async sendMail({
    to,
    subject,
    template,
    context,
  }: {
    to: string;
    subject: string;
    template: string;
    context: EmailContext;
  }) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw new Error('Failed to send email');
    }
  }

  async sendActivationMail(to: string, activationToken: string) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      await this.sendMail({
        to,
        subject: 'Activate your account',
        template: './activation-mail',
        context: {
          activationCode,
          activationToken,
        },
      });
      return activationCode;
    } catch (error) {
      this.logger.error(
        `Failed to send activation email to ${to}`,
        error.stack,
      );
      throw new Error('Failed to send activation email');
    }
  }
}
