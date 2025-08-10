import clientPromise from "@/libs/mongoClient";
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    session: async ({ session }) => {
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After successful sign-in, redirect to account page
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default redirect to account page after sign-in
      return `${baseUrl}/account`;
    },
  },
  pages: {
    error: '/login'
  }
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "@/libs/mongoClient";
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { User } from "@/models/User";
// import bcrypt from 'bcrypt';

// export const authOptions = {
//   secret: process.env.SECRET,
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     // Existing Google Provider
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     // **NEW** Credentials Provider for Email/Password
//     CredentialsProvider({
//       name: 'Credentials',
//       id: 'credentials', // An identifier for this provider
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "test@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         console.log('--- Authorize Function Running ---');
//     console.log('Credentials received:', credentials);
//         const { email, password } = credentials;

//         // 1. Find the user in the database by email
//         const user = await User.findOne({ email });
//          console.log('User found in DB:', user);
//         if (!user) {
//           console.log('Result: User not found.');
//           // User not found
//           return null;
//         }

//         // 2. Check if the user signed up via password (i.e., they have a password hash)
//         if (!user.password) {
//           console.log('Result: User exists but has no password (likely a Google account).');
//           // This prevents users who signed up with Google from trying to log in with a password
//           // You could throw an error here to give a more specific message
//           return null;
//         }
// console.log('Plain password from form:', password);
//     console.log('Hashed password from DB:', user.password);
//         // 3. Compare the provided password with the hashed password in the DB
//         const isPasswordOk = bcrypt.compareSync(password, user.password);
//             console.log('Password comparison result (isPasswordOk):', isPasswordOk);
//     console.log('---------------------------------');
//         if (isPasswordOk) {
//           // Passwords match, return the user object
//           return user;
//         }

//         // Passwords do not match
//         return null;
//       },
//       // 4. Allow automatic linking of accounts with the same email
//       allowDangerousEmailAccountLinking: true,
//     })
//   ],
//   callbacks: {
//     // This callback remains the same, it ensures the session object is returned
//     session: async ({ session }) => {
//       return session;
//     },
//     // Your redirect callback remains useful
//     async redirect({ url, baseUrl }) {
//       // After successful sign-in, allow redirection to any page on the site
//       if (url.startsWith(baseUrl)) {
//         return url;
//       }
//       // By default, redirect to the account page after sign-in
//       return `${baseUrl}/account`;
//     },
//   },
//   pages: {
//     // If an error occurs (e.g., failed login), redirect to your login page
//     error: '/login',
//   }
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };