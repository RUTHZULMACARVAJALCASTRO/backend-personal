import mongoose, { Document } from 'mongoose';
import { Personal } from 'src/personal/schemas/personal.schema';
export declare class License extends Document {
    personal: Personal;
    licenseType: string;
    descripcion: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}
export declare const LicenseSchema: mongoose.Schema<License, mongoose.Model<License, any, any, any, mongoose.Document<unknown, any, License> & License & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, License, mongoose.Document<unknown, {}, mongoose.FlatRecord<License>> & mongoose.FlatRecord<License> & {
    _id: mongoose.Types.ObjectId;
}>;
