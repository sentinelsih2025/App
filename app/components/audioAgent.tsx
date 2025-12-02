
export default function audioAgent() {
    return (
        <div>
             {/* AUDIO AGENT */}
          <div className="flex items-start gap-4 justify-center">

            {/* ICON */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-purple-400/40 bg-[rgba(179,0,255,0.1)] 
      shadow-[0_0_8px_2px_rgba(200,0,255,0.4)] backdrop-blur-md">
              <span className="text-xs tracking-wide text-purple-300 font-semibold">AUDIO</span>
            </div>

            {/* BOX */}
            <div className="flex-1 relative bg-[#111929] border border-purple-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

              {/* ACCENT LINE */}
              <div className="absolute left-0 top-0 h-full w-1 bg-purple-400 rounded-l-xl"></div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] opacity-40">14:22:05</p>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-purple-300 tracking-wide">AUDIO INTELLIGENCE</h3>
                  <span className="text-[10px] px-2 py-px rounded-full bg-purple-500/20 text-purple-400 tracking-wide">Active</span>
                </div>
              </div>

              <p className="text-sm opacity-80 leading-relaxed">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla, deleniti! Deleniti, tempore at culpa optio facilis enim assumenda eaque explicabo possimus sed cupiditate reprehenderit mollitia maiores nihil pariatur ipsam obcaecati aperiam. Cum, accusamus numquam id et commodi, laudantium quae ad enim harum sapiente obcaecati! Vitae expedita aspernatur cupiditate.
              </p>
            </div>
          </div>
        </div>
    )
}