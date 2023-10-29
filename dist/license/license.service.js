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
exports.LicenseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const license_schema_1 = require("./schema/license.schema");
const mongoose_2 = require("mongoose");
let LicenseService = class LicenseService {
    constructor(licenseModel) {
        this.licenseModel = licenseModel;
    }
    async assignLicense(createLicenseDto) {
        try {
            const license = await this.licenseModel.create(createLicenseDto);
            return license;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll() {
        const licenses = await this.licenseModel.find()
            .sort({ createdAt: -1 });
        console.log('licenciassssssss');
        return licenses;
    }
    async findOne(id) {
        try {
            const license = await this.licenseModel.findById({ _id: id });
            return license;
        }
        catch (error) {
            throw new common_1.BadRequestException('Not found license');
        }
    }
    async update(id, updateLicenseDto) {
        const licenseUpdate = await this.findOne(id);
        try {
            await licenseUpdate.updateOne(updateLicenseDto);
            return Object.assign(Object.assign({}, licenseUpdate.toJSON()), updateLicenseDto);
        }
        catch (error) {
            throw new common_1.BadRequestException('No se pudo actualizar la licencia');
        }
    }
    async remove() {
        await this.licenseModel.deleteMany({}).exec();
    }
};
exports.LicenseService = LicenseService;
exports.LicenseService = LicenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(license_schema_1.License.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LicenseService);
//# sourceMappingURL=license.service.js.map