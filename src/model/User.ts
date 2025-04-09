import bcrypt from 'bcryptjs';
import mongoose, {Schema, Document } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
};

const MessageSchema: Schema<Message> = new Schema ({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
};

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^.{8,}$/, 'Please enter valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character'
    ]
  },
  verifyCode: {
    type: String,
    required: [true, 'Varify Code is required'],
    match: [/^\d{6}$/, 'Verify Code must be a 6-digit number']
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

UserSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

const UserModel = mongoose.models.Users as mongoose.Model<User> || mongoose.model<User>("Users", UserSchema);

export default UserModel;