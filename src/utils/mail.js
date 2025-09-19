import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "FixMyRide",
      link: process.env.CLIENT_URL,
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.genrate(options.mailgenContent);
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Error sending email:", error);
    console.error(
      "Email service failed silently. Make sure that you have provided your MailTrap credentiald in the .env file",
    );
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to FixMyRide! We're very excited to have you on board.",
      action: {
        instructions: "To get started with FixMyRide, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "You have requested to reset your password.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#DC4D2F", // Optional action button color
          text: "reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 20 minutes.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
