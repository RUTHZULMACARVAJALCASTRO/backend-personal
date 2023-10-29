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
exports.AttendanceControlService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const personal_schema_1 = require("../personal/schemas/personal.schema");
const mongoose_2 = require("mongoose");
const schedule_schema_1 = require("../schedule/schemas/schedule.schema");
const attendance_control_schema_1 = require("./schemas/attendance-control.schema");
const DateTimeInfo_interface_1 = require("./interfaces/DateTimeInfo.interface");
const generate_report_service_1 = require("../generate-report/generate-report.service");
let AttendanceControlService = class AttendanceControlService {
    constructor(generateReportAttendance, personalAttendanceModel, personalModel, scheduleModel) {
        this.generateReportAttendance = generateReportAttendance;
        this.personalAttendanceModel = personalAttendanceModel;
        this.personalModel = personalModel;
        this.scheduleModel = scheduleModel;
    }
    create(createAttendanceControlDto) {
        return 'This action adds a new attendanceControl';
    }
    async findAll() {
        return await this.personalAttendanceModel.find().exec();
    }
    async findOne(personalId) {
        const attendancePersonal = await this.personalAttendanceModel.findOne({ personalId }).exec();
        return attendancePersonal;
    }
    update(id, updateAttendanceControlDto) {
        return `This action updates a #${id} attendanceControl`;
    }
    async remove() {
        await this.personalAttendanceModel.deleteMany({}).exec();
    }
    async registerAttendance(base) {
        const userId = await this.sendImageToRecognitionSystem(base);
        if (!userId) {
            throw new common_1.BadRequestException('No se pudo reconocer al usuario.');
        }
        await this.processAttendance(userId);
        return userId;
    }
    async sendImageToRecognitionSystem(base) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return '65383a05ae51bbf72e3f8213';
        }
        catch (error) {
            console.error('Error al enviar imagen al sistema de reconocimiento:', error.message);
            return null;
        }
    }
    async processAttendance(userId) {
        const user = await this.personalModel.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('No se encontró el personal');
        }
        await this.processSchedule(user);
    }
    async processSchedule(user) {
        const { schedule } = user;
        const scheduleObj = await this.scheduleModel.findById(schedule);
        if (!scheduleObj) {
            throw new common_1.BadRequestException('No se encontró un horario establecido');
        }
        if (!scheduleObj.isActive) {
            throw new common_1.BadRequestException('No se pudo realizar el registro, el horario se encuentra inactivo');
        }
        await this.createAttendanceRecord(user, scheduleObj);
    }
    async createAttendanceRecord(user, schedule) {
        let dailyAttendanceDetail;
        let savedData;
        let personalAsigned;
        const { date, minute, hour, day, dayOfWeekNumber, month, year, dayOfWeek } = this.getCurrentDateTimeInfo();
        const existingAttendance = await this.personalAttendanceModel.findOne({
            personalId: user._id
        });
        const specialScheduleForToday = schedule.scheduleSpecial
            .find(specSchedule => specSchedule.day === dayOfWeekNumber && specSchedule.isActive);
        const normalScheduleForToday = schedule.scheduleNormal
            .find(normalSchedule => normalSchedule.day === dayOfWeekNumber);
        if (specialScheduleForToday) {
            personalAsigned = specialScheduleForToday.usersAssigned
                .find(personalId => personalId.toString() === user._id.toString());
        }
        if (specialScheduleForToday && personalAsigned) {
            dailyAttendanceDetail = await this.createDayAttendanceDetail(specialScheduleForToday, user.id);
        }
        else if (normalScheduleForToday) {
            dailyAttendanceDetail = await this.createDayAttendanceDetail(normalScheduleForToday, user.id);
        }
        else {
            throw new common_1.BadRequestException(`El día ${dayOfWeek} no pertenece al horario ${schedule.name}`);
        }
        if (existingAttendance) {
            const existingRecordForToday = existingAttendance.attendanceDetail
                .find(detail => detail.date === dailyAttendanceDetail.date);
            if (existingRecordForToday) {
                existingRecordForToday.entrances = [...existingRecordForToday.entrances, ...dailyAttendanceDetail.entrances];
                existingRecordForToday.exits = [...existingRecordForToday.exits, ...dailyAttendanceDetail.exits];
            }
            else {
                existingAttendance.attendanceDetail.push(dailyAttendanceDetail);
            }
            savedData = await existingAttendance.save();
            return savedData;
        }
        else {
            const attendance = new this.personalAttendanceModel({
                personalId: user._id,
                name: user.name,
                lastName: user.lastName,
                ci: user.ci,
                schedule: schedule._id,
                attendanceDetail: [dailyAttendanceDetail]
            });
            savedData = await attendance.save();
            return savedData;
        }
    }
    async createDayAttendanceDetail(schedule, personalID) {
        let entrances = [];
        let exits = [];
        const { into, out, intoTwo, outTwo, toleranceInto, toleranceOut, name } = schedule;
        const { year, day, month, hour, minute } = this.getCurrentDateTimeInfo();
        const date = day <= 9 ? `0${day}/${month}/${year}` : `${day}/${month}/${year}`;
        const currentHourDecimal = this.convertHourToDecimal(`${hour}:${minute}`);
        const formatMinute = minute <= 9 ? `0${minute}` : `${minute}`;
        const markHourFormat = hour <= 9 ? `0${hour}:${formatMinute}` : `${hour}:${formatMinute}`;
        const morningEntryResult = this.handleControlPoint(into, toleranceInto, currentHourDecimal, markHourFormat, DateTimeInfo_interface_1.ControlPoints.ENTRADA);
        const hasMorningEntryRecord = await this.hasEntranceRecordedForShift(personalID, date, 'MAÑANA', 'entrance');
        if (morningEntryResult.marked && !hasMorningEntryRecord) {
            const recordWithShift = Object.assign(Object.assign({}, morningEntryResult.record), { shift: 'MAÑANA' });
            entrances.push(recordWithShift);
        }
        else if (morningEntryResult.marked && hasMorningEntryRecord) {
            throw new common_1.BadRequestException('Ya existe un registro de entrada para el turno de la MAÑANA.');
        }
        const morningExitResult = this.handleControlPoint(out, toleranceOut, currentHourDecimal, markHourFormat, DateTimeInfo_interface_1.ControlPoints.SALIDA);
        const hastMorningExitRecord = await this.hasEntranceRecordedForShift(personalID, date, 'MAÑANA', 'exit');
        if (morningExitResult.marked && !hastMorningExitRecord) {
            const recordWithShift = Object.assign(Object.assign({}, morningExitResult.record), { shift: 'MAÑANA' });
            exits.push(recordWithShift);
        }
        else if (morningExitResult.marked && hastMorningExitRecord) {
            throw new common_1.BadRequestException('Ya existe un registro de salida para el turno de la MAÑANA.');
        }
        const afternoonEntryResult = this.handleControlPoint(intoTwo, toleranceInto, currentHourDecimal, markHourFormat, DateTimeInfo_interface_1.ControlPoints.ENTRADA);
        const hasAfternoonEntryRecord = await this.hasEntranceRecordedForShift(personalID, date, 'TARDE', 'entrance');
        if (afternoonEntryResult.marked && !hasAfternoonEntryRecord) {
            const recordWithShift = Object.assign(Object.assign({}, afternoonEntryResult.record), { shift: 'TARDE' });
            entrances.push(recordWithShift);
        }
        else if (afternoonEntryResult.marked && hasAfternoonEntryRecord) {
            throw new common_1.BadRequestException('Ya existe un registro de entrada para el turno de la TARDE.');
        }
        const afternoonExitResult = this.handleControlPoint(outTwo, toleranceOut, currentHourDecimal, markHourFormat, DateTimeInfo_interface_1.ControlPoints.SALIDA);
        const hastAfternoonExitRecord = await this.hasEntranceRecordedForShift(personalID, date, 'TARDE', 'exit');
        if (afternoonExitResult.marked && !hastAfternoonExitRecord) {
            const recordWithShift = Object.assign(Object.assign({}, afternoonExitResult.record), { shift: 'TARDE' });
            exits.push(recordWithShift);
        }
        else if (afternoonExitResult.marked && hastAfternoonExitRecord) {
            throw new common_1.BadRequestException('Ya existe un registro de salida para el turno de la TARDE.');
        }
        if (!afternoonExitResult.marked && !afternoonEntryResult.marked && !morningExitResult.marked && !morningEntryResult.marked) {
            throw new common_1.BadRequestException('No se pude realizar el registro en horario laboral');
        }
        if (name) {
            return {
                date,
                specialDay: name,
                entrances,
                exits
            };
        }
        else {
            return {
                date,
                specialDay: '',
                entrances,
                exits
            };
        }
    }
    handleControlPoint(controlHour, tolerance, currentHourDecimal, markedHour, controlType) {
        const controlHourDecimal = this.convertHourToDecimal(controlHour);
        let isWithinControlRange;
        let infraccion;
        let status;
        let shift;
        if (controlType === DateTimeInfo_interface_1.ControlPoints.ENTRADA) {
            isWithinControlRange = currentHourDecimal >= controlHourDecimal - 0.25 && currentHourDecimal <= (controlHourDecimal + 0.25) + tolerance / 60;
            if (isWithinControlRange) {
                if (currentHourDecimal <= controlHourDecimal + tolerance / 60) {
                    infraccion = 0;
                    status = DateTimeInfo_interface_1.AttendanceStatus.PUNTUAL;
                }
                else {
                    infraccion = (currentHourDecimal - (controlHourDecimal + tolerance / 60)) * 60;
                    status = DateTimeInfo_interface_1.AttendanceStatus.RETRASO;
                }
            }
            else {
                return {
                    marked: false,
                    record: {
                        hour: null,
                        tolerance: null,
                        marketHour: null,
                        infraccion: "Inasistencia",
                        type: null,
                        status: DateTimeInfo_interface_1.AttendanceStatus.INASISTENCIA,
                        shift: this.determineShift(controlHourDecimal)
                    }
                };
            }
        }
        else if (controlType === DateTimeInfo_interface_1.ControlPoints.SALIDA) {
            isWithinControlRange = currentHourDecimal >= controlHourDecimal && currentHourDecimal <= controlHourDecimal + 0.25 + tolerance / 60;
            if (isWithinControlRange) {
                if (currentHourDecimal <= controlHourDecimal) {
                    infraccion = 0;
                    status = DateTimeInfo_interface_1.AttendanceStatus.PUNTUAL;
                }
                else {
                    infraccion = (currentHourDecimal - controlHourDecimal) * 60;
                    status = DateTimeInfo_interface_1.AttendanceStatus.RETRASO;
                }
            }
            else {
                return {
                    marked: false,
                    record: {
                        hour: null,
                        tolerance: null,
                        marketHour: null,
                        infraccion: "Inasistencia",
                        type: null,
                        status: DateTimeInfo_interface_1.AttendanceStatus.INASISTENCIA,
                        shift: this.determineShift(controlHourDecimal)
                    }
                };
            }
        }
        if (isWithinControlRange) {
            const infraccionFormat = this.infraccionFormat(infraccion);
            const record = this.createRecord(controlHour, tolerance, markedHour, infraccionFormat, controlType, status, shift);
            return { marked: true, record };
        }
        return { marked: false, record: null };
    }
    createRecord(hour, tolerance, marketHour, infraccion, type, status, shift) {
        return {
            hour: hour,
            tolerance: tolerance,
            marketHour: marketHour,
            infraccion: infraccion,
            type: type,
            status: status,
            shift: shift
        };
    }
    infraccionFormat(infraccion) {
        const infraccionFormatString = `${parseInt(infraccion.toString().split('.')[0])} min`;
        return infraccionFormatString;
    }
    convertHourToDecimal(hourString) {
        const [hour, minutes] = hourString.split(':').map(Number);
        return hour + minutes / 60;
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
    determineShift(controlHourDecimal) {
        const midday = 12.0;
        if (controlHourDecimal < midday) {
            return 'MAÑANA';
        }
        else {
            return 'TARDE';
        }
    }
    async hasEntranceRecordedForShift(personalId, date, shift, recordType) {
        try {
            const record = await this.personalAttendanceModel.findOne({
                personalId: personalId,
                'attendanceDetail.date': date
            });
            if (record && record.attendanceDetail) {
                const detailForDate = record.attendanceDetail.find(detail => detail.date === date);
                if (detailForDate) {
                    if (recordType === 'entrance') {
                        return detailForDate.entrances.some(entrance => entrance.shift === shift);
                    }
                    else if (recordType === 'exit') {
                        return detailForDate.exits.some(exit => exit.shift === shift);
                    }
                }
            }
            return false;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async findOneReport(personalId) {
        const attendancePersonal = await this.personalAttendanceModel.findOne({ personalId }).exec();
        if (attendancePersonal) {
            const { name, lastName, ci, schedule, attendanceDetail } = attendancePersonal;
            const data = { name, lastName, ci, schedule, attendanceDetail };
            return await this.generateReportAttendance.generateReportAttendance(data);
        }
        else {
            throw new common_1.BadRequestException('No se pudo generar el pdf');
        }
    }
};
exports.AttendanceControlService = AttendanceControlService;
exports.AttendanceControlService = AttendanceControlService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(attendance_control_schema_1.PersonalAttendance.name)),
    __param(2, (0, mongoose_1.InjectModel)(personal_schema_1.Personal.name)),
    __param(3, (0, mongoose_1.InjectModel)(schedule_schema_1.Schedule.name)),
    __metadata("design:paramtypes", [generate_report_service_1.GenerateReportService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AttendanceControlService);
//# sourceMappingURL=attendance-control.service.js.map