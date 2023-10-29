"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('Sistema Personal')
        .setDescription('Documentacion de backend del sistema de personal')
        .setVersion('1.0')
        .addTag('login-auth')
        .addTag('personal')
        .addTag('Licencias')
        .addTag('cargos')
        .addTag('horarios')
        .addTag('Asistencia')
        .addTag('Semilla')
        .addTag('Reportes')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const logger = new common_1.Logger('Bootstrap');
    await app.listen(process.env.PORT);
    logger.log(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map