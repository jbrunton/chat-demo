import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import * as crypto from "crypto";
import { pick } from "rambda";
import { Message } from './entities/message.entity';

const ddbClientConfig = process.env.NODE_ENV === "development"
  ? { endpoint: "http://localhost:8000", region: "local" }
  : { region: "us-east-1", endpoint: "https://dynamodb.us-east-1.amazonaws.com" };

const ddbClient = new DynamoDBClient(ddbClientConfig);

const docClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.DB_TABLE_NAME || "Auth0Test";

const newMessageId = (time: number) => {
  const rand = crypto.randomBytes(4).toString("hex");
  return `Msg#${time}#${rand}`;
};

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor() {
    this.logger.log(`Starting MessagesService with config: ${JSON.stringify({...ddbClientConfig, tableName})}`);
  }

  async create({ roomId, content }: CreateMessageDto): Promise<Message> {
    const time = new Date().getTime();
    const id = newMessageId(time);
    const message: Message = {
      id,
      content,
      time,
    };
    const params = {
      TableName: tableName,
      Item: {
        Id: `Room#${roomId}`,
        Sort: id,
        Data: pick(["content", "time"], message),
        Type: "Message",
      },
    };
    await docClient.send(new PutCommand(params));
    return message;
  }

  async findForRoom(roomId: string): Promise<Message[]> {
    const data = await docClient.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "Id = :roomId and begins_with(Sort,:filter)",
      ExpressionAttributeValues: {
        ":roomId": `Room#${roomId}`,
        ":filter": "Msg#"
      }
    }));
    const messages = data.Items?.map(item => {
      const id = item.Sort;
      const data = item.Data;
      return {
        id,
        ...data,
      };
    });
    return messages || [];
  }
}
