import type { RequestHandler } from 'express'
import got, { HTTPError, type Got } from 'got'
import { getBearerToken } from './token'

declare global {
  namespace Express {
    interface Request {
      fluorineAuthToken: string
    }
  }
}

type FluorineContext = {
  authorizeEndpoint: string
  clientId: string
  clientSecret: string
  gotInstance: Got
  isInitialized: boolean
  recordEndpoint: string
}

type FluorineResponse = { status: 'ok' } | { status: 'error'; message: string }

const defaultBaseUrl = 'http://app.fluorinehq.com/api/client'
const initEndpoint = 'init'
const authorizeEndpoint = 'authorize'
const recordEndpoint = 'record'

const isInitialized: (ctx: FluorineContext) => RequestHandler =
  (ctx) => (req, res, next) => {
    if (ctx.isInitialized) {
      next()
    } else {
      next(new Error('Fluorine is not initialized yet'))
    }
  }

const authenticate: (ctx: FluorineContext) => RequestHandler =
  (ctx) => (req, res, next) => {
    try {
      req.fluorineAuthToken = getBearerToken(req)
      next()
    } catch (error) {
      next(error)
    }
  }

const authorize: (ctx: FluorineContext) => RequestHandler =
  (ctx) => async (req, res, next) => {
    try {
      await ctx.gotInstance
        .post(ctx.authorizeEndpoint, {
          json: {
            clientId: ctx.clientId,
            clientSecret: ctx.clientSecret,
            jwt: req.fluorineAuthToken,
          },
        })
        .json<FluorineResponse>()
      next()
    } catch (error) {
      if (error instanceof HTTPError) {
        return next(new Error(`Failed to authorize: ${error.response?.body}`))
      }
      next(error)
    }
  }

const recordEvent: (ctx: FluorineContext) => (meta?: any) => RequestHandler =
  (ctx) => (meta) => (req, res, next) => {
    ctx.gotInstance
      .post(ctx.recordEndpoint, {
        json: {
          clientId: ctx.clientId,
          clientSecret: ctx.clientSecret,
          jwt: req.fluorineAuthToken,
          meta,
        },
      })
      .catch((error) => {
        if (error instanceof HTTPError) {
          console.warn(`Failed to record event: ${error.response?.body}`)
        } else {
          console.error(`Error during record event: ${error}`)
        }
      })
    next()
  }

function assertIsDefined<T>(
  value: T,
  name?: string,
): asserts value is NonNullable<T> {
  if (value == null || !value) {
    throw new Error(
      `Error: '${name || 'value'}' is not defined (got: ${value})`,
    )
  }
}

export type ClientConfiguration = {
  baseUrl?: string
  clientId: string
  clientSecret: string
}

export type FluorineClient = {
  /**
   * Authorize user.
   *
   * @param meta Additional data to be recorded
   * @returns Express.js middleware
   */
  authorize: (meta?: any) => RequestHandler[]

  /**
   * Authorize user and record usage.
   *
   * @param meta Additional data to be recorded
   * @returns Express.js middleware
   */
  record: (meta?: any) => RequestHandler[]
}

export const getFluorine = (config: ClientConfiguration): FluorineClient => {
  if (!config) {
    throw new Error('Failed to initialize Fluorine: config not provided')
  }

  assertIsDefined(config.clientId, 'clientId')
  assertIsDefined(config.clientSecret, 'clientSecret')

  const gotInstance = got.extend({
    prefixUrl: config.baseUrl || defaultBaseUrl,
  })

  const ctx: FluorineContext = {
    authorizeEndpoint,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    gotInstance,
    isInitialized: false,
    recordEndpoint,
  }

  gotInstance
    .post(initEndpoint, {
      json: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      },
    })
    .json<FluorineResponse>()
    .then(() => {
      ctx.isInitialized = true
    })
    .catch((error) => {
      if (error instanceof HTTPError) {
        throw new Error(
          `Failed to initialize Fluorine: ${error.response?.body}`,
        )
      }
      throw new Error(`Failed to initialize Fluorine: ${error.message}`)
    })

  return {
    authorize: () => [isInitialized(ctx), authenticate(ctx), authorize(ctx)],
    record: (meta?: any) => [
      isInitialized(ctx),
      authenticate(ctx),
      authorize(ctx),
      recordEvent(ctx)(meta),
    ],
  }
}
