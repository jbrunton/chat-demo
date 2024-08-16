import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { SentMessage, UpdatedEntity } from '@entities/messages';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

const CreateMessageSchema = extendApi(
  z.strictObject({
    content: z.string(),
    roomId: z.string(),
  }),
);

export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}

export class SentMessageDto implements SentMessage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  recipientId: string | undefined;

  @ApiProperty()
  updatedEntities: UpdatedEntity[];
}
