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
exports.GenerateReportService = void 0;
const common_1 = require("@nestjs/common");
const schedule_service_1 = require("../schedule/schedule.service");
const fs = require("fs");
const path_1 = require("path");
const PDFDocument = require('pdfkit-table');
let GenerateReportService = class GenerateReportService {
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    async generateReportAttendance(data) {
        const { name, lastName, ci, schedule, attendanceDetail } = data;
        const infoSchedule = await this.scheduleService.findOne(schedule);
        const nameSchedule = infoSchedule.name;
        console.log(nameSchedule);
        console.log(attendanceDetail);
        const pdfBuffer = await new Promise(resolve => {
            const doc = new PDFDocument({
                size: "LETTER",
                bufferPages: true,
                autoFirstPage: false,
            });
            let pageNumber = 0;
            doc.on('pageAdded', () => {
                pageNumber++;
                if (pageNumber === 1) {
                    const imageWidth = 45;
                    const imageHeight = 45;
                    const imageX = doc.page.width - 100;
                    const imageY = 20;
                    const textY = imageY + imageHeight / 2;
                    const lineY = imageY + imageHeight + 10;
                    doc.image((0, path_1.join)(process.cwd(), "uploads/uatf-logo.jpg"), imageX, imageY, { fit: [imageWidth, imageHeight], align: 'center' });
                    doc.fontSize(10);
                    doc.text("SISTEMA DE CONTROL PERSONAL", { align: 'center', valign: 'center', baseline: 'middle' }, textY);
                    doc.moveDown(0.5);
                    doc.font("Helvetica-Bold").fontSize(15);
                    doc.text("REPORTE DE ASISTENCIAS", { align: 'center', valign: 'center', baseline: 'middle' });
                    doc.moveTo(50, lineY)
                        .lineTo(doc.page.width - 50, lineY)
                        .stroke();
                    doc.font("Helvetica-Bold")
                        .fontSize(13)
                        .text('Nombre Completo', 50, lineY + 20, { continued: true });
                    doc.font("Helvetica")
                        .text(`: ${name} ${lastName}`, lineY - 10);
                    doc.moveDown(0.5);
                    doc.font("Helvetica-Bold")
                        .text('Nro. CI.', 50, lineY + 40, { continued: true });
                    doc.font("Helvetica")
                        .text(`: ${ci}`, lineY - 10);
                }
                let bottom = doc.page.margins.bottom;
                let formattedDate = this.formatDateReportUsingInfo();
                doc.page.margins.bottom = 0;
                let yPos = doc.page.height - 50;
                doc.font('Helvetica-Bold')
                    .fontSize(12)
                    .text('Fecha del reporte:', 40, yPos, { continued: true });
                doc.font("Helvetica")
                    .text(` ${formattedDate}`);
                doc.text(`${pageNumber}`, doc.page.width - 40, yPos, {
                    align: 'right'
                });
                doc.page.margins.bottom = bottom;
            });
            doc.addPage();
            doc.text('', 50, 160);
            const renderTable = (data) => {
                doc.text(`FECHA: ${data.date}`, 50, 160, { width: 500, align: 'center' });
                doc.text('', 50, doc.y + 10);
                const entranceRows = data.entrances.map(entry => [entry.marketHour, entry.infraccion, entry.type, entry.status, entry.shift]);
                const exitRows = data.exits.map(exit => [exit.marketHour, exit.infraccion, exit.type, exit.status, exit.shift]);
                const allRows = [...entranceRows, ...exitRows];
                const table = {
                    headers: [
                        { label: 'HORA', property: 'hora', width: 85 },
                        { label: 'TOLERANCIA', property: 'tolerancia', width: 85 },
                        { label: 'MARCADO', property: 'marcado', width: 85 },
                        { label: 'INFRACCION', property: 'infraccion', width: 85 },
                        { label: 'TIPO', property: 'tipo', width: 85 },
                        { label: 'TURNO', property: 'turno', width: 85 },
                    ],
                };
            };
            attendanceDetail.forEach(detail => {
                renderTable(detail);
            });
            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });
            doc.end();
        });
        return pdfBuffer;
    }
    formatDateReportUsingInfo() {
        const dateTimeInfo = this.getCurrentDateTimeInfo();
        const monthsNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const formattedDate = `${dateTimeInfo.dayOfWeek}, ${dateTimeInfo.day.toString().padStart(2, '0')} de ${monthsNames[dateTimeInfo.month - 1]} de ${dateTimeInfo.year} ${dateTimeInfo.hour.toString().padStart(2, '0')}:${dateTimeInfo.minute.toString().padStart(2, '0')}`;
        return formattedDate;
    }
    getCurrentDateTimeInfo() {
        const currentDate = new Date();
        const currentDayOfWeekNumber = currentDate.getDay();
        const currentMinute = currentDate.getMinutes();
        const currentHour = currentDate.getHours();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        let month;
        if (currentMonth <= 9) {
            month = `0${currentMonth}`;
        }
        else {
            month = currentMonth;
        }
        const daysOfWeek = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado'
        ];
        const currentDayOfWeek = daysOfWeek[currentDayOfWeekNumber];
        return {
            date: currentDate,
            minute: currentMinute,
            hour: currentHour,
            day: currentDay,
            dayOfWeekNumber: currentDayOfWeekNumber,
            month,
            year: currentYear,
            dayOfWeek: currentDayOfWeek
        };
    }
};
exports.GenerateReportService = GenerateReportService;
exports.GenerateReportService = GenerateReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_service_1.ScheduleService])
], GenerateReportService);
//# sourceMappingURL=generate-report.service.js.map