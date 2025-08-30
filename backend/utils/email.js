const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Devnovate Blog" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  blogSubmitted: (userName, blogTitle) => ({
    subject: 'Blog Submitted for Review',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Blog Submitted Successfully!</h2>
        <p>Hi ${userName},</p>
        <p>Your blog post "<strong>${blogTitle}</strong>" has been submitted for review.</p>
        <p>Our admin team will review your submission and you'll receive a notification once it's approved or if any changes are needed.</p>
        <p>Thank you for contributing to the Devnovate community!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),

  blogApproved: (userName, blogTitle, blogSlug) => ({
    subject: 'Blog Approved and Published!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Congratulations! Your Blog is Live!</h2>
        <p>Hi ${userName},</p>
        <p>Great news! Your blog post "<strong>${blogTitle}</strong>" has been approved and is now live on Devnovate.</p>
        <p>Your article is now visible to our community and can be found at:</p>
        <a href="${process.env.CLIENT_URL}/blog/${blogSlug}" style="color: #007bff;">View Your Published Blog</a>
        <p>Keep up the great work and thank you for sharing your knowledge!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Best regards,<br>The Devnovate Team</p>
      </div>
    `
  }),

  blogRejected: (userName, blogTitle, reason) => ({
    subject: 'Blog Submission Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Blog Submission Feedback</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for submitting your blog post "<strong>${blogTitle}</strong>" to Devnovate.</p>
        <p>After review, we're unable to publish this submission at this time. Here's the feedback:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0;">
          <p><strong>Feedback:</strong> ${reason}</p>
        </div>
        <p>Please feel free to revise your submission based on this feedback and resubmit. We appreciate your understanding and look forward to your future contributions!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Best regards,<br>The Devnovate Team</p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
