import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AttendanceControlService } from './attendance-control.service';
import { CreateAttendanceControlDto } from './dto/create-attendance-control.dto';
import { UpdateAttendanceControlDto } from './dto/update-attendance-control.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';

@ApiTags('Asistencia')
@Controller('attendance')
export class AttendanceControlController {
  constructor(private readonly attendanceControlService: AttendanceControlService) { }

  // End-Point que se usa para hacer el control de asistencia 
  @Post('register')
  registerAttendance(@Body('base') base: string) {
    return this.attendanceControlService.registerAttendance(base);
  }

  @Get()
  async findAll() {
    return await this.attendanceControlService.findAll();
  }

  // @Get(':id/report-attendance')
  // async getReport(@Param('id') id: string) {
  //   return await this.attendanceControlService.findOneReport(id);
  // }


  // @Get(':id/report')
  // async getReport(@Param('id') id: string, @Res() res: Response) {
  //   const htmlReport = await this.attendanceControlService.findOneReport(id);
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.setContent(htmlReport);
  //   const pdfBuffer = await page.pdf({ format: 'A4' });
  //   await browser.close();

  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  //   res.send(pdfBuffer);

  //   const data = await this.attendanceControlService.findOneReport(id);
  //   const pdfBuffer = generatePDF(data);
  
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  //   res.send(pdfBuffer);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.attendanceControlService.findOne(id);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updateAttendanceControlDto: UpdateAttendanceControlDto) {
    return this.attendanceControlService.update(+id, updateAttendanceControlDto);
  }

  @Delete()
  remove() {
    return this.attendanceControlService.remove();
  }
}
