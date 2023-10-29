"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_schema_1 = require("./schemas/schedule.schema");
const schedule_1 = require("@nestjs/schedule");
let ScheduleService = class ScheduleService {
    constructor(scheduleModel) {
        this.scheduleModel = scheduleModel;
        this.defaultLimit = 10;
    }
    async create(createScheduleDto) {
        try {
            const schedule = await this.scheduleModel.create(createScheduleDto);
            return schedule;
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('No se pudo crear el horario');
        }
    }
    async findAll() {
        const scheduls = await this.scheduleModel.find();
        return scheduls;
    }
    async findOne(id) {
        try {
            const schedule = await this.scheduleModel.findById({ _id: id });
            return schedule;
        }
        catch (error) {
            throw new common_1.BadRequestException('Not found schedule');
        }
    }
    async filterParams(filterScheduleDto) {
        const { name, isActive, limit = this.defaultLimit, page = 1 } = filterScheduleDto;
        const filters = {};
        if (name)
            filters.name = new RegExp(name, 'i');
        if (isActive !== undefined)
            filters.isActive = isActive;
        const offest = (page - 1) * limit;
        const schedules = await this.scheduleModel.find(filters)
            .limit(limit)
            .skip(offest)
            .select('-__v');
        const total = await this.scheduleModel.countDocuments(filters).exec();
        return {
            data: schedules,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }
    async update(id, updateScheduleDto) {
        const scheduleUpdate = await this.findOne(id);
        try {
            await scheduleUpdate.updateOne(updateScheduleDto);
            return Object.assign(Object.assign({}, scheduleUpdate.toJSON()), updateScheduleDto);
        }
        catch (error) {
            throw new common_1.BadRequestException('No se pudo actualizar el horario');
        }
    }
    async deactivateMainSchedule(id) {
        try {
            const schedule = await this.scheduleModel.findById(id);
            schedule.isActive = false;
            await schedule.save();
        }
        catch (error) {
            throw new common_1.BadRequestException(`No se encontro el horario con el id: ${id}`);
        }
    }
    async activateMainSchedule(id) {
        const schedule = await this.scheduleModel.findById(id);
        if (schedule && schedule.isActive === false) {
            schedule.isActive = true;
        }
        else {
            throw new common_1.BadRequestException(`El horario con el id: ${id} ya se encuentra activo`);
        }
    }
    async remove(id) {
        try {
            await this.scheduleModel.findByIdAndRemove(id).exec();
        }
        catch (error) {
            throw new common_1.NotFoundException(`Schedule with ID ${id} not found.`);
        }
    }
    async deactivateExpiredDateRanges() {
        const now = new Date();
        const currentDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        const schedules = await this.scheduleModel.find({
            isActive: true,
            'scheduleSpecial.dateRange.1': { $lt: currentDate }
        });
        for (const schedule of schedules) {
            for (const special of schedule.scheduleSpecial) {
                if (special.dateRange && special.dateRange[1] < currentDate) {
                    special.isActive = false;
                }
            }
            await schedule.save();
        }
    }
    async handleInactiveDateRanges() {
        console.log('Cron job started.');
        await this.deactivateExpiredDateRanges();
        console.log('Cron job finished.');
    }
};
exports.ScheduleService = ScheduleService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * 1-6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleService.prototype, "handleInactiveDateRanges", null);
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schedule_schema_1.Schedule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map