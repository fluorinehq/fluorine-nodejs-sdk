'use strict';

var got = require('got');
var tsCustomError = require('ts-custom-error');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var source = '@fluorinehq/nodejs-sdk';
var BearerTokenError = tsCustomError.customErrorFactory(function BearerTokenError(message) {
    this.source = source;
    this.message = message;
    Object.defineProperty(this, 'name', { value: 'BearerTokenError' });
});

var token = /^[^\u0000-\u001F\u007F()<>@,;:\\"/?={}\[\]\u0020\u0009]+$/;
var isToken = function (str) { return typeof str === 'string' && token.test(str); };
var getBearerToken = function (req) {
    var authorization = req.headers['authorization'];
    if (!authorization) {
        throw new BearerTokenError('No Authorization header');
    }
    var _a = authorization.split(' '), scheme = _a[0], token = _a[1];
    if (scheme.toLowerCase() !== 'bearer') {
        throw new BearerTokenError('Invalid Authorization scheme');
    }
    if (!isToken(token)) {
        throw new BearerTokenError('Invalid Authorization token format');
    }
    return token;
};

var defaultBaseUrl = 'http://app.fluorinehq.com/api/client';
var initEndpoint = 'init';
var authorizeEndpoint = 'authorize';
var recordEndpoint = 'record';
var isInitialized = function (ctx) { return function (req, res, next) {
    if (ctx.isInitialized) {
        next();
    }
    else {
        next(new Error('Fluorine is not initialized yet'));
    }
}; };
var authenticate = function (ctx) { return function (req, res, next) {
    try {
        req.fluorineAuthToken = getBearerToken(req);
        next();
    }
    catch (error) {
        next(error);
    }
}; };
var authorize = function (ctx) { return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ctx.gotInstance
                        .post(ctx.authorizeEndpoint, {
                        json: {
                            clientId: ctx.clientId,
                            clientSecret: ctx.clientSecret,
                            jwt: req.fluorineAuthToken,
                        },
                    })
                        .json()];
            case 1:
                _b.sent();
                next();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                if (error_1 instanceof got.HTTPError) {
                    return [2 /*return*/, next(new Error("Failed to authorize: ".concat((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.body)))];
                }
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); }; };
var recordEvent = function (ctx) { return function (meta) { return function (req, res, next) {
    ctx.gotInstance
        .post(ctx.recordEndpoint, {
        json: {
            clientId: ctx.clientId,
            clientSecret: ctx.clientSecret,
            jwt: req.fluorineAuthToken,
            meta: meta,
        },
    })
        .catch(function (error) {
        var _a;
        if (error instanceof got.HTTPError) {
            console.warn("Failed to record event: ".concat((_a = error.response) === null || _a === void 0 ? void 0 : _a.body));
        }
        else {
            console.error("Error during record event: ".concat(error));
        }
    });
    next();
}; }; };
function assertIsDefined(value, name) {
    if (value == null || !value) {
        throw new Error("Error: '".concat(name || 'value', "' is not defined (got: ").concat(value, ")"));
    }
}
var getFluorine = function (config) {
    if (!config) {
        throw new Error('Failed to initialize Fluorine: config not provided');
    }
    assertIsDefined(config.clientId, 'clientId');
    assertIsDefined(config.clientSecret, 'clientSecret');
    var gotInstance = got.extend({
        prefixUrl: config.baseUrl || defaultBaseUrl,
    });
    var ctx = {
        authorizeEndpoint: authorizeEndpoint,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        gotInstance: gotInstance,
        isInitialized: false,
        recordEndpoint: recordEndpoint,
    };
    gotInstance
        .post(initEndpoint, {
        json: {
            clientId: config.clientId,
            clientSecret: config.clientSecret,
        },
    })
        .json()
        .then(function () {
        ctx.isInitialized = true;
    })
        .catch(function (error) {
        var _a;
        if (error instanceof got.HTTPError) {
            throw new Error("Failed to initialize Fluorine: ".concat((_a = error.response) === null || _a === void 0 ? void 0 : _a.body));
        }
        throw new Error("Failed to initialize Fluorine: ".concat(error.message));
    });
    return {
        authorize: function () { return [isInitialized(ctx), authenticate(), authorize(ctx)]; },
        record: function (meta) { return [
            isInitialized(ctx),
            authenticate(),
            authorize(ctx),
            recordEvent(ctx)(meta),
        ]; },
    };
};

exports.getFluorine = getFluorine;
//# sourceMappingURL=index.cjs.js.map
