import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, username: string, verifyCode: string) {
  try {
    // Construct the HTML content manually
    const emailHtml = `
      <html lang="en" dir="ltr">
        <head>
          <title>Verification Code</title>
          <style>
            body {
              font-family: 'Roboto', Verdana, sans-serif;
            }
            h2 {
              color: #4A90E2;
            }
            .content {
              margin-top: 20px;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h2>Hello ${username},</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <h3>${verifyCode}</h3>
          <p class="content">If you did not request this code, please ignore this email.</p>
        </body>
      </html>
    `;

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // For Gmail
      auth: {
        user: process.env.EMAIL_USER,  // Replace with your email
        pass: process.env.EMAIL_PASS,     // Use your app password
      },
    });

    // Set up the mail options
    const mailOptions = {
      from: '"Mystery Message" <noreply@mysterymessage.com>',  // Replace with your from email
      to: email,
      subject: 'Mystery Message | Verification Email',
      html: emailHtml,  // Send the manually constructed HTML as the email content
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Error sending verification code:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message || 'Failed to send verification email' };
    }
    return { success: false, message: 'Failed to send verification email' };
  }
}
