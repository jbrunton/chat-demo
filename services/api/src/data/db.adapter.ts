import {
  CreateTableCommandInput,
  CreateTableCommandOutput,
  DeleteTableCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { PutCommandOutput, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb/dist-types/models';

export interface DBItem<D> {
  Id: string;
  Sort: string;
  Type: string;
  Data: D;
}

export abstract class DBAdapter {
  abstract putItem<D>(item: DBItem<D>): Promise<PutCommandOutput>;

  abstract query<D>(
    params: Omit<QueryCommandInput, 'TableName'>,
  ): Promise<DBItem<D>[]>;

  abstract batchGet<D>(
    keys: Record<string, NativeAttributeValue>[],
  ): Promise<DBItem<D>[]>;

  abstract create(
    params?: Omit<CreateTableCommandInput, 'TableName'>,
  ): Promise<CreateTableCommandOutput>;

  abstract destroy(): Promise<DeleteTableCommandOutput>;

  abstract waitForTable(timeout: number): Promise<void>;
}
