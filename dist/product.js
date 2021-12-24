"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
}
exports.Product = Product;
const date = () => {
    return new Date().toISOString();
};
const info = (name, message, object) => {
    if (object) {
        console.info(`[${date()}] [INFO] [${name}] ${message}`, object);
    }
    else {
        console.info(`[${date()}] [INFO] [${name}] ${message}`);
    }
};
const warn = (name, message, object) => {
    if (object) {
        console.warn(`[${date()}] [WARN] [${name}] ${message}`, object);
    }
    else {
        console.warn(`[${date()}] [WARN] [${name}] ${message}`);
    }
};
const error = (name, message, object) => {
    if (object) {
        console.error(`[${date()}] [ERROR] [${name}] ${message}`, object);
    }
    else {
        console.error(`[${date()}] [ERROR] [${name}] ${message}`);
    }
};
const debug = (name, message, object) => {
    if (object) {
        console.debug(`[${date()}] [DEBUG] [${name}] ${message}`, object);
    }
    else {
        console.debug(`[${date()}] [DEBUG] [${name}] ${message}`);
    }
};
exports.default = {
    info,
    warn,
    error,
    debug
};
//# sourceMappingURL=product.js.map