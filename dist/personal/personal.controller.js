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
exports.PersonalController = void 0;
const common_1 = require("@nestjs/common");
const personal_service_1 = require("./personal.service");
const create_personal_dto_1 = require("./dto/create-personal.dto");
const update_personal_dto_1 = require("./dto/update-personal.dto");
const axios_1 = require("@nestjs/axios");
const swagger_1 = require("@nestjs/swagger");
const filter_dto_1 = require("../common/dto/filter.dto");
let PersonalController = class PersonalController {
    constructor(personalService, httpService) {
        this.personalService = personalService;
        this.httpService = httpService;
    }
    create(createPersonalDto) {
        return this.personalService.create(createPersonalDto);
    }
    findAll() {
        return this.personalService.findAll();
    }
    async filterParams(filterDto) {
        if (typeof filterDto.isActive === 'string') {
            filterDto.isActive = filterDto.isActive === 'true';
        }
        return await this.personalService.filterParams(filterDto);
    }
    findOne(id) {
        return this.personalService.findOne(id);
    }
    async findUsersCharge(id) {
        return await this.personalService.findUsersByCharge(id);
    }
    async findUsersSchedule(id) {
        return await this.personalService.findUsersBySchedule(id);
    }
    update(id, updatePersonalDto) {
        return this.personalService.update(id, updatePersonalDto);
    }
    deleteUsers() {
        return this.personalService.delete();
    }
};
exports.PersonalController = PersonalController;
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Registro de personal',
        description: 'Registra un personal con todos sus parametros'
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_personal_dto_1.CreatePersonalDto]),
    __metadata("design:returntype", void 0)
], PersonalController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registros de Personal',
        description: 'Obtiene todos los registros del personal'
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonalController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registro por ID',
        description: 'Obtiene un registro especifico por su ID'
    }),
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener registros por filtrado de parametros',
        description: 'Realiza la busqueda de registros por el filtrado'
    }),
    (0, swagger_1.ApiQuery)({ name: 'name', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'lastName', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'fullName', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'ci', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'email', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'phone', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'address', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'nationality', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, common_1.Get)('filtered'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PersonalController.prototype, "filterParams", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registro de personal por ID',
        description: 'Obtiene la informacion especifica de un personal por su ID'
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonalController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registro de personal por ID de Cargo',
        description: 'Obtiene todos los usuarios con un respectivo cargo'
    }),
    (0, common_1.Get)('user-charge/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalController.prototype, "findUsersCharge", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registro de personal por ID de horario',
        description: 'Obtiene todos los usuarios con un respectivo'
    }),
    (0, common_1.Get)('user-schedule/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalController.prototype, "findUsersSchedule", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Editar Registro por ID',
        description: 'Edita un registro especifico por su ID'
    }),
    (0, common_1.Put)('edit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_personal_dto_1.UpdatePersonalDto]),
    __metadata("design:returntype", void 0)
], PersonalController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiTags)('personal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Elimina informacion de personal',
        description: 'Elimina los datos de prueba de Personal'
    }),
    (0, common_1.Delete)('delete-all-personal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonalController.prototype, "deleteUsers", null);
exports.PersonalController = PersonalController = __decorate([
    (0, common_1.Controller)('personal'),
    __metadata("design:paramtypes", [personal_service_1.PersonalService,
        axios_1.HttpService])
], PersonalController);
//# sourceMappingURL=personal.controller.js.map