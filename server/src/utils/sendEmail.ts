import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(userReceiver: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("test account: ", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'fqdff6krar3t7slv@ethereal.email', // generated ethereal user
      pass: 'AyXbm9q19Zccm1WyH1', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Theedit 👻" <noreply@theddit.com>', // sender address
    to: userReceiver, // list of receivers
    subject: "Change your password", // Subject line
    html
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

