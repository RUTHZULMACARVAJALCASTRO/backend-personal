import { BadGatewayException, Injectable } from '@nestjs/common';
import { PersonalService } from 'src/personal/personal.service';
import { generatePersonnelData } from './data/seed.personal';

@Injectable()
export class SeedService {

  constructor(
    private readonly personalService: PersonalService
  ) {}

  async runSeed() {
    try {
      await this.insertNewPersonal();
      console.log('Insertion completed successfully.');
    } catch (error) {
      throw new BadGatewayException('No se pudo realizar la insersion de datos')
    }
  }

  private async insertNewPersonal() {
    const seedPersonal = generatePersonnelData();

    const insertPromises = [];
    
    seedPersonal.forEach( personal => {
      insertPromises.push( this.personalService.create( personal ))
    });
    await Promise.all( insertPromises )
  }
}
