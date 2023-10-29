import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LicenseService } from './license.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Licencias')
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}
  
  @Post()
  assignLicense(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licenseService.assignLicense(createLicenseDto);
  }

  @Get()
  findAll() {
    return this.licenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licenseService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licenseService.update(id, updateLicenseDto);
  }

  @Delete('delte-all-licenses')
  remove() {
    return this.licenseService.remove();
  }
}
