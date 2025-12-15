"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flashcard = void 0;
var react_1 = require("react");
var Flashcard = function (_a) {
    var word = _a.word, definition = _a.definition, _b = _a.needsPractice, needsPractice = _b === void 0 ? false : _b, onTogglePractice = _a.onTogglePractice;
    var _c = (0, react_1.useState)(false), isFlipped = _c[0], setIsFlipped = _c[1];
    var handleToggle = function (e) {
        e.stopPropagation(); // Prevent card flip
        if (onTogglePractice) {
            onTogglePractice();
        }
    };
    return (<div className="h-64 w-full cursor-pointer group" onClick={function () { return setIsFlipped(!isFlipped); }} style={{ perspective: '1000px' }}>
      <div className="relative h-full w-full transition-transform duration-500" style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
        {/* Front (Word) */}
        <div className={"absolute inset-0 h-full w-full bg-white rounded-xl shadow-sm border ".concat(needsPractice ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200', " flex flex-col items-center justify-center p-4 text-center transition-all")} style={{ backfaceVisibility: 'hidden' }}>
          {/* Star Button */}
          <button onClick={handleToggle} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-10" title={needsPractice ? "Verwijder uit oefenlijst" : "Markeer voor oefenen"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={needsPractice ? "#FBBF24" : "none"} stroke={needsPractice ? "#FBBF24" : "#D1D5DB"} strokeWidth={2} className="w-6 h-6 transition-all duration-300 transform active:scale-125">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.349 1.139l-4.25 3.663a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.25-3.663c-.42-.37-.196-1.095.349-1.139l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
            </svg>
          </button>

          <div className="text-4xl mb-4 opacity-80">🤔</div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-3">{word}</h3>
          <p className="text-xs text-gray-400 mt-auto pt-4 uppercase tracking-wider font-semibold">Klik om te draaien</p>
        </div>

        {/* Back (Definition) */}
        <div className="absolute inset-0 h-full w-full bg-primary rounded-xl shadow-sm border border-primary flex flex-col items-center p-4 text-white" style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
        }}>
           {/* Star Button (Back) */}
           <button onClick={handleToggle} className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition-colors z-10">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={needsPractice ? "#FBBF24" : "none"} stroke={needsPractice ? "#FBBF24" : "rgba(255,255,255,0.6)"} strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.349 1.139l-4.25 3.663a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.25-3.663c-.42-.37-.196-1.095.349-1.139l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
            </svg>
          </button>

          <div className="text-2xl mb-2 opacity-80 flex-shrink-0">💡</div>
          <div className="flex-1 w-full overflow-y-auto no-scrollbar flex items-center justify-center">
            <p className="text-center font-medium leading-relaxed text-sm">
              {definition}
            </p>
          </div>
        </div>
      </div>
    </div>);
};
exports.Flashcard = Flashcard;
