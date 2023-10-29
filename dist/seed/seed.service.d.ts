import { PersonalService } from 'src/personal/personal.service';
export declare class SeedService {
    private readonly personalService;
    constructor(personalService: PersonalService);
    runSeed(): Promise<void>;
    private insertNewPersonal;
}
