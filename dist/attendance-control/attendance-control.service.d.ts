/// <reference types="node" />
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
import { CreateAttendanceControlDto } from './dto/create-attendance-control.dto';
import { UpdateAttendanceControlDto } from './dto/update-attendance-control.dto';
import { Personal } from 'src/personal/schemas/personal.schema';
import { Model } from 'mongoose';
import { Schedule } from 'src/schedule/schemas/schedule.schema';
import { PersonalAttendance } from './schemas/attendance-control.schema';
import { GenerateReportService } from 'src/generate-report/generate-report.service';
export declare class AttendanceControlService {
    private readonly generateReportAttendance;
    private readonly personalAttendanceModel;
    private readonly personalModel;
    private readonly scheduleModel;
    constructor(generateReportAttendance: GenerateReportService, personalAttendanceModel: Model<PersonalAttendance>, personalModel: Model<Personal>, scheduleModel: Model<Schedule>);
    create(createAttendanceControlDto: CreateAttendanceControlDto): string;
    findAll(): Promise<PersonalAttendance[]>;
    findOne(personalId: string): Promise<import("mongoose").Document<unknown, {}, PersonalAttendance> & PersonalAttendance & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: number, updateAttendanceControlDto: UpdateAttendanceControlDto): string;
    remove(): Promise<void>;
    registerAttendance(base: string): Promise<string>;
    private sendImageToRecognitionSystem;
    private processAttendance;
    private processSchedule;
    private createAttendanceRecord;
    private createDayAttendanceDetail;
    private handleControlPoint;
    private createRecord;
    private infraccionFormat;
    private convertHourToDecimal;
    private getCurrentDateTimeInfo;
    private determineShift;
    private hasEntranceRecordedForShift;
    findOneReport(personalId: string): Promise<Buffer>;
}
