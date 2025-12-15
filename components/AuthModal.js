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
exports.AuthModal = void 0;
var react_1 = require("react");
var supabaseService_1 = require("../services/supabaseService");
var AuthModal = function (_a) {
    var onClose = _a.onClose, onSuccess = _a.onSuccess, _b = _a.isForced, isForced = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(true), isLogin = _c[0], setIsLogin = _c[1];
    var _d = (0, react_1.useState)(''), email = _d[0], setEmail = _d[1];
    var _e = (0, react_1.useState)(''), password = _e[0], setPassword = _e[1];
    var _f = (0, react_1.useState)(false), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var _h = (0, react_1.useState)(null), successMsg = _h[0], setSuccessMsg = _h[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setError(null);
                    setSuccessMsg(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!isLogin) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, supabaseService_1.signIn)(email, password)];
                case 2:
                    _a.sent();
                    onSuccess();
                    onClose();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, (0, supabaseService_1.signUp)(email, password)];
                case 4:
                    _a.sent();
                    // Don't close immediately on signup, show confirmation message
                    setSuccessMsg('Registratie gelukt! Controleer je email inbox (en spam) om je account te bevestigen voordat je inlogt.');
                    setIsLogin(true); // Switch to login view
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    console.error(err_1);
                    if (err_1.message && err_1.message.includes("Email not confirmed")) {
                        setError("Je emailadres is nog niet bevestigd. Controleer je inbox.");
                    }
                    else if (err_1.message && err_1.message.includes("Invalid login credentials")) {
                        setError("Ongeldig emailadres of wachtwoord.");
                    }
                    else {
                        setError(err_1.message || 'Er is een fout opgetreden.');
                    }
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl relative">
        {!isForced && (<button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
             </svg>
           </button>)}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isForced ? 'Limiet bereikt' : (isLogin ? 'Welkom terug' : 'Maak een account')}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isForced
            ? 'Je hebt je 3 gratis samenvattingen gebruikt. Log in of registreer om onbeperkt door te gaan.'
            : (isLogin ? 'Log in om je notities te beheren' : 'Registreer voor onbeperkte toegang')}
          </p>
        </div>

        {successMsg && (<div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            {successMsg}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={function (e) { return setEmail(e.target.value); }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" placeholder="naam@voorbeeld.nl"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
            <input type="password" required minLength={6} value={password} onChange={function (e) { return setPassword(e.target.value); }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" placeholder="••••••••"/>
          </div>

          {error && (<div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>)}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? 'Laden...' : (isLogin ? 'Inloggen' : 'Registreren')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? 'Nog geen account?' : 'Heb je al een account?'}
          <button onClick={function () { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }} className="text-primary font-bold ml-1 hover:underline focus:outline-none">
            {isLogin ? 'Registreer hier' : 'Log in'}
          </button>
        </div>
      </div>
    </div>);
};
exports.AuthModal = AuthModal;
