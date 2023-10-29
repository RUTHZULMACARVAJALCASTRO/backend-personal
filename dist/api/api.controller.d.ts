import { Request, Response } from 'express';
import { ApiService } from './api.service';
import { LoginCentralDTO } from './api.dto';
import { HttpService } from '@nestjs/axios';
export declare class ApiController {
    private readonly apiService;
    private readonly httpService;
    constructor(apiService: ApiService, httpService: HttpService);
    loginCentral(req: Request, res: Response, loginCentralDTO: LoginCentralDTO): Promise<void>;
}
