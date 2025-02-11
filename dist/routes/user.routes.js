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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const ex = __importStar(require("express"));
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../Controller/user.controller");
const router = ex.Router();
const app = (0, express_1.default)();
router.get("/check-auth", isAuthenticated_1.isAutheticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.checkAuth)(req, res); }));
app.get("/", (req, res) => { res.send("User Route"); });
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.signup)(req, res); }));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.login)(req, res); }));
router.post("/isUserRegistered", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.isUserRegistered)(req, res); }));
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.logout)(req, res); }));
router.post("/verfication-email-token-reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.resetEmailVerificationToken)(req, res); }));
router.post("/verify-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.VerifyEmail)(req, res); }));
router.post("/forget-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.forgotPassword)(req, res); }));
router.post("/reset-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.resetPassword)(req, res); }));
router.put("/profile/update", isAuthenticated_1.isAutheticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.updateProfile)(req, res); }));
router.post("/getUserProfile", isAuthenticated_1.isAutheticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield (0, user_controller_1.getUserProfile)(req, res); }));
exports.default = router;
