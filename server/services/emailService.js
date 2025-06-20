const nodemailer = require("nodemailer");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Create transporter
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  applicationReceived: (userName, jobTitle, companyName) => ({
    subject: `Application Received - ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Received!</h2>
        <p>Hi ${userName},</p>
        <p>Great news! Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received and is being reviewed.</p>
        <p>We'll keep you updated on the status of your application. You can also track your application progress in your dashboard.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <ul>
            <li>Your application will be reviewed by the hiring team</li>
            <li>You'll receive updates on your application status</li>
            <li>If selected, you'll be contacted for next steps</li>
          </ul>
        </div>
        <p>Best of luck with your application!</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),

  applicationStatusUpdate: (userName, jobTitle, companyName, status) => ({
    subject: `Application Update - ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Status Update</h2>
        <p>Hi ${userName},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">New Status: <span style="color: #059669;">${status}</span></h3>
        </div>
        <p>Log in to your dashboard to view more details and take any required actions.</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),

  interviewScheduled: (
    userName,
    jobTitle,
    companyName,
    interviewDate,
    interviewType
  ) => ({
    subject: `Interview Scheduled - ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Interview Scheduled!</h2>
        <p>Hi ${userName},</p>
        <p>Congratulations! You've been selected for an interview for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Interview Details:</h3>
          <p><strong>Date:</strong> ${new Date(
            interviewDate
          ).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(
            interviewDate
          ).toLocaleTimeString()}</p>
          <p><strong>Type:</strong> ${interviewType}</p>
        </div>
        <p>Please prepare for your interview and make sure to arrive on time. Good luck!</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),

  newJobMatch: (userName, jobTitle, companyName, jobId) => ({
    subject: `New Job Match - ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Job Match Found!</h2>
        <p>Hi ${userName},</p>
        <p>We found a great job opportunity that matches your profile: <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Why this job matches you:</h3>
          <ul>
            <li>Skills alignment with your profile</li>
            <li>Location preferences match</li>
            <li>Experience level suitable</li>
          </ul>
        </div>
        <p>Don't miss this opportunity! Apply now to increase your chances of landing this position.</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),

  weeklyDigest: (userName, jobs, applications) => ({
    subject: `Your Weekly Job Digest - SkillSync`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Weekly Job Digest</h2>
        <p>Hi ${userName},</p>
        <p>Here's your weekly summary of job opportunities and application updates:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">New Job Opportunities (${jobs.length})</h3>
          ${jobs
            .map(
              (job) => `
            <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
              <h4 style="margin: 0;">${job.title}</h4>
              <p style="margin: 5px 0; color: #6b7280;">${job.company} • ${job.location}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Application Updates (${
            applications.length
          })</h3>
          ${applications
            .map(
              (app) => `
            <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
              <h4 style="margin: 0;">${app.job.title}</h4>
              <p style="margin: 5px 0; color: #6b7280;">Status: ${app.status}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <p>Keep up the great work with your job search!</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),

  welcomeEmail: (userName) => ({
    subject: `Welcome to SkillSync - Let's Get Started!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to SkillSync!</h2>
        <p>Hi ${userName},</p>
        <p>Welcome to SkillSync! We're excited to help you find your next great opportunity.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Getting Started:</h3>
          <ol>
            <li>Complete your profile with your skills and experience</li>
            <li>Upload your resume for AI-powered matching</li>
            <li>Browse and apply to relevant job opportunities</li>
            <li>Track your applications and interview progress</li>
          </ol>
        </div>

        <p>Ready to start your job search journey? Let's get you connected with great opportunities!</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),

  passwordReset: (userName, resetLink) => ({
    subject: `Password Reset Request - SkillSync`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>Best regards,<br>The SkillSync Team</p>
      </div>
    `,
  }),
};

// Email sending functions
const emailService = {
  // Send application received notification
  async sendApplicationReceived(applicationId) {
    try {
      const application = await Application.findById(applicationId)
        .populate("job")
        .populate("user");

      if (!application) return;

      const template = emailTemplates.applicationReceived(
        application.user.name,
        application.job.title,
        application.job.company
      );

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(
        `Application received email sent to ${application.user.email}`
      );
    } catch (error) {
      console.error("Error sending application received email:", error);
    }
  },

  // Send application status update
  async sendApplicationStatusUpdate(applicationId, newStatus) {
    try {
      const application = await Application.findById(applicationId)
        .populate("job")
        .populate("user");

      if (!application) return;

      const template = emailTemplates.applicationStatusUpdate(
        application.user.name,
        application.job.title,
        application.job.company,
        newStatus
      );

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Status update email sent to ${application.user.email}`);
    } catch (error) {
      console.error("Error sending status update email:", error);
    }
  },

  // Send interview scheduled notification
  async sendInterviewScheduled(interviewId) {
    try {
      const interview = await Interview.findById(interviewId)
        .populate("application")
        .populate("application.job")
        .populate("application.user");

      if (!interview) return;

      const template = emailTemplates.interviewScheduled(
        interview.application.user.name,
        interview.application.job.title,
        interview.application.job.company,
        interview.scheduledDate,
        interview.type
      );

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: interview.application.user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(
        `Interview scheduled email sent to ${interview.application.user.email}`
      );
    } catch (error) {
      console.error("Error sending interview scheduled email:", error);
    }
  },

  // Send new job match notification
  async sendNewJobMatch(userId, jobId) {
    try {
      const user = await User.findById(userId);
      const job = await Job.findById(jobId);

      if (!user || !job) return;

      const template = emailTemplates.newJobMatch(
        user.name,
        job.title,
        job.company,
        job._id
      );

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Job match email sent to ${user.email}`);
    } catch (error) {
      console.error("Error sending job match email:", error);
    }
  },

  // Send weekly digest
  async sendWeeklyDigest(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Get recent jobs and applications
      const recentJobs = await Job.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(5);

      const userApplications = await Application.find({ user: userId })
        .populate("job")
        .sort({ updatedAt: -1 })
        .limit(5);

      const template = emailTemplates.weeklyDigest(
        user.name,
        recentJobs,
        userApplications
      );

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Weekly digest sent to ${user.email}`);
    } catch (error) {
      console.error("Error sending weekly digest:", error);
    }
  },

  // Send welcome email
  async sendWelcomeEmail(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const template = emailTemplates.welcomeEmail(user.name);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  },

  // Send password reset email
  async sendPasswordReset(userId, resetToken) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      const template = emailTemplates.passwordReset(user.name, resetLink);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  },

  // Send bulk emails (for admin notifications)
  async sendBulkEmail(userIds, subject, htmlContent) {
    try {
      const users = await User.find({ _id: { $in: userIds } });

      const emailPromises = users.map((user) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject,
          html: htmlContent,
        })
      );

      await Promise.all(emailPromises);
      console.log(`Bulk email sent to ${users.length} users`);
    } catch (error) {
      console.error("Error sending bulk email:", error);
    }
  },
};

module.exports = emailService;
