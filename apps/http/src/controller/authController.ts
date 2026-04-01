import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET as string;
import { prisma } from "../lib/prisma";
export const signup = async(req:Request ,res:Response ) =>{
    console.log("Signup request came");
console.log("signup request");
const {name,email,password} = req.body;
console.log(name,email,password);
try{
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
data:{email,password:hashedPassword,name},

    });
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 10000, 
      }
    });
    console.log("user name is");
    console.log(user.name);
    const token = jwt.sign({userId: user.id },JWT_SECRET);
    console.log("Token generated at signup:", token);
    console.log("About to send response:", {token});
    return res.status(200).json({token});
}
catch(e){
    console.error("Signup error:", e);
    return res.status(400).json({message:"User can't be created", error:e});
}
};


export const signin = async(req:Request,res:Response)=>{
    console.log("request to signin");
    const {email,password} = req.body;
    console.log(email,password);
    try{
        const user = await prisma.user.findUnique({where: {email}});
        console.log("user is");
        console.log(user);
        if(!user) return res.status(400).json({message:"Invalid Credentials"});
        const isValid =await bcrypt.compare(password,user.password);
        if(!isValid) return res.status(400).json({message:"Invalid Credentials"});
       const token = jwt.sign({userId: user.id},JWT_SECRET,{expiresIn: "30d"});
       console.log("token create at sign in is");
       console.log(token);
       console.log("About to send signin response:", {token});
        return res.json({token});
    } catch (e: any) {
  console.error("Signin error:", e);

  return res.status(500).json({
    message: "Signin failed",
    error: e.message,
  });
}
};