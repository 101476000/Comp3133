import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    joinDate: string;
    profilePicture?: string;
    address?: string;
    city?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        salary: { type: Number, required: true, min: 0 },
        joinDate: { type: String, required: true },
        profilePicture: { type: String },
        address: { type: String },
        city: { type: String },
        country: { type: String },
  },
  { timestamps: true }
  );

EmployeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
