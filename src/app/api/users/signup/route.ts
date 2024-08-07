import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/user.model";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { hash } from "crypto";
import { sendEmail } from "@/helper/mailer";

connect()


export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()
        const {username,email,password}=reqBody

        console.log(reqBody)

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error:'user already exist'},{status:400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await hash(password,salt)

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser)


        //send Email to user
        await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})

        return NextResponse.json({ 
            message:"user registered successfully",
            success:true,
            savedUser
        },{status:200})


    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}