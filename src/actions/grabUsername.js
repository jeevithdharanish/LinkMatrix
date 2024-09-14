// "use server";
// import { Page } from "@/models/page";
// import mongoose from "mongoose";
// import {getServerSession} from "next-auth";
// import {authOptions} from "@/app/api/auth/[...nextauth]/route";
// import toast from "react-hot-toast";

// // require('dotenv').config();

// export default async function grabUsername(formData) {
//     const username = formData.get('username');

//     // Check if already connected to avoid reconnection
//     // if (mongoose.connection.readyState === 0) {
//     //     await
//     //     mongoose.connect(process.env.MONGO_URI, {
//     //         useNewUrlParser: true,
//     //         useUnifiedTopology: true,
//     //     });
//     // }
//     mongoose.connect(process.env.MONGO_URI);
//     const existingPageDoc = await Page.findOne({ uri: username });
//     if (existingPageDoc) {
//             // return false;

//         return { success: false, message: "Username is taken" };
//     } else {
//            // const newPage= await Page.create({uri:username});
//            // return newPage;
//         // return await Page.create({uri:username});
//          const session =await getServerSession(authOptions);
//          const newPage = await Page.create(
//              {
//                  uri: username,
//                  owner:session?.user?.email,
//              });
//           return { success: true, message: "Username created", uri: newPage.uri };
//      }
// }


'use server';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { Page } from "@/models/page";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export default async function grabUsername(formData) {
  const username = formData.get('username');
  mongoose.connect(process.env.MONGO_URI);
  const existingPageDoc = await Page.findOne({uri:username});
  if (existingPageDoc) {
    return false;
  } else {
    const session = await getServerSession(authOptions);
    return await Page.create({
      uri:username,
      owner:session?.user?.email,
    });
  }
}