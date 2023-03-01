import type { Request } from 'express'
import { BearerTokenError } from './errors'

const token = /^[^\u0000-\u001F\u007F()<>@,;:\\"/?={}\[\]\u0020\u0009]+$/

const isToken = (str: unknown) => typeof str === 'string' && token.test(str)

export const getBearerToken = (req: Request): string => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    throw new BearerTokenError('No Authorization header')
  }

  const [scheme, token] = authorization.split(' ')
  if (scheme.toLowerCase() !== 'bearer') {
    throw new BearerTokenError('Invalid Authorization scheme')
  }

  if (!isToken(token)) {
    throw new BearerTokenError('Invalid Authorization token format')
  }

  return token
}
