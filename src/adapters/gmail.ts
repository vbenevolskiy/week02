import nodemailer from "nodemailer"
import {SETTINGS} from "../settings";

type emailOptions = {
   sendTo: string
   subject: string
   body: string
}

export const sendRegistrationMail = async (mOptions: emailOptions) => {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: SETTINGS.EMAIL.ACCOUNT,
         password: SETTINGS.EMAIL.PASSWORD,
      },
   })

   let result = await transporter.sendMail({
      from: '"Vitaly Benevolskiy" <vbenevolskiy@gmail.com>',
      to: mOptions.sendTo,
      subject: mOptions.subject,
      html: mOptions.body,
   })
}