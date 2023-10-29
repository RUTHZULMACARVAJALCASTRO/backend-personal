/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
export declare class EntranceRecord {
    hour: string;
    tolerancie: number;
    marketHour: string;
    infraccion: string;
    type: string;
    status: string;
    shift: string;
}
export declare class ExitRecord {
    hour: string;
    tolerance: number;
    marketHour: string;
    infraccion: string;
    type: string;
    status: string;
    shift: string;
}
export declare class DailyAttendanceDetail {
    date: string;
    specialDay: string;
    entrances: EntranceRecord[];
    exits: ExitRecord[];
}
export declare class PersonalAttendance extends Document {
    personalId: string;
    name: string;
    lastName: string;
    ci: string;
    schedule: string;
    attendanceDetail: DailyAttendanceDetail[];
}
export declare const PersonalAttendanceSchema: import("mongoose").Schema<PersonalAttendance, import("mongoose").Model<PersonalAttendance, any, any, any, Document<unknown, any, PersonalAttendance> & PersonalAttendance & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PersonalAttendance, Document<unknown, {}, import("mongoose").FlatRecord<PersonalAttendance>> & import("mongoose").FlatRecord<PersonalAttendance> & {
    _id: import("mongoose").Types.ObjectId;
}>;
