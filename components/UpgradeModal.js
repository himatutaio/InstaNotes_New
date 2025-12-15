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
exports.UpgradeModal = void 0;
var react_1 = require("react");
var stripeService_1 = require("../services/stripeService");
var UpgradeModal = function (_a) {
    var onClose = _a.onClose, usageCount = _a.usageCount;
    var _b = (0, react_1.useState)(null), loading = _b[0], setLoading = _b[1];
    var handleUpgrade = function (type) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(type === 'subscription' ? 'sub' : 'one');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, stripeService_1.createCheckoutSession)(type)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    alert("Er ging iets mis bij het laden van de betaalpagina.");
                    setLoading(null);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

        <div className="text-center mb-6 mt-2">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Gratis limiet bereikt
          </h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Je hebt {usageCount} gratis samenvattingen gemaakt. Kies hoe je verder wilt gaan.
          </p>
        </div>

        {/* Subscription Option */}
        <div className="mb-4">
          <button onClick={function () { return handleUpgrade('subscription'); }} disabled={loading !== null} className="w-full bg-gradient-to-r from-primary to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex flex-col items-center justify-center gap-1 group">
            {loading === 'sub' ? (<span>Laden...</span>) : (<>
                <div className="flex items-center gap-2">
                   <span>InstaNotes PRO</span>
                   <span className="bg-yellow-400 text-black text-[10px] px-1.5 rounded font-bold uppercase">Beste Keus</span>
                </div>
                <span className="text-white/90 text-sm font-medium">Onbeperkt toegang voor €4,99/mnd</span>
              </>)}
          </button>
          <div className="mt-2 space-y-1 px-2">
             <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Onbeperkt scannen & AI Leraar
             </div>
          </div>
        </div>

        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Of</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* One-time Option */}
        <div className="mb-6">
           <button onClick={function () { return handleUpgrade('payment'); }} disabled={loading !== null} className="w-full bg-white border-2 border-primary/10 text-primary py-3 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
             {loading === 'one' ? (<span>Laden...</span>) : (<>
                 <span>Eenmalig gebruik</span>
                 <span className="bg-primary/10 px-2 py-0.5 rounded text-xs">€0,25</span>
               </>)}
          </button>
        </div>

        {onClose && (<button onClick={onClose} className="w-full text-gray-400 text-sm hover:text-gray-600 underline decoration-gray-300 underline-offset-2">
             Nee bedankt, ik stop nu
           </button>)}
      </div>
    </div>);
};
exports.UpgradeModal = UpgradeModal;
