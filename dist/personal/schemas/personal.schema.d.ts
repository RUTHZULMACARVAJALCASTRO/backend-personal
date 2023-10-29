import mongoose, { Document } from 'mongoose';
export declare class Personal extends Document {
    name: string;
    lastName: string;
    ci: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    unity: string;
    charge: string;
    schedule: string;
    file?: string;
    isActive: boolean;
}
export declare const PersonalSchema: mongoose.Schema<Personal, mongoose.Model<Personal, any, any, any, mongoose.Document<unknown, any, Personal> & Personal & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Personal, mongoose.Document<unknown, {}, mongoose.FlatRecord<Personal>> & mongoose.FlatRecord<Personal> & {
    _id: mongoose.Types.ObjectId;
}>;
