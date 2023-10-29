import { HttpService } from '@nestjs/axios';
import { LoginCentralDTO } from './api.dto';
export declare class ApiService {
    private readonly httpService;
    private apiSeguridad;
    constructor(httpService: HttpService);
    test(): Promise<string>;
    loginAuthCentral(loginCentralDTO: LoginCentralDTO): Promise<any>;
}
