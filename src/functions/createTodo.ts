import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export interface ITodo {
  id: String,
  title: String,
  user_id: String,
  deadline: String,
  done: false,
  createdAt: number
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, title, deadline } = JSON.parse(event.body) as ITodo
  const { user_id } = event.pathParameters

  const newTodo: ITodo = {
    id,
    user_id,
    title,
    deadline,
    done: false,
    createdAt: new Date().getTime()
  }

  await document
    .put({
      TableName: "todo",
      Item: newTodo
    })
    .promise();


	const response = await document
    .query({
      TableName: "todo",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": newTodo.id
      }
    })
    .promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "succesfully!",
      todo: response.Items[0]
    })
  }
}