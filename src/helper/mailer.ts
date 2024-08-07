import User from '@/model/user.model';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'


export const sendEmail = async({email,emailType,userId}:any)=>{
    try {

        const hashedToken = await bcryptjs.hash(userId,10)

        if(emailType=='VERIFY'){
            await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry:Date.now()+3600000})
        }
        else if(emailType=='RESET'){
            await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now()+3600000})
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "7a1073fe9e1678",
              pass: "1333bca8706449"
            }
          });


          const mailOption = {
            from: 'spal2919@gmail.com',
            to: email,
            subject: emailType=='VERIFY'?'verify your email':'reset your password',
            html: `<p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here </a> to ${emailType=='VERIFY'?"verify your email":"reset your password"}
            or copy or paste the link below in your browser </br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          }
          const mailResponse = await transport.sendMail(mailOption)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}