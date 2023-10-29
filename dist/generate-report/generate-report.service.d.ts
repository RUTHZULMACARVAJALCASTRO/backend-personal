/// <reference types="node" />
import { ScheduleService } from 'src/schedule/schedule.service';
export declare class GenerateReportService {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    generateReportAttendance(data: any): Promise<Buffer>;
    private formatDateReportUsingInfo;
    private getCurrentDateTimeInfo;
}
