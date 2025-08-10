'use server';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import { Page } from '@/models/page';

export default async function grabUsername({username}) {
  
  await mongoose.connect(process.env.MONGO_URI);

  const existingPageDoc = await Page.findOne({uri:username});
  if (existingPageDoc) {
    return false;
  } 
   
  const session = await getServerSession(authOptions);
  const newPage= await Page.create({
      uri:username,
      owner:session?.user?.email,
    });

    return {seccess:true,uri:newPage.uri};
  
}