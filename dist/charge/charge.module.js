"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeModule = void 0;
const common_1 = require("@nestjs/common");
const charge_service_1 = require("./charge.service");
const charge_controller_1 = require("./charge.controller");
const mongoose_1 = require("@nestjs/mongoose");
const charge_schema_1 = require("./schemas/charge.schema");
let ChargeModule = class ChargeModule {
};
exports.ChargeModule = ChargeModule;
exports.ChargeModule = ChargeModule = __decorate([
    (0, common_1.Module)({
        controllers: [charge_controller_1.ChargeController],
        providers: [charge_service_1.ChargeService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: charge_schema_1.Charge.name,
                    schema: charge_schema_1.ChargeSchema
                }
            ])
        ]
    })
], ChargeModule);
//# sourceMappingURL=charge.module.js.map