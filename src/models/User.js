import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
});

export const User = models?.User || model('User', UserSchema);

// import {model, models, Schema} from "mongoose";

// const UserSchema = new Schema({
//     name: { type: String }, // Keep name optional for email signups
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true,
//     },
//     password: {
//         type: String,
//         validate: {
//             validator: (pass) => !pass || pass.length >= 5,
//             message: 'Password must be at least 5 characters long.',
//         },
//     },
//     image: { type: String }, // For Google profile picture
//     emailVerified: { type: Date }, // From NextAuth OAuth
// }, { timestamps: true });

// export const User = models?.User || model('User', UserSchema);