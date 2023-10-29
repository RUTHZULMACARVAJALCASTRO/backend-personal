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
exports.ChargeController = void 0;
const common_1 = require("@nestjs/common");
const charge_service_1 = require("./charge.service");
const create_charge_dto_1 = require("./dto/create-charge.dto");
const update_charge_dto_1 = require("./dto/update-charge.dto");
const swagger_1 = require("@nestjs/swagger");
const filter_dto_1 = require("../common/dto/filter.dto");
let ChargeController = class ChargeController {
    constructor(chargeService) {
        this.chargeService = chargeService;
    }
    create(createChargeDto) {
        return this.chargeService.create(createChargeDto);
    }
    findAll() {
        return this.chargeService.findAll();
    }
    async filterParams(filterChargeDto) {
        if (typeof filterChargeDto.isActive === 'string') {
            filterChargeDto.isActive = filterChargeDto.isActive === 'true';
        }
        return await this.chargeService.filterParams(filterChargeDto);
    }
    findOne(id) {
        return this.chargeService.findOne(id);
    }
    update(id, updateChargeDto) {
        return this.chargeService.update(id, updateChargeDto);
    }
};
exports.ChargeController = ChargeController;
__decorate([
    (0, swagger_1.ApiTags)('cargos'),
    (0, swagger_1.ApiOperation)({
        summary: 'Registro de Cargo',
        description: 'Registra un cargo con todos sus parametros'
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_charge_dto_1.CreateChargeDto]),
    __metadata("design:returntype", void 0)
], ChargeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('cargos'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registros de Cargo',
        description: 'Obtiene todos los registros de Cargos'
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChargeController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiTags)('cargos'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener registros por filtrado de parametros',
        description: 'Realiza la busqueda de cargos por el filtrado'
    }),
    (0, swagger_1.ApiQuery)({ name: 'name', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false }),
    (0, common_1.Get)('filtered'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterChargeDto]),
    __metadata("design:returntype", Promise)
], ChargeController.prototype, "filterParams", null);
__decorate([
    (0, swagger_1.ApiTags)('cargos'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener Registro de Cargo por ID',
        description: 'Obtiene la informacion especifica de un cargo por su ID'
    }),
    (0, swagger_1.ApiTags)('cargos'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChargeController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('cargos'),
    (0, swagger_1.ApiOperation)({
        summary: 'Editar Cargo por ID',
        description: 'Edita un cargo especifico por su ID'
    }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_charge_dto_1.UpdateChargeDto]),
    __metadata("design:returntype", void 0)
], ChargeController.prototype, "update", null);
exports.ChargeController = ChargeController = __decorate([
    (0, swagger_1.ApiTags)('cargos'),
    (0, common_1.Controller)('charge'),
    __metadata("design:paramtypes", [charge_service_1.ChargeService])
], ChargeController);
//# sourceMappingURL=charge.controller.js.map