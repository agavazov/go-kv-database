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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Build config
const src = path.join(__dirname, './src');
const dest = path.join(__dirname, './dist');
const allowedExt = [];
/**
 * Everything is compiled by tsc no extra help is needed
 * This script is cleaning the dist directory and copy non TS files (rm -rf is not cross-os option)
 */
class Build {
    /**
     * Delete directory recursively
     */
    deleteRecursive(src) {
        if (!fs.existsSync(src)) {
            return;
        }
        fs.readdirSync(src).forEach(file => {
            const curPath = path.join(src, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                this.deleteRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(src);
    }
    /**
     * Copy directory recursively (with extensions filter)
     */
    copyRecursive(src, dest, allowedExt = []) {
        if (!fs.existsSync(src) || allowedExt.length <= 0) {
            return;
        }
        if (fs.lstatSync(src).isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(childName => {
                this.copyRecursive(path.join(src, childName), path.join(dest, childName), allowedExt);
            });
        }
        else {
            if (allowedExt.length > 0) {
                const ext = path.extname(src).substring(1);
                if (allowedExt.indexOf(ext) === -1) {
                    return;
                }
            }
            fs.copyFileSync(src, dest);
        }
    }
}
// Run the builder
const builder = new Build();
builder.deleteRecursive(dest);
builder.copyRecursive(src, dest, allowedExt);
