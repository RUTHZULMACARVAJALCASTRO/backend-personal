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
exports.PersonalService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const personal_schema_1 = require("./schemas/personal.schema");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const axios_2 = require("axios");
const schedule_schema_1 = require("../schedule/schemas/schedule.schema");
const charge_schema_1 = require("../charge/schemas/charge.schema");
let PersonalService = class PersonalService {
    constructor(personalModel, chargeModel, ScheduleModel, httpService) {
        this.personalModel = personalModel;
        this.chargeModel = chargeModel;
        this.ScheduleModel = ScheduleModel;
        this.httpService = httpService;
        this.defaultLimit = 10;
    }
    async create(createPersonalDto) {
        const { file, unity, charge, schedule, } = createPersonalDto;
        if (file) {
            const mime = file.split(';')[0].split(':')[1];
            const base64 = file.split(',')[1];
            const fileObj = { mime, base64 };
            try {
                const res = await this.httpService.post(`${process.env.API_FILE}/files/upload`, { file: fileObj }).toPromise();
                if (!res) {
                    throw new common_1.BadRequestException('File not found');
                }
                createPersonalDto = Object.assign(Object.assign({}, createPersonalDto), { file: res.data.file._id });
            }
            catch (error) {
                console.log(error);
            }
        }
        try {
            const entities = await axios_2.default.get(`${process.env.API_UNITYS}/api/departments/departments`);
            const entityName = this.getEntityName(entities.data, unity);
            if (entityName === '') {
                throw new common_1.BadRequestException('Entity not found');
            }
            createPersonalDto = Object.assign(Object.assign({}, createPersonalDto), { unity: entityName });
        }
        catch (error) {
            console.log(error);
        }
        if (charge && !(await this.isChargeExist(charge))) {
            throw new common_1.BadRequestException(`The specified charge does not exist: ${charge}`);
        }
        if (schedule && !(await this.isScheduleExists(schedule))) {
            throw new common_1.BadRequestException(`The specified schedule does not exist: ${schedule}`);
        }
        try {
            const personal = await this.personalModel.create(createPersonalDto);
            return personal;
        }
        catch (error) {
            if (error.code === 11000) {
                const duplicateKey = Object.keys(error.keyValue)[0];
                const duplicateValue = error.keyValue[duplicateKey];
                throw new common_1.BadRequestException(`El personal ya existe con el ${duplicateKey}: ${duplicateValue}`);
            }
            throw new common_1.InternalServerErrorException('Please check logs server');
        }
    }
    async findAll() {
        const personals = await this.personalModel.find({})
            .sort({ createdAt: -1 });
        const count = await this.personalModel.estimatedDocumentCount();
        if (count === 0) {
            return personals;
        }
        for (const personal of personals) {
            if (personal.file) {
                try {
                    const res = await this.httpService.get(`${process.env.API_FILE}/file/${personal.file}`).toPromise();
                    personal.file = res.data.file._id;
                }
                catch (error) {
                    console.log('error', error);
                }
            }
        }
        return personals;
    }
    async findOne(id) {
        const personal = await this.personalModel.findById(id);
        if (!personal) {
            throw new common_1.BadRequestException(`El personal con el id: ${id} no existe`);
        }
        if (personal.file) {
            try {
                const res = await this.httpService.get(`${process.env.API_FILE}/file/${personal.file}`).toPromise();
                personal.file = res.data.file;
            }
            catch (error) {
                console.log(error);
            }
        }
        return personal;
    }
    async filterParams(filterDto) {
        var _a;
        const { name, lastName, fullName, ci, email, nationality, phone, address, isActive, limit = this.defaultLimit, page = 1 } = filterDto;
        const filters = {};
        if (name)
            filters.name = new RegExp(name, 'i');
        if (lastName)
            filters.lastName = new RegExp(lastName, 'i');
        if (fullName) {
            const [name, lastName] = fullName.split(' ');
            filters.$or = [
                { $and: [{ name: new RegExp(name, 'i') }, { lastName: new RegExp(lastName, 'i') }] },
                { $and: [{ name: new RegExp(lastName, 'i') }, { lastName: new RegExp(name, 'i') }] }
            ];
        }
        if (ci)
            filters.ci = ci;
        if (email) {
            if (email.includes('@')) {
                filters.email = new RegExp(email, 'i');
            }
            else {
                return [];
            }
        }
        if (nationality)
            filters.nationality = new RegExp(nationality, 'i');
        if (phone)
            filters.phone = phone;
        if (address)
            filters.address = new RegExp(address, 'i');
        if (isActive !== undefined)
            filters.isActive = isActive;
        const offset = (page - 1) * limit;
        const personals = await this.personalModel.find(filters)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(offset)
            .select('-__v');
        const total = await this.personalModel.countDocuments(filters).exec();
        for (const personal of personals) {
            if (personal.file) {
                try {
                    const res = await this.httpService.get(`${process.env.API_FILE}/file/${personal.file}`).toPromise();
                    personal.file = res.data.file;
                }
                catch (error) {
                    console.error("Error fetching file:", error);
                    throw (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
                }
            }
        }
        return {
            data: personals,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findUsersByCharge(chargeId) {
        return await this.personalModel.find({ charge: chargeId }).exec();
    }
    async findUsersBySchedule(scheduleId) {
        return await this.personalModel.find({ schedule: scheduleId }).exec();
    }
    async update(id, updatePersonalDto) {
        const personalId = await this.personalModel.findById(id);
        if (!personalId) {
            throw new common_1.BadRequestException('Personal no encontrado');
        }
        const { file, unity } = updatePersonalDto;
        if (file && file.startsWith('data')) {
            const mime = file.split(';')[0].split(':')[1];
            const base64 = file.split(',')[1];
            const fileObj = { mime, base64 };
            if (personalId.file) {
                try {
                    const res = await this.httpService.post(`${process.env.API_FILE}/files/upload`, { file: fileObj }).toPromise();
                    updatePersonalDto = Object.assign(Object.assign({}, updatePersonalDto), { file: res.data.file._id });
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                const mime = file.split(';')[0].split(':')[1];
                const base64 = file.split(',')[1];
                const fileObj = { mime, base64 };
                try {
                    const res = await this.httpService.post(`${process.env.API_FILE}/files/upload`, { file: fileObj }).toPromise();
                    updatePersonalDto = Object.assign(Object.assign({}, updatePersonalDto), { file: res.data.file._id });
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            updatePersonalDto.file = personalId.file;
        }
        if (unity) {
            if (personalId.unity) {
                try {
                    const entities = await axios_2.default.get(`${process.env.API_UNITYS}/api/departments/departments`);
                    const entityName = this.getEntityName(entities.data, unity);
                    if (entityName === '') {
                        throw new common_1.BadRequestException('Entity not found');
                    }
                    updatePersonalDto = Object.assign(Object.assign({}, updatePersonalDto), { unity: entityName });
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                updatePersonalDto.unity = personalId.unity;
            }
        }
        try {
            return await this.personalModel.findByIdAndUpdate(id, updatePersonalDto, { new: true });
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException(`No se puede editar el valor porque ya existe ${JSON.stringify(error.keyValue)}`);
            }
            throw new common_1.InternalServerErrorException('Por favor revise el servidor');
        }
    }
    remove(id) {
        return `This action removes a #${id} personal`;
    }
    getEntityName(entities, entityId) {
        for (const entity of entities) {
            if (entity._id === entityId) {
                return entity.name;
            }
            else if (entity.children && entity.children.length > 0) {
                const childEntityName = this.getEntityName(entity.children, entityId);
                if (childEntityName) {
                    return childEntityName;
                }
            }
        }
        return "";
    }
    async isChargeExist(chargeId) {
        const charge = await this.chargeModel.findById(chargeId).exec();
        return !!charge;
    }
    async isScheduleExists(ScheduleId) {
        const schedule = await this.ScheduleModel.findById(ScheduleId).exec();
        return !!schedule;
    }
    async delete() {
        await this.personalModel.deleteMany({}).exec();
    }
};
exports.PersonalService = PersonalService;
exports.PersonalService = PersonalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(personal_schema_1.Personal.name)),
    __param(1, (0, mongoose_1.InjectModel)(charge_schema_1.Charge.name)),
    __param(2, (0, mongoose_1.InjectModel)(schedule_schema_1.Schedule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        axios_1.HttpService])
], PersonalService);
//# sourceMappingURL=personal.service.js.map