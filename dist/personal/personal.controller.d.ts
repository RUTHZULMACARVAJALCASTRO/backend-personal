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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { HttpService } from '@nestjs/axios';
import { FilterDto } from 'src/common/dto/filter.dto';
export declare class PersonalController {
    private readonly personalService;
    private httpService;
    constructor(personalService: PersonalService, httpService: HttpService);
    create(createPersonalDto: CreatePersonalDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/personal.schema").Personal> & import("./schemas/personal.schema").Personal & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/personal.schema").Personal> & import("./schemas/personal.schema").Personal & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    filterParams(filterDto: FilterDto): Promise<any[] | {
        data: (import("mongoose").Document<unknown, {}, import("./schemas/personal.schema").Personal> & import("./schemas/personal.schema").Personal & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/personal.schema").Personal> & import("./schemas/personal.schema").Personal & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findUsersCharge(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/personal.schema").Personal> & import("./schemas/personal.schema").Personal & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findUsersSchedule(id: string): Promise<import("./schemas/personal.schema").Personal[]>;
    update(id: string, updatePersonalDto: UpdatePersonalDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/personal.schema").Personal> & import("./schemas/personal.schema").Personal & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteUsers(): Promise<void>;
}
