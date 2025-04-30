import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to SkillSync!",
      html: `
        <h1>Welcome to SkillSync, ${name}!</h1>
        <p>We're excited to have you join our community of tech professionals and clients.</p>
        <p>Get started by:</p>
        <ul>
          <li>Completing your profile</li>
          <li>Exploring available jobs</li>
          <li>Connecting with other professionals</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The SkillSync Team</p>
      `,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your SkillSync Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The SkillSync Team</p>
      `,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export const sendJobApplicationEmail = async (email, name, jobTitle) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "New Job Application Received",
      html: `
        <h1>New Job Application</h1>
        <p>Hello ${name},</p>
        <p>You have received a new application for the job: ${jobTitle}</p>
        <p>Log in to your dashboard to review the application.</p>
        <p>Best regards,<br>The SkillSync Team</p>
      `,
    });
  } catch (error) {
    console.error("Error sending job application email:", error);
  }
};
