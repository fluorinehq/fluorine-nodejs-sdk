import { customErrorFactory } from 'ts-custom-error'

const source = '@fluorinehq/nodejs-sdk'

export const BearerTokenError = customErrorFactory(function BearerTokenError(
  message,
) {
  this.source = source
  this.message = message
  Object.defineProperty(this, 'name', { value: 'BearerTokenError' })
})
