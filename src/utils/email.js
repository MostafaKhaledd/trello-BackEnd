import nodemailer from "nodemailer";
const sendEmail = async ({ to, cc, bcc, subject, text, html, attachments = [] } = {}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from: `"Backend Developer" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });
    console.log(info);
}
export default sendEmail