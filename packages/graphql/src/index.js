"use strict";
/**
 * Shared GraphQL utilities for use across all applications
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseCodegenConfig = void 0;
exports.fetchGraphQL = fetchGraphQL;
exports.createGraphQLClient = createGraphQLClient;
/**
 * Generic fetch function for GraphQL queries
 *
 * @param url GraphQL endpoint URL
 * @param query GraphQL query or mutation
 * @param variables Variables for the query
 * @param headers Additional headers to send
 * @returns Response data or null
 */
function fetchGraphQL(url, query, variables, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: __assign({ "Content-Type": "application/json" }, headers),
                            body: JSON.stringify({
                                query: query,
                                variables: variables,
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("GraphQL request failed with status ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (result.errors) {
                        throw new Error("GraphQL errors: ".concat(result.errors.map(function (e) { return e.message; }).join(", ")));
                    }
                    return [2 /*return*/, result.data];
                case 3:
                    error_1 = _a.sent();
                    console.error("GraphQL request error:", error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Base configuration for GraphQL Codegen
 * Can be extended by app-specific configurations
 */
exports.baseCodegenConfig = {
    schema: (_a = {},
        // This is a placeholder - app specific configs will override this
        _a["${GRAPHQL_ENDPOINT}"] = {
            headers: {
            // Common headers can go here
            },
        },
        _a),
    documents: ["src/**/*.graphql"],
    ignoreNoDocuments: true,
    generates: {
    // App specific configs will define their own output
    },
};
/**
 * Helper to create a typed client specific to an app's GraphQL schema
 */
function createGraphQLClient(config) {
    var _this = this;
    var endpoint = config.endpoint, headers = config.headers, queries = config.queries, mutations = config.mutations;
    return {
        queries: queries,
        mutations: mutations,
        execute: function (query, variables) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetchGraphQL(endpoint, query, variables, headers === null || headers === void 0 ? void 0 : headers())];
            });
        }); },
    };
}
