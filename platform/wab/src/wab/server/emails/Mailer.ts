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
    // Delay to simulate sending
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`MAIL SENT`);
  }
}

export function createMailer() {
  if (appConfig.nodeEnv === "production") {
    return new NodeMailer(
      createTransport({
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 587,
        auth: appConfig.smtpAuth,
      })
    );
  } else {
    return new ConsoleMailer();
  }
}
