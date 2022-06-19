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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const semver_1 = __importDefault(require("semver"));
const path_1 = __importDefault(require("path"));
const APP_LIST = ["node", "npm", "yarn"];
const PROJECT_PATH = process.cwd();
const cmd = (command, executePath) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, { cwd: executePath }, (error, stdout, stderr) => {
            if (error)
                reject(stderr);
            if (!error)
                resolve(stdout);
        });
    });
};
function getPackageJson() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packageJsonPath = path_1.default.resolve(PROJECT_PATH, "package.json");
            const packageJson = yield Promise.resolve().then(() => __importStar(require(packageJsonPath)));
            return packageJson;
        }
        catch (e) {
            return {};
        }
    });
}
function versionValid(appName) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const currentVersion = (yield cmd(`${appName} --version`, PROJECT_PATH))
            .trim()
            .replace("v", "");
        const packageJson = yield getPackageJson();
        const requiredVersion = ((_a = packageJson.engines) === null || _a === void 0 ? void 0 : _a[appName]) || ((_b = packageJson.volta) === null || _b === void 0 ? void 0 : _b[appName]);
        const isValid = !requiredVersion || semver_1.default.satisfies(currentVersion, requiredVersion);
        const result = isValid
            ? `\x1b[32m${appName}: ${currentVersion} (versión requerida: ${requiredVersion})\x1b[0m\n`
            : `\x1b[31m${appName}: ${currentVersion}\x1b[0m \x1b[33m(versión requerida: ${requiredVersion})\x1b[0m\n`;
        process.stdout.write(result);
        return isValid;
    });
}
function getApps() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = yield getPackageJson();
        const appSet = new Set();
        if (packageJson.engines)
            Object.keys(packageJson.engines).map((key) => appSet.add(key));
        if (packageJson.volta)
            Object.keys(packageJson.volta).map((key) => appSet.add(key));
        const appSelectedList = Array.from(appSet);
        return APP_LIST.filter((app) => appSelectedList.includes(app));
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // SHOW APP VERSION
        if (process.argv.join(" ").includes(" --version") ||
            process.argv.join(" ").includes(" -v")) {
            const version = (yield Promise.resolve().then(() => __importStar(require(`${__dirname}/../package.json`)))).version;
            return process.stdout.write(`${version}\n`);
        }
        // EXECUTE APP
        const appList = yield getApps();
        if (appList.length === 0) {
            const msg = `\x1b[32m\n¡Ups! ¿estamos dentro del proyecto?\x1b[0m

Si es asi, puedes especificar la versión de \x1b[36mnode\x1b[0m, \x1b[36mnpm\x1b[0m y/o \x1b[36myarn\x1b[0m dentro del archivo \x1b[36mpackage.json\x1b[0m

Ejemplo:

\x1b[36m{
  "name": "my-project",
  "version": "1.0.0",
  "engines": {
    "node": "^16",
    "npm": "^8"
  }
}\x1b[0m\n\n`;
            return process.stdout.write(msg);
        }
        let isValid = true;
        const packageJson = yield getPackageJson();
        process.stdout.write(`\x1b[94m${packageJson.name}: ${packageJson.version}\x1b[0m\n`);
        for (const appItem of appList) {
            if (!(yield versionValid(appItem)))
                isValid = false;
        }
        if (!isValid) {
            process.stdout.write(`\n\x1b[33m¡Ups! no podemos continuar.\n\nVerifica que la versión requerida se encuentre activada (Ej.: node --version) e inténtalo nuevamente.\x1b[0m\n\n`);
            process.exit(1);
        }
        process.stdout.write(`\n\x1b[94mParece que todo está en orden, continuemos...\x1b[0m\n\n`);
    });
}
init().catch((e) => {
    console.error(e);
    process.exit(1);
});
