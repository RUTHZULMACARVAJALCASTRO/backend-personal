import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLicenseDto {
  @IsNotEmpty()
	@IsMongoId()
  personal: string;  // ObjectId del empleado

  @IsNotEmpty()
  @IsEnum(['Medica','Maternidad','Paternidad','Duelo','Vacaciones','Personal'])
  licenseType: string;
	
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	descripcion: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}