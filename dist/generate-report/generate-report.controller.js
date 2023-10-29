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
exports.GenerateReportController = void 0;
const common_1 = require("@nestjs/common");
const generate_report_service_1 = require("./generate-report.service");
const attendance_control_service_1 = require("../attendance-control/attendance-control.service");
const swagger_1 = require("@nestjs/swagger");
let GenerateReportController = class GenerateReportController {
    constructor(attendanceControlService, generateReportService) {
        this.attendanceControlService = attendanceControlService;
        this.generateReportService = generateReportService;
    }
    async downloadPdf(personalId, res) {
        const buffer = await this.attendanceControlService.findOneReport(personalId);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.GenerateReportController = GenerateReportController;
__decorate([
    (0, swagger_1.ApiTags)('Reportes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generacion de Reporte de Control de Asistencia en PDF',
        description: 'Genera el reporte en pdf del control de asistena de un personal, con el atributo personalId del control de asistencia'
    }),
    (0, common_1.Post)('pdf-attendance/download/:personalId'),
    __param(0, (0, common_1.Param)('personalId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenerateReportController.prototype, "downloadPdf", null);
exports.GenerateReportController = GenerateReportController = __decorate([
    (0, common_1.Controller)('generate-report'),
    __metadata("design:paramtypes", [attendance_control_service_1.AttendanceControlService,
        generate_report_service_1.GenerateReportService])
], GenerateReportController);
//# sourceMappingURL=generate-report.controller.js.map