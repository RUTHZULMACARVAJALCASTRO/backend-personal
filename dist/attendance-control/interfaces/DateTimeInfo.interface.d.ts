export interface DateTimeInfo {
    date: Date;
    minute: number;
    hour: number;
    day: number;
    dayOfWeekNumber: number;
    month: number;
    year: number;
    dayOfWeek: string;
}
export declare enum ControlPoints {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA"
}
export declare enum AttendanceStatus {
    PUNTUAL = "PUNTUAL",
    RETRASO = "RETRASO",
    INASISTENCIA = "INASISTENCIA",
    AUSENCIA = "AUSENCIA"
}
