"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = require("react");
var types_1 = require("./types");
var storageService_1 = require("./services/storageService");
var geminiService_1 = require("./services/geminiService");
var supabaseService_1 = require("./services/supabaseService");
var LiveTutor_1 = require("./components/LiveTutor");
var Flashcard_1 = require("./components/Flashcard");
var AuthModal_1 = require("./components/AuthModal");
var ImageModal_1 = require("./components/ImageModal");
var UpgradeModal_1 = require("./components/UpgradeModal");
function App() {
    var _this = this;
    var _a = (0, react_1.useState)([]), notes = _a[0], setNotes = _a[1];
    var _b = (0, react_1.useState)('home'), view = _b[0], setView = _b[1];
    var _c = (0, react_1.useState)(null), selectedNote = _c[0], setSelectedNote = _c[1];
    var _d = (0, react_1.useState)({ status: 'idle' }), processing = _d[0], setProcessing = _d[1];
    var _e = (0, react_1.useState)(null), uploadImage = _e[0], setUploadImage = _e[1];
    var _f = (0, react_1.useState)(types_1.EducationLevel.VMBO_GT_TL), selectedLevel = _f[0], setSelectedLevel = _f[1];
    var _g = (0, react_1.useState)(false), showTutor = _g[0], setShowTutor = _g[1];
    var _h = (0, react_1.useState)(""), searchQuery = _h[0], setSearchQuery = _h[1];
    // Auth & Usage State
    var _j = (0, react_1.useState)(null), session = _j[0], setSession = _j[1];
    var _k = (0, react_1.useState)(0), usageCount = _k[0], setUsageCount = _k[1];
    var _l = (0, react_1.useState)(0), credits = _l[0], setCredits = _l[1];
    var _m = (0, react_1.useState)(false), showAuthModal = _m[0], setShowAuthModal = _m[1];
    var _o = (0, react_1.useState)(false), showUpgradeModal = _o[0], setShowUpgradeModal = _o[1];
    var _p = (0, react_1.useState)(false), isPro = _p[0], setIsPro = _p[1];
    // Flashcard state
    var _q = (0, react_1.useState)(false), showOnlyPractice = _q[0], setShowOnlyPractice = _q[1];
    var _r = (0, react_1.useState)(false), showAddCardModal = _r[0], setShowAddCardModal = _r[1];
    var _s = (0, react_1.useState)(""), newCardWord = _s[0], setNewCardWord = _s[1];
    var _t = (0, react_1.useState)(""), newCardDef = _t[0], setNewCardDef = _t[1];
    // Image Modal State
    var _u = (0, react_1.useState)(false), showImageModal = _u[0], setShowImageModal = _u[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var fileUploadRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        loadNotes();
        // Check for Payment Success return
        var params = new URLSearchParams(window.location.search);
        var success = params.get('success') === 'true';
        var paymentType = params.get('payment_type');
        // Simple check to prevent endless credit adding loop on refresh
        // In a real app, this should be handled by webhooks or a consumed token
        if (success) {
            supabaseService_1.supabase.auth.getSession().then(function (_a) {
                var session = _a.data.session;
                if (session) {
                    if (paymentType === 'sub') {
                        setIsPro(true);
                        alert("Bedankt! Je PRO abonnement is geactiveerd.");
                    }
                    else if (paymentType === 'onetime') {
                        // We verify visually via alert, logic handles state update
                        // Add credit in storage (demo implementation)
                        // We need to be careful not to add it multiple times on refresh in a real implementation
                        // For this demo, we assume the user just arrived here.
                        var newCredits = (0, storageService_1.addCredit)(session.user.id, 1);
                        setCredits(newCredits);
                        alert("Betaling geslaagd! Je hebt 1 credit toegevoegd.");
                    }
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            });
        }
        // Auth Check
        supabaseService_1.supabase.auth.getSession().then(function (_a) {
            var session = _a.data.session;
            setSession(session);
            if (session) {
                refreshUserData(session.user.id);
            }
        });
        var subscription = supabaseService_1.supabase.auth.onAuthStateChange(function (_event, session) {
            setSession(session);
            if (session) {
                refreshUserData(session.user.id);
            }
            else {
                setUsageCount(0);
                setCredits(0);
                setIsPro(false);
            }
        }).data.subscription;
        return function () { return subscription.unsubscribe(); };
    }, []);
    var refreshUserData = function (userId) {
        setUsageCount((0, storageService_1.getUsageCount)(userId));
        setCredits((0, storageService_1.getCredits)(userId));
        checkProStatus(userId);
    };
    var checkProStatus = function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 1. Check local override from payment redirect
                    if (isPro)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('subscriptions')
                            .select('status')
                            .eq('user_id', userId)
                            .in('status', ['active', 'trialing'])
                            .single()];
                case 1:
                    data = (_a.sent()).data;
                    if (data) {
                        setIsPro(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var loadNotes = function () { return __awaiter(_this, void 0, void 0, function () {
        var loaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, storageService_1.getNotes)()];
                case 1:
                    loaded = _a.sent();
                    setNotes(loaded);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supabaseService_1.signOut)()];
                case 1:
                    _a.sent();
                    setSession(null);
                    setView('home');
                    setIsPro(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Rule: Must be logged in to START using the app.
    // Rule: Logic: Pro > Credit > Free Limit
    var checkAccess = function () {
        if (!session) {
            setShowAuthModal(true);
            return false;
        }
        // 1. PRO is always allowed
        if (isPro)
            return true;
        // 2. Have Credits? Allowed.
        if (credits > 0)
            return true;
        // 3. Within Free Limit? Allowed.
        if (usageCount < storageService_1.MAX_FREE_USAGE)
            return true;
        // 4. Blocked
        setShowUpgradeModal(true);
        return false;
    };
    var consumeAccess = function (userId) {
        if (isPro)
            return; // Free for pro
        if (credits > 0) {
            // Use credit first
            (0, storageService_1.useCredit)(userId);
            setCredits((0, storageService_1.getCredits)(userId));
        }
        else {
            // Use free usage
            (0, storageService_1.incrementUsageCount)(userId);
            setUsageCount((0, storageService_1.getUsageCount)(userId));
        }
    };
    var handleFileChange = function (event) {
        var _a;
        if (!checkAccess()) {
            event.target.value = '';
            return;
        }
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader_1 = new FileReader();
            reader_1.onloadend = function () {
                setUploadImage(reader_1.result);
                setView('create');
            };
            reader_1.readAsDataURL(file);
        }
        event.target.value = '';
    };
    var handleAnalyze = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, newNote, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!uploadImage)
                        return [2 /*return*/];
                    if (!session)
                        return [2 /*return*/];
                    // Final check
                    if (!checkAccess())
                        return [2 /*return*/];
                    setProcessing({ status: 'analyzing', message: 'Beeld analyseren en samenvatten...' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, geminiService_1.generateNoteFromImage)(uploadImage, selectedLevel)];
                case 2:
                    result = _a.sent();
                    newNote = __assign({ id: Date.now().toString(), timestamp: Date.now() }, result);
                    return [4 /*yield*/, (0, storageService_1.saveNote)(newNote)];
                case 3:
                    _a.sent();
                    setNotes(__spreadArray([newNote], notes, true));
                    setSelectedNote(newNote);
                    setView('detail');
                    setProcessing({ status: 'idle' });
                    setUploadImage(null);
                    // Consume Usage/Credit
                    consumeAccess(session.user.id);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setProcessing({ status: 'error', message: error_1.message || 'Er ging iets mis bij het genereren.' });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRegenerateLevel = function (newLevel) { return __awaiter(_this, void 0, void 0, function () {
        var costMsg, result, updatedNote_1, updatedNotesList, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedNote || !selectedNote.originalImageBase64)
                        return [2 /*return*/];
                    if (!session)
                        return [2 /*return*/];
                    if (!checkAccess())
                        return [2 /*return*/];
                    costMsg = '';
                    if (!isPro) {
                        if (credits > 0)
                            costMsg = 'Dit kost 1 credit.';
                        else
                            costMsg = "Je hebt ".concat(storageService_1.MAX_FREE_USAGE - usageCount, " gratis pogingen over.");
                    }
                    if (!confirm("Wil je de samenvatting opnieuw genereren voor niveau ".concat(newLevel, "? ").concat(costMsg))) {
                        return [2 /*return*/];
                    }
                    setProcessing({ status: 'analyzing', message: "Opnieuw genereren voor ".concat(newLevel, "...") });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, geminiService_1.generateNoteFromImage)(selectedNote.originalImageBase64, newLevel)];
                case 2:
                    result = _a.sent();
                    updatedNote_1 = __assign(__assign(__assign({}, selectedNote), result), { educationLevel: newLevel });
                    return [4 /*yield*/, (0, storageService_1.updateNote)(updatedNote_1)];
                case 3:
                    _a.sent();
                    updatedNotesList = notes.map(function (n) { return n.id === updatedNote_1.id ? updatedNote_1 : n; });
                    setNotes(updatedNotesList);
                    setSelectedNote(updatedNote_1);
                    // Consume Usage/Credit
                    consumeAccess(session.user.id);
                    setProcessing({ status: 'idle' });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setProcessing({ status: 'error', message: error_2.message || 'Fout bij opnieuw genereren.' });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (e, id) { return __awaiter(_this, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation();
                    if (!confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, storageService_1.deleteNote)(id)];
                case 1:
                    updated = _a.sent();
                    setNotes(updated);
                    if ((selectedNote === null || selectedNote === void 0 ? void 0 : selectedNote.id) === id) {
                        setView('home');
                        setSelectedNote(null);
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleShare = function (e, note) { return __awaiter(_this, void 0, void 0, function () {
        var shareText, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation();
                    shareText = "\uD83D\uDCDA Samenvatting: ".concat(note.title, "\n\uD83C\uDF93 Niveau: ").concat(note.educationLevel, "\n\nKernpunten:\n").concat(note.summaryPoints.map(function (p) { return "\u2022 ".concat(p); }).join('\n'), "\n\nGemaakt met InstaNotes.");
                    if (!navigator.share) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.share({
                            title: note.title,
                            text: shareText,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.log('Error sharing:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    navigator.clipboard.writeText(shareText);
                    alert('Samenvatting gekopieerd naar klembord!');
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var togglePracticeWord = function (wordIndex) { return __awaiter(_this, void 0, void 0, function () {
        var updatedNote, word, updatedNotesList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedNote)
                        return [2 /*return*/];
                    updatedNote = __assign(__assign({}, selectedNote), { difficultWords: __spreadArray([], selectedNote.difficultWords, true) });
                    word = __assign({}, updatedNote.difficultWords[wordIndex]);
                    word.needsPractice = !word.needsPractice;
                    updatedNote.difficultWords[wordIndex] = word;
                    setSelectedNote(updatedNote);
                    updatedNotesList = notes.map(function (n) { return n.id === updatedNote.id ? updatedNote : n; });
                    setNotes(updatedNotesList);
                    return [4 /*yield*/, (0, storageService_1.updateNote)(updatedNote)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleAddFlashcard = function () { return __awaiter(_this, void 0, void 0, function () {
        var newWord, updatedNote, updatedNotesList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedNote || !newCardWord.trim() || !newCardDef.trim())
                        return [2 /*return*/];
                    newWord = {
                        word: newCardWord.trim(),
                        definition: newCardDef.trim(),
                        needsPractice: false
                    };
                    updatedNote = __assign(__assign({}, selectedNote), { difficultWords: __spreadArray(__spreadArray([], selectedNote.difficultWords, true), [newWord], false) });
                    setSelectedNote(updatedNote);
                    updatedNotesList = notes.map(function (n) { return n.id === updatedNote.id ? updatedNote : n; });
                    setNotes(updatedNotesList);
                    return [4 /*yield*/, (0, storageService_1.updateNote)(updatedNote)];
                case 1:
                    _a.sent();
                    setNewCardWord("");
                    setNewCardDef("");
                    setShowAddCardModal(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var filteredNotes = notes.filter(function (note) {
        var query = searchQuery.toLowerCase();
        return (note.title.toLowerCase().includes(query) ||
            note.educationLevel.toLowerCase().includes(query) ||
            note.summaryPoints.some(function (point) { return point.toLowerCase().includes(query); }) ||
            note.difficultWords.some(function (dw) { return dw.word.toLowerCase().includes(query); }));
    });
    var filteredFlashcards = selectedNote === null || selectedNote === void 0 ? void 0 : selectedNote.difficultWords.filter(function (word) {
        if (showOnlyPractice)
            return word.needsPractice;
        return true;
    });
    return (<div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md z-10">
        <div className="flex items-center justify-between relative h-8">
          <div className="w-10 flex justify-start">
            {view !== 'home' && (<button onClick={function () { return setView('home'); }} className="text-white/80 hover:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                 </svg>
               </button>)}
            {view === 'home' && session && (<button onClick={handleLogout} className="text-xs text-white/70 hover:text-white border border-white/30 rounded px-2 py-1">
                 Log uit
               </button>)}
          </div>
          
          <h1 className="text-xl font-bold tracking-wide absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            InstaNotes {isPro && <span className="text-xs bg-yellow-400 text-black px-1.5 py-0.5 rounded-full ml-1 align-top">PRO</span>}
          </h1>

          <div className="w-10 flex justify-end">
            {view !== 'home' ? (<button onClick={function () {
                setView('home');
                setSelectedNote(null);
                setUploadImage(null);
            }} className="text-white/80 hover:text-white" title="Naar beginscherm">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                  </svg>
               </button>) : (!session && (<button onClick={function () { setShowAuthModal(true); }} className="text-xs font-bold bg-white text-primary px-2 py-1.5 rounded hover:bg-gray-100 transition-colors">
                  Log in
                </button>))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        
        {/* VIEW: HOME */}
        {view === 'home' && (<div className="p-4 space-y-6">
             {/* Usage Banner */}
             {session && (<div className={"text-center py-2 px-4 rounded-lg text-sm font-medium ".concat(isPro ? 'bg-yellow-50 text-yellow-700' : (usageCount >= storageService_1.MAX_FREE_USAGE && credits === 0 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'))}>
                  {isPro
                    ? "✨ Je hebt onbeperkte PRO toegang."
                    : (credits > 0
                        ? "\uD83D\uDC8E Je hebt ".concat(credits, " extra credit").concat(credits > 1 ? 's' : '', " over.")
                        : (usageCount >= storageService_1.MAX_FREE_USAGE
                            ? "Gratis tegoed op. Upgrade om door te gaan."
                            : "Je hebt nog ".concat(storageService_1.MAX_FREE_USAGE - usageCount, " gratis samenvattingen.")))}
               </div>)}

             {/* Hero / CTA */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Nieuwe Notitie</h2>
                <p className="text-sm text-gray-500 mb-4">Maak een foto van je boek of upload een bestand</p>
                
                <div className="flex gap-3">
                  <button onClick={function () {
                var _a;
                if (checkAccess())
                    (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} className="flex-1 bg-primary text-white py-3 px-2 rounded-xl font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform text-sm">
                    Start Camera
                  </button>
                  <button onClick={function () {
                var _a;
                if (checkAccess())
                    (_a = fileUploadRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} className="flex-1 bg-white border-2 border-primary/10 text-primary py-3 px-2 rounded-xl font-semibold shadow-sm hover:bg-gray-50 active:scale-95 transition-transform text-sm">
                    Upload Foto
                  </button>
                </div>
                
                <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange}/>
                <input type="file" ref={fileUploadRef} accept="image/*" className="hidden" onChange={handleFileChange}/>
             </div>

             {/* Search Bar */}
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input type="text" placeholder="Zoek notities..." className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm shadow-sm transition-shadow" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
             </div>

             {/* Recent List */}
             <div>
               <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">Mijn Samenvattingen</h3>
               {filteredNotes.length === 0 ? (<div className="text-center py-10 text-gray-400">
                   {notes.length > 0 ? <p>Geen resultaten gevonden voor "{searchQuery}"</p> : <p>Nog geen notities.</p>}
                 </div>) : (<div className="space-y-3">
                   {filteredNotes.map(function (note) { return (<div key={note.id} onClick={function () { setSelectedNote(note); setView('detail'); }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {note.originalImageBase64 ? (<img src={note.originalImageBase64} alt="" className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">📝</div>)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">{note.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                             <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{note.educationLevel}</span>
                             <span>• {new Date(note.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <button onClick={function (e) { return handleShare(e, note); }} className="p-2 text-gray-300 hover:text-primary transition-colors" title="Delen">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
                              </svg>
                          </button>
                          <button onClick={function (e) { return handleDelete(e, note.id); }} className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Verwijderen">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                            </svg>
                          </button>
                        </div>
                     </div>); })}
                 </div>)}
             </div>
          </div>)}

        {/* VIEW: CREATE */}
        {view === 'create' && uploadImage && (<div className="p-4 flex flex-col h-full">
            <div className="flex-1 bg-black rounded-xl overflow-hidden mb-4 relative shadow-inner">
               <img src={uploadImage} alt="Preview" className="w-full h-full object-contain"/>
               <button onClick={function () { return setView('home'); }} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
               </button>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kies je onderwijsniveau</label>
              <select value={selectedLevel} onChange={function (e) { return setSelectedLevel(e.target.value); }} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50">
                {Object.values(types_1.EducationLevel).map(function (level) { return (<option key={level} value={level}>{level}</option>); })}
              </select>
            </div>

            <button onClick={handleAnalyze} disabled={processing.status !== 'idle' && processing.status !== 'error'} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {processing.status === 'analyzing' ? (<>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyseren...
                </>) : (<>
                  ✨ Genereer Samenvatting
                </>)}
            </button>
          </div>)}

        {/* VIEW: DETAIL */}
        {view === 'detail' && selectedNote && (<div className="p-4 pb-24 space-y-6 relative">
             {/* Loading Overlay */}
             {processing.status === 'analyzing' && (<div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-primary font-bold">{processing.message || "Aanpassen..."}</p>
               </div>)}

            {/* Image Banner */}
            {selectedNote.originalImageBase64 && (<div className="w-full h-32 bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm border border-gray-100" onClick={function () { return setShowImageModal(true); }}>
                <img src={selectedNote.originalImageBase64} alt="Original" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                   <div className="bg-white/90 p-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>
                      </svg>
                   </div>
                </div>
              </div>)}

            <div className="space-y-2">
               <div className="flex items-center gap-2">
                 <div className="relative inline-block group">
                    <select value={selectedNote.educationLevel} onChange={function (e) { return handleRegenerateLevel(e.target.value); }} disabled={processing.status === 'analyzing'} className="appearance-none pl-3 pr-8 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide border-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-primary/20 transition-colors disabled:opacity-50">
                      {Object.values(types_1.EducationLevel).map(function (level) { return (<option key={level} value={level}>{level}</option>); })}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                      </svg>
                    </div>
                 </div>
                 <span className="text-gray-400 text-xs text-xs">← Klik om niveau te wijzigen</span>
               </div>
               
               <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedNote.title}</h2>
               <p className="text-gray-400 text-xs">Gegenereerd op {new Date(selectedNote.timestamp).toLocaleDateString()}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                 <span className="text-xl">📋</span> Kernpunten
               </h3>
               <ul className="space-y-3">
                 {selectedNote.summaryPoints.map(function (point, i) { return (<li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                     <span className="text-primary font-bold">•</span>
                     <span>{point}</span>
                   </li>); })}
               </ul>
            </div>

            {selectedNote.difficultWords.length > 0 && (<>
                {/* List View */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                    <span className="text-xl">🧠</span> Moeilijke Woorden
                  </h3>
                  <div className="grid gap-3">
                    {selectedNote.difficultWords.map(function (item, i) { return (<div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-bold text-gray-900 mb-1">{item.word}</div>
                        <div className="text-sm text-gray-600 italic">{item.definition}</div>
                      </div>); })}
                  </div>
                </div>

                {/* Flashcards View */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800">
                          <span className="text-xl">🧩</span> Flitskaarten
                        </h3>
                        <button onClick={function () { return setShowAddCardModal(true); }} className="bg-primary/10 text-primary p-1.5 rounded-full hover:bg-primary/20 transition-colors" title="Voeg kaart toe">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                          </svg>
                        </button>
                     </div>
                     
                     <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                       <div className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" checked={showOnlyPractice} onChange={function () { return setShowOnlyPractice(!showOnlyPractice); }}/>
                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                       </div>
                       Alleen oefenen
                     </label>
                   </div>

                   {filteredFlashcards && filteredFlashcards.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {filteredFlashcards.map(function (item, i) {
                        var originalIndex = selectedNote.difficultWords.findIndex(function (w) { return w.word === item.word; });
                        return (<Flashcard_1.Flashcard key={i} word={item.word} definition={item.definition} needsPractice={item.needsPractice} onTogglePractice={function () { return togglePracticeWord(originalIndex); }}/>);
                    })}
                     </div>) : (<div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                       <div className="text-4xl mb-2">🎉</div>
                       <p className="text-gray-500">
                         {showOnlyPractice
                        ? "Geen woorden gemarkeerd om te oefenen!"
                        : "Geen flitskaarten beschikbaar."}
                       </p>
                     </div>)}
                </div>
              </>)}
            
            {/* FAB for Live Tutor */}
            <div className="fixed bottom-6 right-6 z-20">
               <button onClick={function () { return setShowTutor(true); }} className="bg-secondary text-white p-4 rounded-full shadow-lg shadow-secondary/40 hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-6">
                 <span className="text-2xl">🎓</span>
                 <span>Vraag Docent</span>
               </button>
            </div>
          </div>)}
      </main>
      
      {/* Live Tutor Overlay */}
      {showTutor && selectedNote && (<LiveTutor_1.LiveTutor noteContext={selectedNote} onClose={function () { return setShowTutor(false); }}/>)}

      {/* Auth Modal */}
      {showAuthModal && (<AuthModal_1.AuthModal onClose={function () { return setShowAuthModal(false); }} onSuccess={function () { setShowAuthModal(false); }}/>)}
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (<UpgradeModal_1.UpgradeModal usageCount={usageCount} onClose={function () { return setShowUpgradeModal(false); }}/>)}
      
      {/* Image Modal */}
      {showImageModal && (selectedNote === null || selectedNote === void 0 ? void 0 : selectedNote.originalImageBase64) && (<ImageModal_1.ImageModal imageSrc={selectedNote.originalImageBase64} onClose={function () { return setShowImageModal(false); }}/>)}

      {/* Add Flashcard Modal */}
      {showAddCardModal && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform transition-all scale-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nieuwe Flitskaart</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Woord / Begrip</label>
                <input type="text" value={newCardWord} onChange={function (e) { return setNewCardWord(e.target.value); }} placeholder="bv. Fotosynthese" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Betekenis</label>
                <textarea value={newCardDef} onChange={function (e) { return setNewCardDef(e.target.value); }} placeholder="De betekenis..." rows={3} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none resize-none"/>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={function () { return setShowAddCardModal(false); }} className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
                  Annuleren
                </button>
                <button onClick={handleAddFlashcard} disabled={!newCardWord.trim() || !newCardDef.trim()} className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Toevoegen
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
