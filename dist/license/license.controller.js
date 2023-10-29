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
exports.LicenseController = void 0;
const common_1 = require("@nestjs/common");
const license_service_1 = require("./license.service");
const create_license_dto_1 = require("./dto/create-license.dto");
const update_license_dto_1 = require("./dto/update-license.dto");
const swagger_1 = require("@nestjs/swagger");
let LicenseController = class LicenseController {
    constructor(licenseService) {
        this.licenseService = licenseService;
    }
    assignLicense(createLicenseDto) {
        return this.licenseService.assignLicense(createLicenseDto);
    }
    findAll() {
        return this.licenseService.findAll();
    }
    findOne(id) {
        return this.licenseService.findOne(id);
    }
    update(id, updateLicenseDto) {
        return this.licenseService.update(id, updateLicenseDto);
    }
    remove() {
        return this.licenseService.remove();
    }
};
exports.LicenseController = LicenseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_license_dto_1.CreateLicenseDto]),
    __metadata("design:returntype", void 0)
], LicenseController.prototype, "assignLicense", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LicenseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LicenseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_license_dto_1.UpdateLicenseDto]),
    __metadata("design:returntype", void 0)
], LicenseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delte-all-licenses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LicenseController.prototype, "remove", null);
exports.LicenseController = LicenseController = __decorate([
    (0, swagger_1.ApiTags)('Licencias'),
    (0, common_1.Controller)('license'),
    __metadata("design:paramtypes", [license_service_1.LicenseService])
], LicenseController);
//# sourceMappingURL=license.controller.js.map