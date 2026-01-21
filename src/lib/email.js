import nodemailer from 'nodemailer';

// Create reusable transporter using neo.space SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp0001.neo.space',
    port: 465,
    secure: true, // Use SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send a welcome email with login credentials
 * @param {string} to - Recipient email
 * @param {string} firstName - User's first name
 * @param {string} password - Generated password
 * @returns {Promise<boolean>}
 */
export async function sendWelcomeEmail(to, firstName, password) {
  const transporter = createTransporter();
  
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const mailOptions = {
    from: `"Survey App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Account Has Been Created - Login Credentials',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hi <strong>${firstName}</strong>,</p>
          
          <p style="font-size: 16px;">Thank you for completing your registration! Your account has been successfully created.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your login credentials:</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Password:</strong> <code style="background: #e9ecef; padding: 3px 8px; border-radius: 4px;">${password}</code></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}/login" style="display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Login to Your Account</a>
          </div>
          
          <p style="font-size: 14px; color: #666;">For security reasons, we recommend changing your password after your first login.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not register for an account, please ignore this email.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${firstName},

Thank you for completing your registration! Your account has been successfully created.

Your login credentials:
Email: ${to}
Password: ${password}

Login here: ${loginUrl}/login

For security reasons, we recommend changing your password after your first login.

If you did not register for an account, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send password reset or credential resend email
 * @param {string} to - Recipient email
 * @param {string} firstName - User's first name
 * @param {string} password - New/Resent password
 * @returns {Promise<boolean>}
 */
export async function sendCredentialsEmail(to, firstName, password) {
  const transporter = createTransporter();
  
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const mailOptions = {
    from: `"Survey App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Login Credentials',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Login Credentials</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hi <strong>${firstName}</strong>,</p>
          
          <p style="font-size: 16px;">Here are your login credentials as requested:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Password:</strong> <code style="background: #e9ecef; padding: 3px 8px; border-radius: 4px;">${password}</code></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}/login" style="display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Login Now</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not request this email, please contact support.
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Credentials email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send credentials email:', error);
    return false;
  }
}

/**
 * Generate a random password
 * @param {number} length - Password length (default 10)
 * @returns {string}
 */
export function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
