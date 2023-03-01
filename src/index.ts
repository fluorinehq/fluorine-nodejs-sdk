import type { RequestHandler } from 'express'

export const authenticate: RequestHandler = (req, res, next) => {
  next()
}
