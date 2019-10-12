/***
 * This service is triggered with a bucket, s3key and region, should calculate the MD5 checksum and
 * return the result.
 *
 * Set environment variables like so:
 * variable_name_{STAGE} = value
 * For example:
 * accessKeyId_DEV  = IAM KEY
 *
 * Create version and aliases for this function using claudia
 * set-version --version production
 *
 *
 * @param event
 * @param context
 */
const crypto = require('crypto')
const AWS = require('aws-sdk')

function loadConfig(context, cb){

  let functionName = context.functionName
  let functionArn = context.invokedFunctionArn
  let alias = functionArn.split(":").pop()

  //the ARN doesn't include an alias token, therefore we must be executing $LATEST
  if (alias === functionName)  alias = "LATEST"

  let env_config = {
    accessKeyId: process.env['accessKeyId_' + alias],
    secretAccessKey:  process.env['secretAccessKey_' + alias]
  }
  console.log("Using alias %s and key %s", alias, env_config.accessKeyId)
  return cb(env_config)
}

exports.handler =  (event, context, cb) => {
  console.log("EVENT", event)

  // allows for using callbacks as finish/error-handlers
  context.callbackWaitsForEmptyEventLoop = false;

  loadConfig(context, (env_config) => {
    const s3 = new AWS.S3({
      accessKeyId:      env_config.accessKeyId,
      secretAccessKey:  env_config.secretAccessKey,
      region:           event.region || 'eu-central-1',
      signatureVersion: 'v4'
    })

    let s3Params = {
      Bucket: event.bucket,
      Key:    event.s3Key
    }
    let hash     = crypto.createHash('md5')

    let readstream = s3.getObject(s3Params).createReadStream()

    readstream.on('data', (data) => {
      hash.update(data)
    })

    readstream.on('error', (err) => {
      console.log("Error", err)
      return cb(err)
    })

    readstream.on('end', (err) => {
      if(err) return cb(err)
      let md5checksum = hash.digest('hex')
      console.log("Result MD5", md5checksum)
      return cb(null, md5checksum)
    });
  })

};

