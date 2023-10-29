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
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { Personal } from './schemas/personal.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { FilterDto } from 'src/common/dto/filter.dto';
import { Schedule } from 'src/schedule/schemas/schedule.schema';
import { Charge } from 'src/charge/schemas/charge.schema';
export declare class PersonalService {
    private readonly personalModel;
    private readonly chargeModel;
    private readonly ScheduleModel;
    private httpService;
    private defaultLimit;
    constructor(personalModel: Model<Personal>, chargeModel: Model<Charge>, ScheduleModel: Model<Schedule>, httpService: HttpService);
    create(createPersonalDto: CreatePersonalDto): Promise<import("mongoose").Document<unknown, {}, Personal> & Personal & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Personal> & Personal & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Personal> & Personal & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    filterParams(filterDto: FilterDto): Promise<any[] | {
        data: (import("mongoose").Document<unknown, {}, Personal> & Personal & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        totalPages: number;
    }>;
    findUsersByCharge(chargeId: string): Promise<(import("mongoose").Document<unknown, {}, Personal> & Personal & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findUsersBySchedule(scheduleId: string): Promise<Personal[]>;
    update(id: string, updatePersonalDto: UpdatePersonalDto): Promise<import("mongoose").Document<unknown, {}, Personal> & Personal & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: number): string;
    private getEntityName;
    private isChargeExist;
    private isScheduleExists;
    delete(): Promise<void>;
}
