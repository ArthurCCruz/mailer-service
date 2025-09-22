import * as nodemailer from "nodemailer";
import * as logger from "firebase-functions/logger";
import { ENV } from "../config/env";

export interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config);
  }

  /**
   * Send a contact form email
   */
  async sendContactFormEmail(data: ContactFormData): Promise<void> {
    const mailOptions: EmailOptions = {
      from: ENV.EMAIL_USER,
      to: ENV.EMAIL_USER, // Send to yourself
      subject: `Contact Form Message from ${data.name}`,
      html: this.generateContactFormHtml(data),
      text: this.generateContactFormText(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info("Contact form email sent successfully", {
        name: data.name,
        email: data.email,
        messageLength: data.message.length,
      });
    } catch (error) {
      logger.error("Error sending contact form email", error);
      throw new Error("Failed to send email");
    }
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
      logger.info("Email sent successfully", {
        to: options.to,
        subject: options.subject,
      });
    } catch (error) {
      logger.error("Error sending email", error);
      throw new Error("Failed to send email");
    }
  }

  /**
   * Test the email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info("Email configuration verified successfully");
      return true;
    } catch (error) {
      logger.error("Email configuration verification failed", error);
      return false;
    }
  }

  /**
   * Generate HTML content for contact form email
   */
  private generateContactFormHtml(data: ContactFormData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong style="color: #007bff;">Name:</strong> ${this.escapeHtml(data.name)}</p>
          <p style="margin: 10px 0;"><strong style="color: #007bff;">Email:</strong> ${this.escapeHtml(data.email)}</p>
          <p style="margin: 10px 0;"><strong style="color: #007bff;">Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #007bff;">
            ${this.escapeHtml(data.message).replace(/\n/g, "<br>")}
          </div>
        </div>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #6c757d; font-size: 12px; text-align: center;">
          <em>Sent from your contact form</em>
        </p>
      </div>
    `;
  }

  /**
   * Generate plain text content for contact form email
   */
  private generateContactFormText(data: ContactFormData): string {
    return `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
Sent from your contact form
    `.trim();
  }

  /**
   * Escape HTML characters to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    };

    return text.replace(/[&<>"']/g, (match) => map[match]);
  }
}

/**
 * Create a configured mailer service instance
 */
export function createMailerService(): MailerService {
  const emailConfig: EmailConfig = {
    service: "gmail",
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  };

  return new MailerService(emailConfig);
}
