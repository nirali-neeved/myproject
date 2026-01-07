import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  try {
    console.log(
      "EMAIL_USER is",
      process.env.EMAIL_USER ? "Loded" : "Not Loded"
    );
    console.log(
      "EMAIL_PASS is",
      process.env.EMAIL_PASS ? "Loded" : "Not Loded"
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error(error.message,"Transporter error");
  }
};
