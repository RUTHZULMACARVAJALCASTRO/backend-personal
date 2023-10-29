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
exports.ApiService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
let ApiService = class ApiService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiSeguridad = process.env.API_SEGURIDAD;
    }
    async test() {
        return 'Hello from services';
    }
    async loginAuthCentral(loginCentralDTO) {
        var _a;
        try {
            const response = await this.httpService.post(`${this.apiSeguridad}/auth/verify-app-token`, loginCentralDTO).toPromise();
            return response.data;
        }
        catch (error) {
            throw (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
        }
    }
};
exports.ApiService = ApiService;
exports.ApiService = ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ApiService);
//# sourceMappingURL=api.service.js.map