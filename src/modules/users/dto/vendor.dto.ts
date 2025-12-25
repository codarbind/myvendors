import { ApiProperty } from "@nestjs/swagger";
import { ObjectIdDto } from "./primitives.dto";
import { IsMongoId } from "class-validator";


export class VendorDto {
  @ApiProperty({
    example: '694a8e0d0a7d823692b17a74',
    description: 'Vendor unique identifier',
  })
  @IsMongoId()
  id: ObjectIdDto;
}