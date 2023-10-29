import mongoose, { Document } from 'mongoose';
export declare class Charge extends Document {
    name: string;
    description: string;
    isActive: boolean;
}
export declare const ChargeSchema: mongoose.Schema<Charge, mongoose.Model<Charge, any, any, any, mongoose.Document<unknown, any, Charge> & Charge & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Charge, mongoose.Document<unknown, {}, mongoose.FlatRecord<Charge>> & mongoose.FlatRecord<Charge> & {
    _id: mongoose.Types.ObjectId;
}>;
