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
exports.PersonalAttendanceSchema = exports.PersonalAttendance = exports.DailyAttendanceDetail = exports.ExitRecord = exports.EntranceRecord = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let EntranceRecord = class EntranceRecord {
};
exports.EntranceRecord = EntranceRecord;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EntranceRecord.prototype, "hour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], EntranceRecord.prototype, "tolerancie", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EntranceRecord.prototype, "marketHour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EntranceRecord.prototype, "infraccion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EntranceRecord.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EntranceRecord.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EntranceRecord.prototype, "shift", void 0);
exports.EntranceRecord = EntranceRecord = __decorate([
    (0, mongoose_1.Schema)()
], EntranceRecord);
const EntranceRecordSchema = mongoose_1.SchemaFactory.createForClass(EntranceRecord);
let ExitRecord = class ExitRecord {
};
exports.ExitRecord = ExitRecord;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExitRecord.prototype, "hour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ExitRecord.prototype, "tolerance", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExitRecord.prototype, "marketHour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExitRecord.prototype, "infraccion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExitRecord.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExitRecord.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExitRecord.prototype, "shift", void 0);
exports.ExitRecord = ExitRecord = __decorate([
    (0, mongoose_1.Schema)()
], ExitRecord);
const ExitRecordSchema = mongoose_1.SchemaFactory.createForClass(ExitRecord);
let DailyAttendanceDetail = class DailyAttendanceDetail {
};
exports.DailyAttendanceDetail = DailyAttendanceDetail;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DailyAttendanceDetail.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DailyAttendanceDetail.prototype, "specialDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [EntranceRecordSchema] }),
    __metadata("design:type", Array)
], DailyAttendanceDetail.prototype, "entrances", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ExitRecordSchema] }),
    __metadata("design:type", Array)
], DailyAttendanceDetail.prototype, "exits", void 0);
exports.DailyAttendanceDetail = DailyAttendanceDetail = __decorate([
    (0, mongoose_1.Schema)()
], DailyAttendanceDetail);
const DailyAttendanceDetailSchema = mongoose_1.SchemaFactory.createForClass(DailyAttendanceDetail);
let PersonalAttendance = class PersonalAttendance extends mongoose_2.Document {
};
exports.PersonalAttendance = PersonalAttendance;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalAttendance.prototype, "personalId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalAttendance.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalAttendance.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalAttendance.prototype, "ci", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalAttendance.prototype, "schedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [DailyAttendanceDetailSchema] }),
    __metadata("design:type", Array)
], PersonalAttendance.prototype, "attendanceDetail", void 0);
exports.PersonalAttendance = PersonalAttendance = __decorate([
    (0, mongoose_1.Schema)()
], PersonalAttendance);
exports.PersonalAttendanceSchema = mongoose_1.SchemaFactory.createForClass(PersonalAttendance);
//# sourceMappingURL=attendance-control.schema.js.map