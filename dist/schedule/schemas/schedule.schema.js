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
exports.ScheduleSchema = exports.Schedule = exports.SpecialDaySchedule = exports.DaySchedule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DaySchedule = class DaySchedule {
};
exports.DaySchedule = DaySchedule;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DaySchedule.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DaySchedule.prototype, "into", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DaySchedule.prototype, "out", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DaySchedule.prototype, "intoTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DaySchedule.prototype, "outTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DaySchedule.prototype, "toleranceInto", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DaySchedule.prototype, "toleranceOut", void 0);
exports.DaySchedule = DaySchedule = __decorate([
    (0, mongoose_1.Schema)()
], DaySchedule);
const DayScheduleSchema = mongoose_1.SchemaFactory.createForClass(DaySchedule);
let SpecialDaySchedule = class SpecialDaySchedule extends DaySchedule {
};
exports.SpecialDaySchedule = SpecialDaySchedule;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SpecialDaySchedule.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], SpecialDaySchedule.prototype, "permanente", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Date] }),
    __metadata("design:type", Array)
], SpecialDaySchedule.prototype, "dateRange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [''] }),
    __metadata("design:type", Array)
], SpecialDaySchedule.prototype, "usersAssigned", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], SpecialDaySchedule.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SpecialDaySchedule.prototype, "createdAt", void 0);
exports.SpecialDaySchedule = SpecialDaySchedule = __decorate([
    (0, mongoose_1.Schema)()
], SpecialDaySchedule);
const SpecialDayScheduleSchema = mongoose_1.SchemaFactory.createForClass(SpecialDaySchedule);
let Schedule = class Schedule extends mongoose_2.Document {
};
exports.Schedule = Schedule;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Schedule.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [DayScheduleSchema] }),
    __metadata("design:type", Array)
], Schedule.prototype, "scheduleNormal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SpecialDayScheduleSchema] }),
    __metadata("design:type", Array)
], Schedule.prototype, "scheduleSpecial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], Schedule.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Schedule.prototype, "createdAt", void 0);
exports.Schedule = Schedule = __decorate([
    (0, mongoose_1.Schema)()
], Schedule);
exports.ScheduleSchema = mongoose_1.SchemaFactory.createForClass(Schedule);
//# sourceMappingURL=schedule.schema.js.map