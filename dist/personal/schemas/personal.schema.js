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
exports.PersonalSchema = exports.Personal = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Personal = class Personal extends mongoose_2.Document {
};
exports.Personal = Personal;
__decorate([
    (0, mongoose_1.Prop)({ unique: false }),
    __metadata("design:type", String)
], Personal.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: false }),
    __metadata("design:type", String)
], Personal.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Personal.prototype, "ci", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Personal.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Personal.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: false }),
    __metadata("design:type", String)
], Personal.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: false }),
    __metadata("design:type", String)
], Personal.prototype, "nationality", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Personal.prototype, "unity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Personal.prototype, "charge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Personal.prototype, "schedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Personal.prototype, "file", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Personal.prototype, "isActive", void 0);
exports.Personal = Personal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Personal);
exports.PersonalSchema = mongoose_1.SchemaFactory.createForClass(Personal);
//# sourceMappingURL=personal.schema.js.map