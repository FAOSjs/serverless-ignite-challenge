import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters
  const response = await document
    .scan({
      TableName: "todo",
      ProjectionExpression: "user_id, id"
    })
    .promise()

  const todos = response.Items.filter(todo => todo.user_id === user_id)

  if (!todos[0]) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "no todo was found!" })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "sucessfully",
      todos: todos
    })
  }
}