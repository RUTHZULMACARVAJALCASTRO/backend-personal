import mongoose, { Document } from 'mongoose';
export declare class DaySchedule {
    day: number;
    into: string;
    out: string;
    intoTwo: string;
    outTwo: string;
    toleranceInto: number;
    toleranceOut: number;
}
export declare class SpecialDaySchedule extends DaySchedule {
    name: string;
    permanente: boolean;
    dateRange?: Date[];
    usersAssigned: string[];
    isActive: boolean;
    createdAt: Date;
}
export declare class Schedule extends Document {
    name: string;
    scheduleNormal: DaySchedule[];
    scheduleSpecial?: SpecialDaySchedule[];
    isActive: boolean;
    createdAt: Date;
}
export declare const ScheduleSchema: mongoose.Schema<Schedule, mongoose.Model<Schedule, any, any, any, mongoose.Document<unknown, any, Schedule> & Schedule & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Schedule, mongoose.Document<unknown, {}, mongoose.FlatRecord<Schedule>> & mongoose.FlatRecord<Schedule> & {
    _id: mongoose.Types.ObjectId;
}>;
