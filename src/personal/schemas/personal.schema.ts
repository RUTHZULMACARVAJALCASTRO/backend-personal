import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Charge } from 'src/charge/schemas/charge.schema';
import { Schedule } from 'src/schedule/schemas/schedule.schema';

@Schema({ timestamps: true })
export class Personal extends Document {
	@Prop({ unique: false })
	name: string;

	@Prop({ unique: false })
	lastName: string;

	@Prop({ unique: true })
	ci: string;

	@Prop({ unique: true })
	email: string;

	@Prop({ unique: true })
	phone: string;

	@Prop({ unique: false })
	address: string;

	@Prop({ unique: false })
	nationality: string;

	@Prop({ required: true })
	unity: string;

	@Prop({ required: true })
	charge: string;

	@Prop({ required: true })
	schedule: string;

	@Prop({ default: '' })
	file?: string;
	
	@Prop({ default: true })
	isActive: boolean;
	

	// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Charge.name }) 
	// chargeRef: Charge; 

	// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Schedule.name }) 
	// scheduleref: Schedule; 
}

export const PersonalSchema = SchemaFactory.createForClass( Personal )

