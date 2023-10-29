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
exports.AttendanceControlController = void 0;
const common_1 = require("@nestjs/common");
const attendance_control_service_1 = require("./attendance-control.service");
const update_attendance_control_dto_1 = require("./dto/update-attendance-control.dto");
const swagger_1 = require("@nestjs/swagger");
let AttendanceControlController = class AttendanceControlController {
    constructor(attendanceControlService) {
        this.attendanceControlService = attendanceControlService;
    }
    registerAttendance(base) {
        return this.attendanceControlService.registerAttendance(base);
    }
    async findAll() {
        return await this.attendanceControlService.findAll();
    }
    async findOne(id) {
        return await this.attendanceControlService.findOne(id);
    }
    update(id, updateAttendanceControlDto) {
        return this.attendanceControlService.update(+id, updateAttendanceControlDto);
    }
    remove() {
        return this.attendanceControlService.remove();
    }
};
exports.AttendanceControlController = AttendanceControlController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)('base')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceControlController.prototype, "registerAttendance", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceControlController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceControlController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('edit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_control_dto_1.UpdateAttendanceControlDto]),
    __metadata("design:returntype", void 0)
], AttendanceControlController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceControlController.prototype, "remove", null);
exports.AttendanceControlController = AttendanceControlController = __decorate([
    (0, swagger_1.ApiTags)('Asistencia'),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_control_service_1.AttendanceControlService])
], AttendanceControlController);
//# sourceMappingURL=attendance-control.controller.js.map