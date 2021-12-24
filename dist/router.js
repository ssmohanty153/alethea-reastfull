"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const sampleRouter_1 = __importDefault(require("./sampleRouter"));
const router = express_1.default.Router();
router.get('/ping', sampleRouter_1.default.newFolderServerCheck);
module.exports = router;
//# sourceMappingURL=router.js.map