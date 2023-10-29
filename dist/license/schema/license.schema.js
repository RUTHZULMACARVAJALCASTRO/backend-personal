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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseSchema = exports.License = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const personal_schema_1 = require("../../personal/schemas/personal.schema");
let License = class License extends mongoose_2.Document {
};
exports.License = License;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Personal' }),
    __metadata("design:type", personal_schema_1.Personal)
], License.prototype, "personal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Medica', 'Maternidad', 'Paternidad', 'Duelo', 'Vacaciones', 'Personal'],
        required: true
    }),
    __metadata("design:type", String)
], License.prototype, "licenseType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], License.prototype, "descripcion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], License.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], License.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], License.prototype, "isActive", void 0);
exports.License = License = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], License);
exports.LicenseSchema = mongoose_1.SchemaFactory.createForClass(License);
//# sourceMappingURL=license.schema.js.map