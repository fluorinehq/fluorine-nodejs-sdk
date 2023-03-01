import type { RequestHandler } from 'express';
declare global {
    namespace Express {
        interface Request {
            fluorineAuthToken: string;
        }
    }
}
export type ClientConfiguration = {
    baseUrl?: string;
    clientId: string;
    clientSecret: string;
};
export type FluorineClient = {
    /**
     * Authorize user.
     *
     * @param meta Additional data to be recorded
     * @returns Express.js middleware
     */
    authorize: (meta?: any) => RequestHandler[];
    /**
     * Authorize user and record usage.
     *
     * @param meta Additional data to be recorded
     * @returns Express.js middleware
     */
    record: (meta?: any) => RequestHandler[];
};
export declare const getFluorine: (config: ClientConfiguration) => FluorineClient;
