"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReplaceOne = exports.runReplaceAll = exports.getEnvFile = void 0;
const fs = __importStar(require("node:fs/promises"));
function getEnvFile(lines) {
    const env = new Map();
    for (const line of lines) {
        if (line.startsWith("#"))
            continue;
        const firstEqualIndex = line.indexOf("=");
        if (firstEqualIndex === -1)
            continue;
        const key = line.substring(0, firstEqualIndex);
        const value = line.substring(firstEqualIndex + 1);
        env.set(key, value);
    }
    return env;
}
exports.getEnvFile = getEnvFile;
function runReplaceAll(file, output, replaceAll, { logger, removeNonMatches, upsert, write }) {
    return __awaiter(this, void 0, void 0, function* () {
        const envContent = yield fs.readFile(file, "utf8");
        const env = getEnvFile(envContent.split("\n"));
        const replaceMap = getEnvFile(replaceAll.split("\n"));
        logger.info(`Replace list: ${Array.from(replaceMap.keys()).join(", ")}`);
        logger.info(`Env: ${Array.from(env.keys()).join(", ")}`);
        const matches = new Map();
        for (const key of env.keys()) {
            const replaceValue = replaceMap.get(key);
            if (replaceValue === undefined && !removeNonMatches) {
                matches.set(key, env.get(key));
                continue;
            }
            matches.set(key, replaceValue);
        }
        for (const key of replaceMap.keys()) {
            // already replaced or not should be upserted
            if (env.has(key) || !upsert)
                continue;
            matches.set(key, replaceMap.get(key));
        }
        logger.info(`Found ${matches.size} matches`);
        const result = Array.from(matches.keys())
            .map((key) => `${key}=${matches.get(key)}`)
            .join("\n");
        if (write)
            yield fs.writeFile(output, result);
        return result;
    });
}
exports.runReplaceAll = runReplaceAll;
function runReplaceOne(key, value, file, output, { logger, write }) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`Setting ${key} to ${value} in ${file}`);
        const envContent = yield fs.readFile(file, "utf8");
        const env = getEnvFile(envContent.split("\n"));
        if (env.has(key) && env.get(key) === value) {
            logger.info(`${key} is already set to ${value} in ${file}`);
            return;
        }
        env.set(key, value);
        const result = Array.from(env.keys())
            .map((k) => `${k}=${env.get(k)}`)
            .join("\n");
        if (write)
            yield fs.writeFile(output, result);
        logger.info(`Successfully set ${key} to ${value} in ${file}`);
        return result;
    });
}
exports.runReplaceOne = runReplaceOne;
