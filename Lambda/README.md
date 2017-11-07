# Lambda Functions

## Alexa_DynamoDB
- Runtime: Node.js v6.10
- Handler: index.handler
- Tag: lambda-console:blueprint, alexa-skill-kit-sdk-factskill
- IAM: LambdaFullAccessRole
- Trigger: Alexa Skills Set
- Description: Demonstrate a basic fact skill built with the ASK NodeJS SDK.

## PostReader_NewPosts
- Runtime: Python 2.7
- Handler: index.lambda_handler
- Environment Variable: SNS_TOPIC, DB_TABLE_NAME
- IAM: LambdaPostReaderRole
- Trigger: API Gateway (SNS)
- Description: This is a function to write a new post to database.

## PostReader_GetPosts
- Runtime: Python 2.7
- Handler: index.lambda_handler
- Environment Variable: DB_TABLE_NAME
- IAM: LambdaPostReaderRole
- Trigger: API Gateway
- Description: This is a function to retrieve posts from database.

## PostReader_ConvertToAudio
- Runtime: Python 2.7
- Handler: index.lambda_handler
- Environment Variable: DB_TABLE_NAME, BUCKET_NAME
- IAM: LambdaPostReaderRole
- Trigger: SNS
- Timeout: 5 mins
- Description: This is a function to convert text into audio file(mp3) with using Amazon Polly.
