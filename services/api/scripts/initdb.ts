import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'localhost', endpoint: 'http://localhost:8000' });

export const params = {
  AttributeDefinitions: [
    {
      AttributeName: "Id",
      AttributeType: "S",
    },
    {
      AttributeName: "Sort",
      AttributeType: "S",
    }
  ],
  KeySchema: [
    {
      AttributeName: "Id", //ATTRIBUTE_NAME_1
      KeyType: "HASH",
    },
    {
      AttributeName: "Sort", //ATTRIBUTE_NAME_2
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: 'Auth0Test',
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export const run = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(params));
    console.log('Table Created', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
run();
