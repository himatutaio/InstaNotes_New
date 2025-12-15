"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.getNotes = exports.updateNote = exports.saveNote = exports.useCredit = exports.addCredit = exports.getCredits = exports.MAX_FREE_USAGE = exports.incrementUsageCount = exports.getUsageCount = void 0;
// NOTE: In a production environment, this would be replaced by Firebase Firestore and Firebase Storage.
// For this standalone demo, we use localStorage to persist data so the app is functional without API keys.
var STORAGE_KEY = 'instanotes_data';
var USAGE_PREFIX = 'instanotes_usage_';
var CREDITS_PREFIX = 'instanotes_credits_';
// --- Usage Limit Logic ---
var getUsageCount = function (userId) {
    if (!userId)
        return 0;
    var count = localStorage.getItem(USAGE_PREFIX + userId);
    return count ? parseInt(count, 10) : 0;
};
exports.getUsageCount = getUsageCount;
var incrementUsageCount = function (userId) {
    if (!userId)
        return 0;
    var current = (0, exports.getUsageCount)(userId);
    var newCount = current + 1;
    localStorage.setItem(USAGE_PREFIX + userId, newCount.toString());
    return newCount;
};
exports.incrementUsageCount = incrementUsageCount;
exports.MAX_FREE_USAGE = 3;
// --- Credit System (One-time payments) ---
var getCredits = function (userId) {
    if (!userId)
        return 0;
    var credits = localStorage.getItem(CREDITS_PREFIX + userId);
    return credits ? parseInt(credits, 10) : 0;
};
exports.getCredits = getCredits;
var addCredit = function (userId, amount) {
    if (amount === void 0) { amount = 1; }
    if (!userId)
        return 0;
    var current = (0, exports.getCredits)(userId);
    var newTotal = current + amount;
    localStorage.setItem(CREDITS_PREFIX + userId, newTotal.toString());
    return newTotal;
};
exports.addCredit = addCredit;
var useCredit = function (userId) {
    if (!userId)
        return false;
    var current = (0, exports.getCredits)(userId);
    if (current > 0) {
        localStorage.setItem(CREDITS_PREFIX + userId, (current - 1).toString());
        return true;
    }
    return false;
};
exports.useCredit = useCredit;
// --- Note Storage Logic ---
var saveNote = function (note) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () {
                    var existingData = localStorage.getItem(STORAGE_KEY);
                    var notes = existingData ? JSON.parse(existingData) : [];
                    notes.unshift(note); // Add to top
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
                    resolve();
                }, 500); // Simulate network latency
            })];
    });
}); };
exports.saveNote = saveNote;
var updateNote = function (updatedNote) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () {
                    var existingData = localStorage.getItem(STORAGE_KEY);
                    if (existingData) {
                        var notes = JSON.parse(existingData);
                        notes = notes.map(function (n) { return n.id === updatedNote.id ? updatedNote : n; });
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
                    }
                    resolve();
                }, 200);
            })];
    });
}); };
exports.updateNote = updateNote;
var getNotes = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () {
                    var existingData = localStorage.getItem(STORAGE_KEY);
                    var notes = existingData ? JSON.parse(existingData) : [];
                    resolve(notes);
                }, 300);
            })];
    });
}); };
exports.getNotes = getNotes;
var deleteNote = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () {
                    var existingData = localStorage.getItem(STORAGE_KEY);
                    var updatedNotes = [];
                    if (existingData) {
                        var notes = JSON.parse(existingData);
                        updatedNotes = notes.filter(function (n) { return n.id !== id; });
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
                    }
                    else {
                        updatedNotes = [];
                    }
                    resolve(updatedNotes);
                }, 300);
            })];
    });
}); };
exports.deleteNote = deleteNote;
