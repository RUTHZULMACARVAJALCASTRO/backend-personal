"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceControlModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_control_service_1 = require("./attendance-control.service");
const attendance_control_controller_1 = require("./attendance-control.controller");
const mongoose_1 = require("@nestjs/mongoose");
const personal_schema_1 = require("../personal/schemas/personal.schema");
const personal_module_1 = require("../personal/personal.module");
const schedule_schema_1 = require("../schedule/schemas/schedule.schema");
const schedule_module_1 = require("../schedule/schedule.module");
const attendance_control_schema_1 = require("./schemas/attendance-control.schema");
const generate_report_module_1 = require("../generate-report/generate-report.module");
let AttendanceControlModule = class AttendanceControlModule {
};
exports.AttendanceControlModule = AttendanceControlModule;
exports.AttendanceControlModule = AttendanceControlModule = __decorate([
    (0, common_1.Module)({
        controllers: [attendance_control_controller_1.AttendanceControlController],
        providers: [attendance_control_service_1.AttendanceControlService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: attendance_control_schema_1.PersonalAttendance.name,
                    schema: attendance_control_schema_1.PersonalAttendanceSchema
                },
                {
                    name: personal_schema_1.Personal.name,
                    schema: personal_schema_1.PersonalSchema
                },
                {
                    name: schedule_schema_1.Schedule.name,
                    schema: schedule_schema_1.ScheduleSchema
                }
            ]),
            personal_module_1.PersonalModule,
            schedule_module_1.AppScheduleModule,
            (0, common_1.forwardRef)(() => generate_report_module_1.GenerateReportModule)
        ],
        exports: [
            attendance_control_service_1.AttendanceControlService
        ]
    })
], AttendanceControlModule);
//# sourceMappingURL=attendance-control.module.js.map