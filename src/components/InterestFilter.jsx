import { useState, useEffect } from "react"

const ALL_INTERESTS = [
  { id: "mern", label: "MERN Stack", icon: "⚛️" },
  { id: "frontend", label: "Frontend", icon: "🎨" },
  { id: "backend", label: "Backend", icon: "⚙️" },
  { id: "fullstack", label: "Full Stack", icon: "🚀" },
  { id: "ai/ml", label: "AI / ML", icon: "🤖" },
  { id: "ai", label: "AI", icon: "🧠" },
  { id: "vibe-coding", label: "Vibe Coding", icon: "✨" },
  { id: "devops", label: "DevOps", icon: "☁️" },
  { id: "blockchain", label: "Blockchain", icon: "⛓️" },
  { id: "mobile", label: "Mobile Dev", icon: "📱" },
  { id: "data", label: "Data Science", icon: "📊" },
  { id: "ui/ux", label: "UI/UX", icon: "🎭" },
  { id: "others", label: "OTHERS", icon: " " },
];

const InterestFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("devTinder_interests");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("devTinder_interests", JSON.stringify(selected));
    onFilterChange?.(selected);
  }, [selected]);

  const toggleInterest = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearAll = () => setSelected([]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-sm btn-outline rounded-full gap-2">
        <span>🎯</span> 
        {selected.length > 0 ? `Interests • ${selected.length}` : "Find my tribe"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-base-100 rounded-[24px] w-full max-w-[480px] mx-4 p-6 shadow-2xl border border-base-300 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-[20px] font-semibold tracking-tight">What kind of devs are you looking for?</h3>
                <p className="text-sm text-base-content/60 mt-1">We'll prioritize matching profiles in your feed</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-circle btn-sm">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5 overflow-y-auto pr-1 flex-1">
              {ALL_INTERESTS.map(item => {
                const active = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all
                      ${active ? "bg-neutral text-neutral-content border-neutral" : "bg-base-200 border-base-300 hover:bg-base-300 text-base-content"}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {active && <span className="ml-auto text-xs">✓</span>}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={clearAll} className="btn btn-ghost rounded-full flex-1">Clear</button>
              <button onClick={() => setIsOpen(false)} className="btn btn-neutral rounded-full flex-1">
                {selected.length > 0 ? `Show ${selected.length} tribes →` : "Show all devs"}
              </button>
            </div>

            <p className="text-[11px] text-base-content/40 text-center mt-3">
              Matching devs appear first. If none, we show other devs too.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default InterestFilter
