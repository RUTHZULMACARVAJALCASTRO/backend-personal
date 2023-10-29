import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Charge extends Document {
	@Prop()
	name: string;

	@Prop()
	description: string;

	@Prop({ default: true })
	isActive: boolean;

	// @Prop({
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: Charge.name
	// })
	// cargo: Charge;
}

export const ChargeSchema = SchemaFactory.createForClass(Charge)
