import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { InjectModel } from '@nestjs/mongoose';
import { License } from './schema/license.schema';
import { Model } from 'mongoose';

@Injectable()
export class LicenseService {
  constructor(
    @InjectModel(License.name)
    private readonly licenseModel: Model<License>
  ) { }

  async assignLicense(createLicenseDto: CreateLicenseDto) {
    try {
      const license = await this.licenseModel.create(createLicenseDto);
      return license;

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    const licenses = await this.licenseModel.find()
      .sort({ createdAt: -1 })
    console.log('licenciassssssss')
    return licenses;
  }

  async findOne(id: string) {
    try {
      const license = await this.licenseModel.findById({_id: id})
      return license 
    } catch (error) {
      throw new BadRequestException('Not found license');
    }
  }

  async update(id: string, updateLicenseDto: UpdateLicenseDto) {
    const licenseUpdate = await this.findOne( id );
    try {
      await licenseUpdate.updateOne( updateLicenseDto );
      return { ...licenseUpdate.toJSON(), ...updateLicenseDto }
    } catch (error) {
      throw new BadRequestException('No se pudo actualizar la licencia');
    }
  }

  async remove() {
    await this.licenseModel.deleteMany({}).exec();
  }
}
