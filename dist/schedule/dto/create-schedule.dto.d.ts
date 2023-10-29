declare class DayScheduleDto {
    day: number;
    into: string;
    out: string;
    intoTwo: string;
    outTwo: string;
    toleranceInto: number;
    toleranceOut: number;
}
export declare class SpecialDayScheduleDto extends DayScheduleDto {
    name: string;
    permanente: boolean;
    dateRange?: Date[];
    usersAssigned: string[];
    isActive?: boolean;
    createdAt?: Date;
}
export declare class CreateScheduleDto {
    name: string;
    scheduleNormal: DayScheduleDto[];
    scheduleSpecial?: SpecialDayScheduleDto[];
    isActive: boolean;
    createdAt: Date;
}
export {};
