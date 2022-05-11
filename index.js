const { Validator, AdapterError } = require('@chainlink/external-adapter')
const { ethers } = require('ethers')
const {
  MATIC_AGGREGATOR_PROXY,
  STMATIC_RATE_PROVIDER,
  MATIC_AGGREGATOR_PROXY_ABI,
  STMATIC_RATE_PROVIDER_ABI,
  RPC_URL
} = require('./constants')

const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Get stMATIC <> MATIC rate
const getMaticStMaticRate = async () => {
  const proxy = new ethers.Contract(
    STMATIC_RATE_PROVIDER,
    STMATIC_RATE_PROVIDER_ABI,
    provider
  )
  return await proxy.getRate()
}

// Get Matic price in USD
const getMaticPriceUSD = async () => {
  const proxy = new ethers.Contract(
    MATIC_AGGREGATOR_PROXY,
    MATIC_AGGREGATOR_PROXY_ABI,
    provider
  )
  return await proxy.latestAnswer()
}

// Create a request
const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input)
  const jobRunID = validator.validated.id

  Promise.all([getMaticStMaticRate(), getMaticPriceUSD()])
    .then(values => {
      const rate = values[0].div(ethers.utils.parseUnits('1', 10))
      const MaticUSD = values[1]

      const data = {
        STMATIC: MaticUSD.mul(rate)
          .div(ethers.utils.parseUnits('1', 8))
          .toNumber()
      }

      callback(200, {
        jobRunID,
        data,
        result: data.STMATIC,
        statusCode: 200
      })
    })
    .catch(error => {
      callback(500, {
        jobRunID,
        status: 'errored',
        error: new AdapterError(error),
        statusCode: 500
      })
    })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
