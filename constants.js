const MATIC_AGGREGATOR_PROXY = '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'
const STMATIC_RATE_PROVIDER = '0xdEd6C522d803E35f65318a9a4d7333a22d582199'
const RPC_URL = process.env.RPC_URL || ''

const MATIC_AGGREGATOR_PROXY_ABI = [
  {
    inputs: [],
    name: 'latestAnswer',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const STMATIC_RATE_PROVIDER_ABI = [
  {
    inputs: [],
    name: 'getRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

module.exports = {
  MATIC_AGGREGATOR_PROXY,
  STMATIC_RATE_PROVIDER,
  MATIC_AGGREGATOR_PROXY_ABI,
  STMATIC_RATE_PROVIDER_ABI,
  RPC_URL
}
