# AdmiralCloud Checksum Calculator
This function works with AWS Lambda. It has only one purpose: Ingest a file from S3 and return the MD5 checksum for duplication detection.

##Prerequisites
Install claudiaJS globally
```
npm i claudia -g
```

## Create IAM users who have access to Lambda functions
Lambda will create a role for the function itself. 

In order to allow the function access to S3 you have to create a user with s3.getObject and provide those credentials to the Lambda function. Use config/env/*.json files to provide those credentials.
```
// development.json
{
    "accessKeyId_development": "IAM KEY",
    "secretAccessKey_development": "IAM SECRET"
}
``` 


If you want to use and trigger this function programmatically you will probably need another IAM user with the following permissions:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:GetFunction",
                "lambda:UpdateFunction",
                "lambda:UpdateAlias",
                "lambda:InvokeAsync",
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "*" // restrict it to the appropriate function ARN if necessary
            ]
        }
    ]
}
```


## Updating the function
If you change the code use the following command to update the lambda function, use "make update-dev" or "make update-live" to update the code and add the related environment credentials. You can also use KMS to encrypt those keys.

Check the Makefile to see the actual commands for claudia.

## Testing the function
Create a local file in the test directory with the payload you need to send to the Lambda function and test it with "make test-dev" or "make test-live". The JSON should contain a bucket and S3Key:
```
event-dev.json
{ 
  "bucket": "thebucket"
  "s3Key": "s3Key"
}
```

## Create the function for the first time
If you use the function for the first time, use the following call to create the AWS lambda function. You need your AWS CLI setup - see the AWS documentation for more details.
```
claudia create --region eu-central-1 --handler lambda.handler --name ac-checksumcalculator --profile DEV
```

## Thanks
This little application has been developed by the team of the AdmiralCloud Media Asset Management software - https://www.admiralcloud.com
