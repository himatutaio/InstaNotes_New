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
exports.LiveTutor = void 0;
var react_1 = require("react");
var genai_1 = require("@google/genai");
var LiveTutor = function (_a) {
    var noteContext = _a.noteContext, onClose = _a.onClose;
    var _b = (0, react_1.useState)(false), isActive = _b[0], setIsActive = _b[1];
    var _c = (0, react_1.useState)("Klaar om te verbinden..."), status = _c[0], setStatus = _c[1];
    var videoRef = (0, react_1.useRef)(null);
    var canvasRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(false), showVideo = _d[0], setShowVideo = _d[1];
    // Audio Context refs
    var audioContextRef = (0, react_1.useRef)(null);
    var inputSourceRef = (0, react_1.useRef)(null);
    var processorRef = (0, react_1.useRef)(null);
    var streamRef = (0, react_1.useRef)(null);
    var nextStartTimeRef = (0, react_1.useRef)(0);
    // Gemini Session
    var sessionPromiseRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        return function () {
            stopSession();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var startSession = function () { return __awaiter(void 0, void 0, void 0, function () {
        var ai, audioCtx_1, stream_1, outputCtx_1, systemInstruction, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setStatus("Verbinden met AI...");
                    setIsActive(true);
                    ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
                    audioCtx_1 = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                    audioContextRef.current = audioCtx_1;
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream_1 = _a.sent();
                    streamRef.current = stream_1;
                    outputCtx_1 = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
                    systemInstruction = "Je bent een vriendelijke, geduldige privéleraar. Je helpt studenten met hun vragen.";
                    if (noteContext) {
                        systemInstruction += " De student heeft net een tekst gelezen met de titel \"".concat(noteContext.title, "\". \n        Samenvatting punten: ").concat(noteContext.summaryPoints.join(". "), ".\n        Niveau: ").concat(noteContext.educationLevel, ".\n        Gebruik deze context om vragen te beantwoorden.");
                    }
                    sessionPromiseRef.current = ai.live.connect({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        config: {
                            responseModalities: [genai_1.Modality.AUDIO],
                            speechConfig: {
                                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                            },
                            systemInstruction: systemInstruction,
                        },
                        callbacks: {
                            onopen: function () {
                                setStatus("Verbonden! Stel je vraag.");
                                // Setup Input Stream
                                var source = audioCtx_1.createMediaStreamSource(stream_1);
                                inputSourceRef.current = source;
                                var processor = audioCtx_1.createScriptProcessor(4096, 1, 1);
                                processorRef.current = processor;
                                processor.onaudioprocess = function (e) {
                                    var _a;
                                    var inputData = e.inputBuffer.getChannelData(0);
                                    var pcmBlob = createBlob(inputData);
                                    (_a = sessionPromiseRef.current) === null || _a === void 0 ? void 0 : _a.then(function (session) {
                                        session.sendRealtimeInput({ media: pcmBlob });
                                    });
                                };
                                source.connect(processor);
                                processor.connect(audioCtx_1.destination);
                            },
                            onmessage: function (message) { return __awaiter(void 0, void 0, void 0, function () {
                                var base64Audio, outputData, buffer, source, currentTime, startTime, e_2;
                                var _a, _b, _c, _d, _e;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            base64Audio = (_e = (_d = (_c = (_b = (_a = message.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.inlineData) === null || _e === void 0 ? void 0 : _e.data;
                                            if (!base64Audio) return [3 /*break*/, 4];
                                            _f.label = 1;
                                        case 1:
                                            _f.trys.push([1, 3, , 4]);
                                            outputData = decode(base64Audio);
                                            return [4 /*yield*/, decodeAudioData(outputData, outputCtx_1)];
                                        case 2:
                                            buffer = _f.sent();
                                            source = outputCtx_1.createBufferSource();
                                            source.buffer = buffer;
                                            source.connect(outputCtx_1.destination);
                                            currentTime = outputCtx_1.currentTime;
                                            startTime = Math.max(currentTime, nextStartTimeRef.current);
                                            source.start(startTime);
                                            nextStartTimeRef.current = startTime + buffer.duration;
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_2 = _f.sent();
                                            console.error("Audio decode error", e_2);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); },
                            onclose: function () {
                                setStatus("Verbinding gesloten.");
                                setIsActive(false);
                            },
                            onerror: function (e) {
                                console.error(e);
                                setStatus("Er is een fout opgetreden.");
                                setIsActive(false);
                            }
                        }
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error(e_1);
                    setStatus("Kon geen toegang krijgen tot microfoon.");
                    setIsActive(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var stopSession = function () {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(function (track) { return track.stop(); });
        }
        if (processorRef.current && inputSourceRef.current) {
            inputSourceRef.current.disconnect();
            processorRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsActive(false);
        setStatus("Gesprek beëindigd.");
        // Note: session.close() isn't strictly exposed in the simplified interface, relies on cleanup
    };
    // Helper functions
    function createBlob(data) {
        var l = data.length;
        var int16 = new Int16Array(l);
        for (var i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        // Simple base64 encoding for the raw PCM
        var binary = '';
        var bytes = new Uint8Array(int16.buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        var base64 = btoa(binary);
        return {
            data: base64,
            mimeType: 'audio/pcm;rate=16000',
        };
    }
    function decode(base64) {
        var binaryString = atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    function decodeAudioData(data, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var int16, float32, i, buffer;
            return __generator(this, function (_a) {
                int16 = new Int16Array(data.buffer);
                float32 = new Float32Array(int16.length);
                for (i = 0; i < int16.length; i++) {
                    float32[i] = int16[i] / 32768.0;
                }
                buffer = ctx.createBuffer(1, float32.length, 24000);
                buffer.getChannelData(0).set(float32);
                return [2 /*return*/, buffer];
            });
        });
    }
    return (<div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className={"w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ".concat(isActive ? 'bg-primary/20 shadow-[0_0_50px_rgba(79,70,229,0.5)] scale-110' : 'bg-gray-800')}>
          <div className={"w-24 h-24 rounded-full bg-primary flex items-center justify-center transition-transform ".concat(isActive ? 'animate-pulse' : '')}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z"/>
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z"/>
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">AI Privéleraar</h2>
          <p className="text-white/60 mb-6">{status}</p>
          
          {!isActive ? (<button onClick={startSession} className="px-8 py-3 bg-white text-primary rounded-full font-bold text-lg hover:scale-105 transition-transform">
              Start Gesprek
            </button>) : (<button onClick={stopSession} className="px-8 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full font-bold text-lg hover:bg-red-500/30 transition-colors">
              Beëindigen
            </button>)}
        </div>
        
        {noteContext && (<div className="bg-white/10 p-4 rounded-xl text-sm text-white/80 w-full">
             <strong>Context:</strong> {noteContext.title}
           </div>)}
      </div>
    </div>);
};
exports.LiveTutor = LiveTutor;
