import { verifyEmailHtml } from "@/wab/server/emails/email-html";
import { createTransport, SentMessageInfo, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { appConfig } from "../nfigure-config";

export interface Mailer {
  sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo>;
}

class NodeMailer implements Mailer {
  constructor(private transporter: Transporter) {}
  async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    return this.transporter.sendMail(mailOptions);
  }
}

class ConsoleMailer implements Mailer {
  async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    console.log(`SENDING MAIL TO CONSOLE`, mailOptions);

    // Run verification during development
    if (typeof mailOptions.html === "string") {
      verifyEmailHtml(mailOptions.html);
    }

    // Delay to simulate sending
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`MAIL SENT`);
  }
}

export function createMailer() {
  if (appConfig.nodeEnv === "production") {
    return new NodeMailer(createTransport(appConfig.smtpTransportOption));
  } else {
    return new ConsoleMailer();
  }
}
