import { GenerateReportService } from './generate-report.service';
import { AttendanceControlService } from 'src/attendance-control/attendance-control.service';
export declare class GenerateReportController {
    private readonly attendanceControlService;
    private readonly generateReportService;
    constructor(attendanceControlService: AttendanceControlService, generateReportService: GenerateReportService);
    downloadPdf(personalId: string, res: any): Promise<void>;
}
