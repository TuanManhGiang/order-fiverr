import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class PackageDetail {
  @Prop({ required: true })
  revision: string;

  @Prop({ required: true })
  deliveryDay: Date;

  @Prop({ required: true })
  unitPrice: number;
}

export class Package {
  @Prop({ required: true })
  package_id: number;

  @Prop({ required: true })
  package_name: string;

  @Prop({ required: true })
  packageDetail: PackageDetail;
}

export class JobPostDetail {
  @Prop()
  profileName: string;
  @Prop()
  description: string;
  @Prop()
  FAQ: string;
  @Prop({ required: true, type: [Package] })
  package: Package[];
}

@Schema({ timestamps: true })
export class PostEntity extends Document {
  @Prop({ required: true })
  jobPostId: number;

  @Prop({ required: true })
  jobName: string;

  @Prop({ required: true })
  categoryDetailName: string;

  @Prop({ required: true })
  vote: number;

  @Prop()
  jobPostDetail: JobPostDetail;
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);
