"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModal = void 0;
var react_1 = require("react");
var ImageModal = function (_a) {
    var imageSrc = _a.imageSrc, onClose = _a.onClose;
    return (<div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md" onClick={onClose}>
      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-[101]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* Image Container */}
      <div className="w-full h-full flex items-center justify-center overflow-auto" onClick={function (e) { return e.stopPropagation(); }}>
         <img src={imageSrc} alt="Original Source" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"/>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
          Klik buiten de foto om te sluiten
        </span>
      </div>
    </div>);
};
exports.ImageModal = ImageModal;
