"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePersonalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_personal_dto_1 = require("./create-personal.dto");
class UpdatePersonalDto extends (0, swagger_1.PartialType)(create_personal_dto_1.CreatePersonalDto) {
}
exports.UpdatePersonalDto = UpdatePersonalDto;
//# sourceMappingURL=update-personal.dto.js.map