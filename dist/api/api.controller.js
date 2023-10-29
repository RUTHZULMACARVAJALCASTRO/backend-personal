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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const api_dto_1 = require("./api.dto");
const swagger_1 = require("@nestjs/swagger");
const axios_1 = require("@nestjs/axios");
let ApiController = class ApiController {
    constructor(apiService, httpService) {
        this.apiService = apiService;
        this.httpService = httpService;
    }
    async loginCentral(req, res, loginCentralDTO) {
        try {
            console.log(loginCentralDTO);
            const response = await this.apiService.loginAuthCentral(loginCentralDTO);
            res.send(response);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, swagger_1.ApiTags)('login-auth'),
    (0, common_1.Post)('login-central'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, api_dto_1.LoginCentralDTO]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "loginCentral", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [api_service_1.ApiService,
        axios_1.HttpService])
], ApiController);
//# sourceMappingURL=api.controller.js.map