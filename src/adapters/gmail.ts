import nodemailer from "nodemailer"
import {SETTINGS} from "../settings";

type emailOptions = {
   sendTo: string
   subject: string
   body: string
}

export const sendRegistrationMail = async (mOptions: emailOptions) => {
   const transporter = nodemailer.createTransport({
      // @ts-ignore
      service: 'gmail',
      // port: 465,
      // host: "smtp.gmail.com",
      secure: false,
      auth: {
         user: SETTINGS.EMAIL.ACCOUNT,
         pass: SETTINGS.EMAIL.PASSWORD,
      },
   });

   return await transporter.sendMail({
      from: '"Vitaly Benevolskiy" <vbenevolskiy@gmail.com>',
      to: mOptions.sendTo,
      subject: mOptions.subject,
      html: mOptions.body,
   })
}