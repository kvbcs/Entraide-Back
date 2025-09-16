import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { users } from 'generated/prisma';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: this.config.get('MAILER_SECURE') === 'true',
      auth: {
        user: this.config.get('SMTP_EMAIL'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendUserConfirmation(user: users, token: string) {
    const url = `${this.config.get('SERVER_URL')}/activate?token=${token}`;
    const emailHtml = `<p>Bonjour ${user.first_name} ${user.last_name},</p>
        <p>Merci d'avoir créé votre compte sur l'Association Aixoise d'Entraide !</p>
            <a href='${url}'>Cliquez sur ce lien pour activer votre compte.</a>
        <p>Cet email ne vous ai pas destiné ? Vous pouvez simplement l'ignorer.</p>`;

    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: user.email,
      subject: 'Activer votre compte A.A.E',
      html: emailHtml,
    });
  }
}
