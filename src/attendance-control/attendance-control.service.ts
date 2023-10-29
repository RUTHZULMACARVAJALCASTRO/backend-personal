import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAttendanceControlDto } from './dto/create-attendance-control.dto';
import { UpdateAttendanceControlDto } from './dto/update-attendance-control.dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Personal } from 'src/personal/schemas/personal.schema';
import { Model } from 'mongoose';
import { Schedule } from 'src/schedule/schemas/schedule.schema';
import { PersonalAttendance } from './schemas/attendance-control.schema';
import { AttendanceStatus, ControlPoints, DateTimeInfo } from './interfaces/DateTimeInfo.interface';
// import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { GenerateReportService } from 'src/generate-report/generate-report.service';
import { throwError } from 'rxjs';


  

@Injectable()
export class AttendanceControlService {

  // private reportTemplate: HandlebarsTemplateDelegate;

  constructor(
    private readonly generateReportAttendance: GenerateReportService,

    @InjectModel(PersonalAttendance.name)
    private readonly personalAttendanceModel: Model<PersonalAttendance>,

    
    @InjectModel(Personal.name)
    private readonly personalModel: Model<Personal>,

    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<Schedule>,
  ) {

    // const templatePath = '/home/joel/Escritorio/control-personal-2/control-personal-v1/src/attendance-control/reportTemplate.html';
    // const source = fs.readFileSync(templatePath, 'utf-8');
    
    // this.reportTemplate = Handlebars.compile(source);
  }

  create(createAttendanceControlDto: CreateAttendanceControlDto) {
    return 'This action adds a new attendanceControl';
  }

  async findAll(): Promise<PersonalAttendance[]> {
    return await this.personalAttendanceModel.find().exec();
  }

  async findOne(personalId: string) {
    const attendancePersonal = await this.personalAttendanceModel.findOne({ personalId }).exec();
    return attendancePersonal;
  }

  update(id: number, updateAttendanceControlDto: UpdateAttendanceControlDto) {
    return `This action updates a #${id} attendanceControl`;
  }

  async remove() {
    await this.personalAttendanceModel.deleteMany({}).exec();
  }

  // Funcion Principal -> Reconocemos al personal con una imagen llamando la funcion "sendImageToRecognitionSystem"

  async registerAttendance(base: string) {
    const userId = await this.sendImageToRecognitionSystem(base);
    // console.log('sendImage', userId);
    if (!userId) {
      throw new BadRequestException('No se pudo reconocer al usuario.');
    }

    // Funcion que recibe el id obtenido por sendImageToRecognitionSystem
    await this.processAttendance(userId);
    return userId;
  }

  // Funcion que recibe la imagen y retorn a un id de personal 
  private async sendImageToRecognitionSystem(base: string): Promise<string | null> {
    try {
      // const response = await axios.post(`http://10.10.214.189:8000/`, { base });
      // if (response.data && response.data.name) {
      //   return response.data.name;
      // } else {
      //   return null;
      // }
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 65372fe486748e7e93bc75b4
      return '65383a05ae51bbf72e3f8213';
    } catch (error) {
      console.error('Error al enviar imagen al sistema de reconocimiento:', error.message);
      return null;
    }
  }

  // Funcion que recibe el id e indentifica al personal del sistema
  private async processAttendance(userId: string) {
    const user = await this.personalModel.findById(userId);

    if (!user) {
      throw new BadRequestException('No se encontró el personal');
    }
    await this.processSchedule(user);
  }

  // Si se reconoce la persona y tiene un horario activo
  private async processSchedule(user: any) {
    const { schedule } = user;
    const scheduleObj = await this.scheduleModel.findById(schedule);


    if (!scheduleObj) {
      throw new BadRequestException('No se encontró un horario establecido');
    }

    if (!scheduleObj.isActive) {
      throw new BadRequestException('No se pudo realizar el registro, el horario se encuentra inactivo');
    }

    await this.createAttendanceRecord(user, scheduleObj);
  }

  // Funcion que recibe el personal identificado con el horario establecido 
  private async createAttendanceRecord(user: any, schedule: any) {

    let dailyAttendanceDetail: any;

    let savedData: any

    let personalAsigned: boolean

    // informacion de la hora de registro
    const { date, minute, hour, day, dayOfWeekNumber, month, year, dayOfWeek} = this.getCurrentDateTimeInfo();
    // console.log({ date, minute, hour, day, dayOfWeekNumber, month, year, dayOfWeek })

    // Si existe un registro previo del personal
    const existingAttendance = await this.personalAttendanceModel.findOne({
      personalId: user._id
    });
    // console.log('1', existingAttendance );

    // Si existe un dia especial en ese horario
    const specialScheduleForToday = schedule.scheduleSpecial
      .find(specSchedule => specSchedule.day === dayOfWeekNumber && specSchedule.isActive)
    // console.log( 'dia especial', specialScheduleForToday )

    // Si existe el dia de registro en el horario normal
    const normalScheduleForToday = schedule.scheduleNormal
      .find(normalSchedule => normalSchedule.day === dayOfWeekNumber);
    // console.log('Dia normal', normalScheduleForToday );

    // si existe un día especial en el horario
    if( specialScheduleForToday ) {
      personalAsigned = specialScheduleForToday.usersAssigned
        .find(personalId => personalId.toString() === user._id.toString());
      // console.log( personalAsigned );
    }

    // Si existe un horario especial para el día actual y el usuario está asignado a él
    if (specialScheduleForToday && personalAsigned) {
      dailyAttendanceDetail = await this.createDayAttendanceDetail(specialScheduleForToday, user.id);
    } 
    
    // Si no se ha encontrado un horario especial o el usuario no está asignado a él, verificamos el horario normal
    else if (normalScheduleForToday) {
      dailyAttendanceDetail = await this.createDayAttendanceDetail(normalScheduleForToday, user.id);
    } 

    // Si no se ha encontrado ni un horario especial ni uno normal para el día actual
    else {
      throw new BadRequestException(`El día ${dayOfWeek} no pertenece al horario ${schedule.name}`);
    }

    // si ya hay una asistencia registrada para el usuario
    if (existingAttendance) {

      const existingRecordForToday = existingAttendance.attendanceDetail
        .find(detail => detail.date === dailyAttendanceDetail.date);

      // Si ya hay un registro de asistencia para el día actual
      if (existingRecordForToday) {
        existingRecordForToday.entrances = [...existingRecordForToday.entrances, ...dailyAttendanceDetail.entrances];
        existingRecordForToday.exits = [...existingRecordForToday.exits, ...dailyAttendanceDetail.exits];
      } else {
        // Agregar un nuevo registro para el día actual
        existingAttendance.attendanceDetail.push(dailyAttendanceDetail);
      }

      savedData = await existingAttendance.save();
      return savedData;

    } else {
      // Si no existe una planilla para el personal, crear una nueva
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

  // Función para crear un detalle de asistencia en el dia que pertenece a un horario. 
  private async createDayAttendanceDetail(schedule: any, personalID: string) {
    let entrances = [];
    let exits = [];

    // Informacion de los datos del horario
    const { into, out, intoTwo, outTwo, toleranceInto, toleranceOut, name } = schedule

    // Informacion de los datos del momento en que se realizar el registro
    const { year, day, month, hour, minute } = this.getCurrentDateTimeInfo();

    // Formato de la fecha: date: '24/10/2023'
    const date = day <= 9 ? `0${day}/${month}/${year}` : `${day}/${month}/${year}`

    //currentHourDecimal: 0.8
    const currentHourDecimal = this.convertHourToDecimal(`${hour}:${minute}`);

    // formatMinute: '48'
    const formatMinute = minute <= 9 ? `0${minute}` : `${minute}`

    // markHourFormat: '00:48'
    const markHourFormat = hour <= 9 ? `0${hour}:${formatMinute}` : `${hour}:${formatMinute}`;

    const morningEntryResult = this.handleControlPoint(into, toleranceInto, currentHourDecimal, markHourFormat, ControlPoints.ENTRADA);
    const hasMorningEntryRecord = await this.hasEntranceRecordedForShift(personalID, date, 'MAÑANA', 'entrance');
    if (morningEntryResult.marked && !hasMorningEntryRecord) {
      const recordWithShift = { ...morningEntryResult.record, shift: 'MAÑANA' };
      entrances.push(recordWithShift);
    } else if (morningEntryResult.marked && hasMorningEntryRecord) {
      throw new BadRequestException('Ya existe un registro de entrada para el turno de la MAÑANA.');
    } 
    
    const morningExitResult = this.handleControlPoint(out, toleranceOut, currentHourDecimal, markHourFormat, ControlPoints.SALIDA);
    const hastMorningExitRecord = await this.hasEntranceRecordedForShift(personalID, date, 'MAÑANA', 'exit');
    if (morningExitResult.marked && !hastMorningExitRecord ) {
      const recordWithShift = { ...morningExitResult.record, shift: 'MAÑANA' };
      exits.push(recordWithShift);
    } else if( morningExitResult.marked &&  hastMorningExitRecord) {
      throw new BadRequestException('Ya existe un registro de salida para el turno de la MAÑANA.');
    }

    const afternoonEntryResult = this.handleControlPoint(intoTwo, toleranceInto, currentHourDecimal, markHourFormat, ControlPoints.ENTRADA);
    const hasAfternoonEntryRecord = await this.hasEntranceRecordedForShift(personalID, date, 'TARDE', 'entrance');
    if (afternoonEntryResult.marked && !hasAfternoonEntryRecord) {
      const recordWithShift = { ...afternoonEntryResult.record, shift: 'TARDE' };
      entrances.push(recordWithShift);
    } else if (afternoonEntryResult.marked && hasAfternoonEntryRecord) {
      throw new BadRequestException('Ya existe un registro de entrada para el turno de la TARDE.');
    }

    const afternoonExitResult = this.handleControlPoint(outTwo, toleranceOut, currentHourDecimal, markHourFormat, ControlPoints.SALIDA);
    const hastAfternoonExitRecord = await this.hasEntranceRecordedForShift( personalID, date, 'TARDE', 'exit')
    if (afternoonExitResult.marked && !hastAfternoonExitRecord) {
      const recordWithShift = { ...afternoonExitResult.record, shift: 'TARDE' };
      exits.push(recordWithShift);
    } else if (afternoonExitResult.marked && hastAfternoonExitRecord) {
      throw new BadRequestException('Ya existe un registro de salida para el turno de la TARDE.');
    }

    if( !afternoonExitResult.marked && !afternoonEntryResult.marked && !morningExitResult.marked && !morningEntryResult.marked ) {
      throw new BadRequestException('No se pude realizar el registro en horario laboral')
    }

    if (name) {
      return {
        date,
        specialDay: name,
        entrances,
        exits
      }
    } else {
      return {
        date,
        specialDay: '',
        entrances,
        exits
      }
    }
  }

  private handleControlPoint(
    controlHour: string,
    tolerance: number,
    currentHourDecimal: number,
    markedHour: string,
    controlType: ControlPoints
  ) {
    const controlHourDecimal = this.convertHourToDecimal(controlHour);

    let isWithinControlRange: boolean;
    let infraccion: number;
    let status: AttendanceStatus;
    let shift: string;

    if (controlType === ControlPoints.ENTRADA) {
      isWithinControlRange = currentHourDecimal >= controlHourDecimal - 0.25 && currentHourDecimal <= (controlHourDecimal + 0.25) + tolerance / 60
      if (isWithinControlRange) {
        if (currentHourDecimal <= controlHourDecimal + tolerance / 60) {
          infraccion = 0;
          status = AttendanceStatus.PUNTUAL;
        } else {
          infraccion = (currentHourDecimal - (controlHourDecimal + tolerance / 60)) * 60;
          status = AttendanceStatus.RETRASO;
        }
      } else {
        return { 
          marked: false, 
          record: {
            hour: null,
            tolerance: null,
            marketHour: null,
            infraccion: "Inasistencia",
            type: null,
            status: AttendanceStatus.INASISTENCIA,
            shift: this.determineShift(controlHourDecimal)
          }
        }
      }

      // Arreglar el bug de retraso por la tarde
    } else if (controlType === ControlPoints.SALIDA) {
      isWithinControlRange = currentHourDecimal >= controlHourDecimal && currentHourDecimal <= controlHourDecimal + 0.25 + tolerance / 60;

      if (isWithinControlRange) {
        if (currentHourDecimal <= controlHourDecimal) {
          infraccion = 0;
          status = AttendanceStatus.PUNTUAL;
        } else {
          infraccion = (currentHourDecimal - controlHourDecimal) * 60;
          status = AttendanceStatus.RETRASO;
        }
      } else{
        return { 
          marked: false, 
          record: {
            hour: null,
            tolerance: null,
            marketHour: null,
            infraccion: "Inasistencia",
            type: null,
            status: AttendanceStatus.INASISTENCIA,
            shift: this.determineShift(controlHourDecimal)
          }
        }
      }
    }

    if (isWithinControlRange) {
      const infraccionFormat = this.infraccionFormat(infraccion);
      const record = this.createRecord(controlHour, tolerance, markedHour, infraccionFormat, controlType, status, shift);
      return { marked: true, record };
    }

    return { marked: false, record: null };
  }

  private createRecord(hour: string, tolerance: number, marketHour: string, infraccion: string, type: string, status: string, shift: string) {
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

  private infraccionFormat(infraccion: number) {
    // const infraccionFormatString = `${infraccion} min`
    const infraccionFormatString = `${parseInt(infraccion.toString().split('.')[0])} min`;
    return infraccionFormatString;
  }

  private convertHourToDecimal(hourString: any) {
    const [hour, minutes] = hourString.split(':').map(Number);
    return hour + minutes / 60;
  }

  private getCurrentDateTimeInfo(): DateTimeInfo {
    const currentDate = new Date();
    const currentDayOfWeekNumber = currentDate.getDay();
    const currentMinute = currentDate.getMinutes();
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let month: any;
    if (currentMonth <= 9) {
      month = `0${currentMonth}`;
    } else {
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

  private determineShift(controlHourDecimal: number): string {
    const midday = 12.0; 
    
    if (controlHourDecimal < midday) {
      return 'MAÑANA';
    } else {
      return 'TARDE';
    }
  }

  // Integrar la función hasEntranceRecordedForShift que verifica si ya existe un registro para un turno específico
  private async hasEntranceRecordedForShift(personalId: string, date: string, shift: string, recordType: string) {
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
          } else if (recordType === 'exit') {
            return detailForDate.exits.some(exit => exit.shift === shift);
          }
        }
      }
      return false;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async findOneReport(personalId: string): Promise<Buffer> {
    const attendancePersonal = await this.personalAttendanceModel.findOne({ personalId }).exec();
    if( attendancePersonal ) {
      const { name, lastName, ci, schedule, attendanceDetail} = attendancePersonal
      const data = { name,lastName, ci, schedule, attendanceDetail };
      return await this.generateReportAttendance.generateReportAttendance(data);
    } else {
      throw new BadRequestException('No se pudo generar el pdf')
    }
  }

  // async findOneReport(personalId: string) {
  //   const attendancePersonal = await this.personalAttendanceModel.findOne({ personalId }).exec();
  //   if( attendancePersonal ) {
  //     const { name, lastName, ci, schedule, attendanceDetail} = attendancePersonal
  //     const data = { name,lastName, ci, schedule, attendanceDetail };
  //     console.log( data )
  //     // return this.generateReportHtml(data);
  //   } else {
  //     throw new BadRequestException('No se pudo generar el pdf')
  //   }
  // }
  

  // generateReportHtml(data: any): string {
  //   try {
  //     return this.reportTemplate(data);
  //   } catch (error) {
  //     console.error("Error generando el reporte:", error);
  //     throw new Error("Error al generar el reporte.");
  //   }
  // }

  // Generacion de Reportes 
  // generateReport(data: any): Promise<Buffer>  {
  //   return new Promise((resolve, reject ) => {
  //     const doc = new PDFDocument();
  //     let buffers = [];
  
  //     doc.on('data', buffers.push.bind(buffers));
  //     doc.on('end', () => {
  //       const pdfData = Buffer.concat(buffers);
  //       resolve(pdfData);
  //     });
  //     doc.on('error', err => reject(err))
  
  //     // Titulo
  //     doc.moveDown()
  //       .fontSize(15)
  //       .text('SISTEMA DE CONTROL DE PERSONAL', { align: 'center' })
  //       .moveDown()
  //       .fontSize(20)
  //       .text('REPORTE DE ASISTENCIAS', { align: 'center' })
  //       .moveDown(2);

  //      // Información personal
  //     doc.fontSize(14)
  //       .text(`Nombre Completo: ${data.name} ${data.lastName}`)
  //       .text(`CI: ${data.ci}`)
  //       .moveDown();
  //       // .text(`Nro. Doc: ${data.docNumber}`)

  
  //     doc.fontSize(14)
  //        .text(`Nombre: ${data.name} ${data.lastName}`)
  //        .text(`C.I.: ${data.ci}`)
  //        .moveDown();
  
  //     data.attendanceDetail.forEach(detail => {
  //       doc.text(`Fecha: ${detail.date}`)
  //          .text(`Día Especial: ${detail.specialDay}`)
  //          .moveDown();
  
  //       detail.entrances.forEach(entrance => {
  //         doc.text(`Hora Marcada: ${entrance.marketHour}`)
  //            .text(`Infracción: ${entrance.infraccion}`)
  //            .text(`Tipo: ${entrance.type}`)
  //            .text(`Estado: ${entrance.status}`)
  //            .text(`Turno: ${entrance.shift}`)
  //            .moveDown();
  //       });
  //     });
  //     doc.end();
  //   })
  // }
}































































// import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateAttendanceControlDto } from './dto/create-attendance-control.dto';
// import { UpdateAttendanceControlDto } from './dto/update-attendance-control.dto';
// import axios from 'axios';
// import { InjectModel } from '@nestjs/mongoose';
// import { Personal } from 'src/personal/schemas/personal.schema';
// import { Model } from 'mongoose';
// import { Schedule } from 'src/schedule/schemas/schedule.schema';
// import { PersonalAttendance } from './schemas/attendance-control.schema';
// import { AttendanceStatus, ControlPoints, DateTimeInfo } from './interfaces/DateTimeInfo.interface';

// @Injectable()
// export class AttendanceControlService {

//   constructor(
//     @InjectModel(PersonalAttendance.name)
//     private readonly personalAttendanceModel: Model<PersonalAttendance>,

//     @InjectModel(Personal.name)
//     private readonly personalModel: Model<Personal>,

//     @InjectModel(Schedule.name)
//     private readonly scheduleModel: Model<Schedule>,
//   ) { }

//   create(createAttendanceControlDto: CreateAttendanceControlDto) {
//     return 'This action adds a new attendanceControl';
//   }

//   async findAll(): Promise<PersonalAttendance[]> {
//     return await this.personalAttendanceModel.find().exec();
//   }

//   async findOne(personalId: string) {
//     const attendancePersonal = await this.personalAttendanceModel.findOne({ personalId }).exec();
//     return attendancePersonal;
//   }

//   update(id: number, updateAttendanceControlDto: UpdateAttendanceControlDto) {
//     return `This action updates a #${id} attendanceControl`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} attendanceControl`;
//   }

//   // Funcion Principal
//   async registerAttendance(base: string) {
//     const userId = await this.sendImageToRecognitionSystem(base);
//     console.log('sendImage', userId);
//     if (!userId) {
//       throw new BadRequestException('No se pudo reconocer al usuario.');
//     }
//     await this.processAttendance(userId);
//     return userId;
//   }

//   // Funcion que recibe la imagen y procesa
//   private async sendImageToRecognitionSystem(base: string): Promise<string | null> {
//     try {
//       const response = await axios.post(`http://10.10.214.111:8000/`, { base });
//       if (response.data && response.data.name) {
//         return response.data.name;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.error('Error al enviar imagen al sistema de reconocimiento:', error.message);
//       return null;
//     }
//   }

//   // Funcion que recibe al personal identificado
//   private async processAttendance(userId: string) {
//     const user = await this.personalModel.findById(userId);

//     if (!user) {
//       throw new BadRequestException('No se encontró el personal');
//     }
//     await this.processSchedule(user);
//   }

//   // Si se reconoce la persona y tiene un horario activo
//   private async processSchedule(user: any) {
//     const { schedule } = user;
//     const scheduleObj = await this.scheduleModel.findById(schedule);

//     console.log('scheduleObj', scheduleObj);

//     if (!scheduleObj) {
//       throw new BadRequestException('No se encontró un horario establecido');
//     }

//     if (!scheduleObj.isActive) {
//       throw new BadRequestException('No se pudo realizar el registro, el horario se encuentra inactivo');
//     }

//     await this.createAttendanceRecord(user, scheduleObj);
//   }

//   // Funcion que recibe el pesonal identificado con el horario establecido 
//   private async createAttendanceRecord(user: any, schedule: any) {
//     console.log('personal123', user);

//     let dailyAttendanceDetail: any;

//     let savedData: any

//     const { day, dayOfWeek, dayOfWeekNumber } = this.getCurrentDateTimeInfo();
//     console.log(dayOfWeekNumber);

//     // this.verificarFaltas(user, dayOfWeek);

//     const existingAttendance = await this.personalAttendanceModel.findOne({
//       personalId: user._id
//     });

//     console.log(existingAttendance);

//     const specialScheduleForToday = schedule.scheduleSpecial
//       .find(specSchedule => specSchedule.day === dayOfWeekNumber && specSchedule.isActive)

//     console.log(specialScheduleForToday);

//     const normalScheduleForToday = schedule.scheduleNormal
//       .find(normalSchedule => normalSchedule.day === dayOfWeekNumber);

//     console.log(normalScheduleForToday);

//     if (specialScheduleForToday) {
//       console.log('specialScheduleForToday exists:', specialScheduleForToday);

//       const personalAsigned = specialScheduleForToday.usersAssigned
//         .find(personalId => personalId.toString() === user._id.toString());

//       console.log(personalAsigned);

//       if (personalAsigned) {  // Aquí simplemente verifico si es truthy.
//         console.log('Assigned to special schedule');
//         dailyAttendanceDetail = this.createDayAttendanceDetail(specialScheduleForToday);
//         console.log('specialScheduleForToday Detail:', dailyAttendanceDetail);
//       } else {
//         console.log('User not assigned to special schedule');
//       }
//     } else {
//       console.log('No specialScheduleForToday');
//     }

//     if (!dailyAttendanceDetail && normalScheduleForToday) {
//       console.log('Falling back to normal schedule');
//       dailyAttendanceDetail = this.createDayAttendanceDetail(normalScheduleForToday);
//       console.log('Using normalScheduleForToday:', dailyAttendanceDetail);
//     }

//     if (!specialScheduleForToday && !normalScheduleForToday) {
//       throw new BadRequestException(`Los días ${dayOfWeek} no pertenecen al horario ${schedule.name}`);
//     }

//     if (!dailyAttendanceDetail) {
//       throw new BadRequestException(`Los días ${dayOfWeek} no pertenecen al horario ${schedule.name}`);
//     }

//     if (existingAttendance) {
//       // Verificar si ya existe un registro para el día actual
//       const existingRecordForToday = existingAttendance.attendanceDetail
//         .find(detail => detail.date === dailyAttendanceDetail.date);

//       if (existingRecordForToday) {
//         existingRecordForToday.entrances = [...existingRecordForToday.entrances, ...dailyAttendanceDetail.entrances];
//         existingRecordForToday.exits = [...existingRecordForToday.exits, ...dailyAttendanceDetail.exits];
//       } else {
//         // Agregar un nuevo registro para el día actual
//         existingAttendance.attendanceDetail.push(dailyAttendanceDetail);
//       }

//       console.log("Actualizando registro existente:", existingAttendance._id);

//       savedData = await existingAttendance.save();
//       console.log(savedData);
//       return savedData;

//     } else {
//       // Si no existe una planilla para el personal, crear una nueva
//       const attendance = new this.personalAttendanceModel({
//         personalId: user._id,
//         name: user.name,
//         lastName: user.lastName,
//         ci: user.ci,
//         schedule: schedule._id,
//         attendanceDetail: [dailyAttendanceDetail]
//       });

//       console.log("Creando nuevo registro para el usuario:", user._id);
//       savedData = await attendance.save();
//       console.log(savedData);
//       return savedData;
//     }
//   }

//   // Función para crear un detalle de asistencia para un día especial
//   private createDayAttendanceDetail(schedule: any) {

//     let entrances = [];
//     let exits = [];

//     const { into, out, intoTwo, outTwo, toleranceInto, toleranceOut, name } = schedule
//     console.log(into, out, intoTwo, outTwo, toleranceInto, toleranceOut, name, "schedule")

//     const { year, day, month, hour, minute, dayOfWeek } = this.getCurrentDateTimeInfo();
//     console.log(year, day, month, hour, minute, dayOfWeek, "getCurrent");

//     const date = `${day}/${month}/${year}`

//     let canMarkExit: boolean;

//     const currentHourDecimal = this.convertHourToDecimal(`${hour}:${minute}`);
//     const markHourFormat = hour <= 9 ? `0${hour}:${minute}` : `${hour}:${minute}`;
    
//     let recordWithShift: any;

//     let morningEntryResult = {
//       marked: false,
//       record: this.createRecord('---', 0, null, '', '', AttendanceStatus.INASISTENCIA, 'MAÑANA')
//     };

//     let afternoonEntryResult = {
//       marked: false,
//       record: this.createRecord('---', 0, null, '', '', AttendanceStatus.INASISTENCIA, 'TARDE')
//     };

//     morningEntryResult = this.handleControlPoint(into, toleranceInto, currentHourDecimal, markHourFormat, ControlPoints.ENTRADA);
//     if (morningEntryResult.marked) {
//       canMarkExit = true;
//       recordWithShift = { ...morningEntryResult.record, shift: 'MAÑANA' };
//       entrances.push(recordWithShift);
//     } else {
//       canMarkExit = false
//       recordWithShift = { ...morningEntryResult.record, shift: 'MAÑANA' }
//       entrances.push(recordWithShift);
//     }

//     const morningExitResult = this.handleControlPoint(out, toleranceOut, currentHourDecimal, markHourFormat, ControlPoints.SALIDA);
//     if( canMarkExit ) {
//       if (morningExitResult.marked) {
//         recordWithShift = { ...morningExitResult.record, shift: 'MAÑANA' };
//         exits.push(recordWithShift);
//       } else {
//         recordWithShift = { ...morningExitResult.record, shift: 'MAÑANA' }
//         exits.push(recordWithShift);
//       }
//     } else {
//       morningExitResult.marked = false;
//       recordWithShift = { ...morningExitResult.record, shift: 'MAÑANA' }
//       exits.push(recordWithShift);
//     }
    

//     afternoonEntryResult = this.handleControlPoint(intoTwo, toleranceInto, currentHourDecimal, markHourFormat, ControlPoints.ENTRADA);
//     if (afternoonEntryResult.marked) {
//       canMarkExit = true;
//       recordWithShift = { ...afternoonEntryResult.record, shift: 'TARDE' };
//       entrances.push(recordWithShift);
//     } else {
//       canMarkExit = false
//       recordWithShift = { ...afternoonEntryResult.record, shift: 'TARDE' };
//       entrances.push(recordWithShift);
//     }

//     const afternoonExitResult = this.handleControlPoint(outTwo, toleranceOut, currentHourDecimal, markHourFormat, ControlPoints.SALIDA);
//     if( canMarkExit ) {
//       if (afternoonExitResult.marked) {
//         recordWithShift = { ...afternoonExitResult.record, shift: 'TARDE' };
//         exits.push(recordWithShift);
//       } else {
//         recordWithShift = { ...afternoonExitResult.record, shift: 'TARDE' };
//         exits.push(recordWithShift);
//       }
//     } else {
//       afternoonExitResult.marked = false
//       recordWithShift = { ...afternoonExitResult.record, shift: 'TARDE' }
//       exits.push(recordWithShift);
//     }

//     if (name) {
//       return {
//         date,
//         specialDay: name,
//         entrances,
//         exits
//       }
//     } else {
//       return {
//         date,
//         specialDay: '',
//         entrances,
//         exits
//       }
//     }
//   }

//   private handleControlPoint(
//     controlHour: string,
//     tolerance: number,
//     currentHourDecimal: number,
//     markedHour: string | null,
//     controlType: ControlPoints
//   ) {
//     const controlHourDecimal = this.convertHourToDecimal(controlHour);

//     let isWithinControlRange: boolean;
//     let infraccion: number;
//     let status: AttendanceStatus;
//     let shift: string;

//     if (controlType === ControlPoints.ENTRADA) {
//       isWithinControlRange = currentHourDecimal >= controlHourDecimal - 1 && currentHourDecimal <= (controlHourDecimal + 1) + tolerance / 60
//       if (isWithinControlRange) {
//         if (currentHourDecimal <= controlHourDecimal + tolerance / 60) {
//           infraccion = 0;
//           status = AttendanceStatus.PUNTUAL;
//         } else {
//           infraccion = (currentHourDecimal - (controlHourDecimal + tolerance / 60)) * 60;
//           status = AttendanceStatus.RETRASO;
//         }
//       }
//     } else if (controlType === ControlPoints.SALIDA) {
//       isWithinControlRange = currentHourDecimal >= controlHourDecimal && currentHourDecimal <= controlHourDecimal + 1 + tolerance / 60;

//       if (isWithinControlRange) {
//         if (currentHourDecimal <= controlHourDecimal) {
//           infraccion = 0;
//           status = AttendanceStatus.PUNTUAL;
//         } else {
//           infraccion = (currentHourDecimal - controlHourDecimal) * 60;
//           status = AttendanceStatus.RETRASO;
//         }
//       }
//     }

//     if (isWithinControlRange) {
//       const infraccionFormat = this.infraccionFormat(infraccion);
//       const record = this.createRecord(controlHour, tolerance, markedHour, infraccionFormat, controlType, status, shift);
//       return { marked: true, record };
//     } else {
//       return { marked: false, record: this.createRecord(controlHour, tolerance, markedHour, '', '', AttendanceStatus.AUSENCIA, shift) };
//     }
//   }

//   private createRecord(hour: string, tolerance: number, marketHour: string, infraccion: string, type: string, status: string, shift: string) {
//     return {
//       hour: hour,
//       tolerance: tolerance,
//       marketHour: marketHour,
//       infraccion: infraccion,
//       type: type,
//       status: status,
//       shift: shift
//     };
//   }

//   private infraccionFormat(infraccion: number) {
//     // const infraccionFormatString = `${infraccion} min`
//     const infraccionFormatString = `${parseInt(infraccion.toString().split('.')[0])} min`;
//     return infraccionFormatString;
//   }
  
//   private convertHourToDecimal(hourString: any) {
//     const [hour, minutes] = hourString.split(':').map(Number);
//     return hour + minutes / 60;
//   }

//   private getCurrentDateTimeInfo(): DateTimeInfo {
//     const currentDate = new Date();
//     const currentDayOfWeekNumber = currentDate.getDay();
//     const currentMinute = currentDate.getMinutes();
//     const currentHour = currentDate.getHours();
//     const currentDay = currentDate.getDate();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentYear = currentDate.getFullYear();

//     let month: any;
//     if (currentMonth <= 9) {
//       month = `0${currentMonth}`;
//     } else {
//       month = currentMonth;
//     }

//     const daysOfWeek = [
//       'Domingo',
//       'Lunes',
//       'Martes',
//       'Miércoles',
//       'Jueves',
//       'Viernes',
//       'Sábado'
//     ];

//     const currentDayOfWeek = daysOfWeek[currentDayOfWeekNumber];
    
//     return {
//       date: currentDate,
//       minute: currentMinute,
//       hour: currentHour,
//       day: currentDay,
//       dayOfWeekNumber: currentDayOfWeekNumber,
//       month,
//       year: currentYear,
//       dayOfWeek: currentDayOfWeek
//     };
//   }
// }

// // dailyAttendanceDetail.entrances.forEach(newEntrance => {
//   //   // Asumiendo que hourInto es único para cada entrada
//   //   const isDuplicate = existingRecordForToday.entrances.some(
//     //     existingEntrance => existingEntrance.hourInto === newEntrance.hourInto
//     //   );
//     //   if (!isDuplicate) {
//         //     existingRecordForToday.entrances.push(newEntrance);
//         //   }
//         // });
      
//         // // Fusionar exits
//         // dailyAttendanceDetail.exits.forEach(newExit => {
//           //   // Asumiendo que hourOut es único para cada salida
//           //   const isDuplicate = existingRecordForToday.exits.some(
//             //     existingExit => existingExit.hourOut === newExit.hourOut
//             //   );
//             //   if (!isDuplicate) {
//         //     existingRecordForToday.exits.push(newExit);
//         //   }
//         // });

//         // // Funcionalidad para verificar las faltas. 
//         // async verificarFaltas(personalId: string, currentDate: string) {
//         //   // Obtén la fecha actual y la última fecha registrada para el personalId.
//         //   let ultimaFechaRegistrada = this.obtenerUltimaFechaRegistrada(personalId);
        
//         //   // Obtén todos los días del horario de la persona entre currentDate y ultimaFechaRegistrada.
//         //   let diasHorario = this.obtenerDiasHorario(personalId, currentDate, ultimaFechaRegistrada);
        
//         //   // Para cada día en los días del horario...
//         //   for (let dia of diasHorario) {
//         //     // Verifica si el día tiene algún registro.
//         //     let registro = this.obtenerRegistro(personalId, dia);
        
//         //     // Si no tiene ningún registro...
//         //     if (registro == null) {
//         //       // Retorna la información de ausencia.
//         //       return {
//         //         "date": dia,
//         //         "absent": true,
//         //         "entrances": [],
//         //         "exits": []
//         //       };
//         //     }
//         //   }
//         // }
  
//         // private obtenerUltimaFechaRegistrada( idPersonal: string ) {
          
//         // }
        
//         // private obtenerDiasHorario(personalId, currentDate, ultimaFechaRegistrada) {
//         //   return [
//         //     1, 2, 3
//         //   ]
//         // }
        
//         // private obtenerRegistro(personalId, dia) {
        
//         // }