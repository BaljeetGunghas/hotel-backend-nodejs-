"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsEmailTamplate = exports.WelcomeEmailTamplate = exports.VerifyEmailTamplate = void 0;
const VerifyEmailTamplate = (name, code) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px 30px;
    }
    .email-body h2 {
      font-size: 20px;
      color: #4CAF50;
      margin-bottom: 10px;
    }
    .email-body p {
      margin: 10px 0;
    }
    .verification-code {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #4CAF50;
      margin: 20px 0;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 20px;
      padding: 10px 30px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="email-body">
      <h2>Hello, ${name.toUpperCase()}</h2>
      <p>Thank you for signing up for <strong>Velvet Haven</strong>! Please use the following code to verify your email address:</p>
      <div class="verification-code">${code}</div>
      <p>This code will expire in 1 Day. If you did not request this verification, you can safely ignore this email.</p>
      <p>Best regards,<br><strong>Velvet Haven Team</strong></p>
    </div>
    <div class="email-footer">
      © 2024 Velvet Haven. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
exports.VerifyEmailTamplate = VerifyEmailTamplate;
const WelcomeEmailTamplate = (name) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Velvet Haven</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 26px;
    }
    .email-body {
      padding: 20px 30px;
    }
    .email-body h2 {
      font-size: 22px;
      color: #4CAF50;
      margin-bottom: 10px;
    }
    .email-body p {
      margin: 10px 0;
    }
    .cta-button {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 20px;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 4px;
    }
    .cta-button:hover {
      background-color: #45a049;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 20px;
      padding: 10px 30px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Velvet Haven!</h1>
    </div>
    <div class="email-body">
      <h2>Hello, ${name}</h2>
      <p>We're thrilled to have you join the <strong>Velvet Haven</strong> community. Your journey with us begins here, and we’re excited to help you get started!</p>
      <p>To explore the features and benefits of your account, click the button below:</p>
      <a href="[https://velvet-haven.netlify.app/]" class="cta-button">Get Started</a>
      <p>If you have any questions or need assistance, feel free to reply to this email. Our team is always here to help you.</p>
      <p>Best regards,<br><strong>The Velvet Haven Team</strong></p>
    </div>
    <div class="email-footer">
      © 2024 Velvet Haven. All rights reserved. | <a href="[UNSUBSCRIBE_LINK]">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
`;
};
exports.WelcomeEmailTamplate = WelcomeEmailTamplate;
const ContactUsEmailTamplate = (name, email, subject, message) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px 0;
            font-size: 20px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">New Contact Request</div>
        <div class="content">
            <p><strong>Name:</strong> {${name}}</p>
            <p><strong>Email:</strong> {${email}}</p>
            <p><strong>Subject:</strong> {${subject}}</p>
            <p><strong>Message:</strong></p>
            <p>{${message}}</p>
        </div>
        <div class="footer">
            <p>This message was sent from your contact form.</p>
        </div>
    </div>
</body>
</html>

  `;
};
exports.ContactUsEmailTamplate = ContactUsEmailTamplate;
