import { DynamoDBClient, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'localhost', endpoint: 'http://localhost:8000' });

export const run = async () => {
  try {
    const data = await ddbClient.send(new DeleteTableCommand({
      TableName: 'Auth0Test'
    }));
    console.log('Table Delete', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
run();
