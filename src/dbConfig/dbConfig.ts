import mongoose from "mongoose";

export async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log('MongoDB connected successfully')
        })

        connection.on('error',(err)=>{
            console.log("Error in database connection"+err)
        })

        process.exit()
        
    } catch (error) {
        console.log('DB connection error')
        console.log(error)
    }
}