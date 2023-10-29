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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const personal_service_1 = require("../personal/personal.service");
const seed_personal_1 = require("./data/seed.personal");
let SeedService = class SeedService {
    constructor(personalService) {
        this.personalService = personalService;
    }
    async runSeed() {
        try {
            await this.insertNewPersonal();
            console.log('Insertion completed successfully.');
        }
        catch (error) {
            throw new common_1.BadGatewayException('No se pudo realizar la insersion de datos');
        }
    }
    async insertNewPersonal() {
        const seedPersonal = (0, seed_personal_1.generatePersonnelData)();
        const insertPromises = [];
        seedPersonal.forEach(personal => {
            insertPromises.push(this.personalService.create(personal));
        });
        await Promise.all(insertPromises);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [personal_service_1.PersonalService])
], SeedService);
//# sourceMappingURL=seed.service.js.map