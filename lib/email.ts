
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.exmail.qq.com", // Tencent Enterprise Mail
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async (subject: string, html: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_TO) {
        console.warn("Email configuration missing, skipping email.");
        return;
    }

    try {
        await transporter.sendMail({
            from: `"预约系统" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: subject,
            html: html,
        });
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
