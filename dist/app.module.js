"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const personal_module_1 = require("./personal/personal.module");
const schedule_module_1 = require("./schedule/schedule.module");
const common_module_1 = require("./common/common.module");
const charge_module_1 = require("./charge/charge.module");
const api_module_1 = require("./api/api.module");
const generate_report_module_1 = require("./generate-report/generate-report.module");
const attendance_control_module_1 = require("./attendance-control/attendance-control.module");
const seed_module_1 = require("./seed/seed.module");
const license_module_1 = require("./license/license.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true
            }),
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27018/control-personal-v1'),
            personal_module_1.PersonalModule,
            schedule_module_1.AppScheduleModule,
            common_module_1.CommonModule,
            charge_module_1.ChargeModule,
            api_module_1.ApiModule,
            attendance_control_module_1.AttendanceControlModule,
            generate_report_module_1.GenerateReportModule,
            seed_module_1.SeedModule, license_module_1.LicenseModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map