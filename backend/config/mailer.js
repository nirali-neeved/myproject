import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// const verifyMailer = async () => {
//   try {
//     await transporter.verify();
//     console.log("Mailer ready");
//   } catch (error) {
//     console.log("Mailer error", error);
//   }
// };

// verifyMailer()

export default transporter;
