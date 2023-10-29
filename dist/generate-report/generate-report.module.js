"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReportModule = void 0;
const common_1 = require("@nestjs/common");
const generate_report_service_1 = require("./generate-report.service");
const generate_report_controller_1 = require("./generate-report.controller");
const attendance_control_module_1 = require("../attendance-control/attendance-control.module");
const schedule_module_1 = require("../schedule/schedule.module");
let GenerateReportModule = class GenerateReportModule {
};
exports.GenerateReportModule = GenerateReportModule;
exports.GenerateReportModule = GenerateReportModule = __decorate([
    (0, common_1.Module)({
        controllers: [generate_report_controller_1.GenerateReportController],
        providers: [generate_report_service_1.GenerateReportService],
        exports: [generate_report_service_1.GenerateReportService],
        imports: [
            attendance_control_module_1.AttendanceControlModule,
            schedule_module_1.AppScheduleModule,
        ]
    })
], GenerateReportModule);
//# sourceMappingURL=generate-report.module.js.map