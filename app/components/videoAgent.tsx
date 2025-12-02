
export default function audioAgent() {
    return (
        <div>
            <div className="flex items-start gap-4 justify-center">



                {/* BOX */}
                <div className="flex-1 relative bg-[#111929] border border-cyan-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

                    {/* ACCENT LINE */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 rounded-l-xl"></div>

                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] opacity-40">14:22:05</p>

                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-cyan-300 tracking-wide">VIDEO INTELLIGENCE</h3>
                            <span className="text-[10px] px-2 py-px rounded-full bg-cyan-500/20 text-cyan-400 tracking-wide">Active</span>
                        </div>
                    </div>

                    <p className="text-sm opacity-80 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore sapiente temporibus quia harum doloribus mollitia architecto sunt pariatur nostrum. Tempora beatae asperiores quidem porro, distinctio eos rem? Harum molestias quam voluptatum esse, nemo commodi nisi reiciendis quo ut corrupti laboriosam! Ipsam dolor impedit itaque non nobis perspiciatis magnam.
                    </p>
                </div>
                {/* ICON */}
                {/* <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-cyan-400/40 bg-[rgba(0,255,255,0.1)] 
      shadow-[0_0_8px_2px_rgba(0,255,255,0.4)] backdrop-blur-md">
                    <span className="text-xs tracking-wide text-cyan-300 font-semibold">VIDEO</span>
                </div> */}
            </div>
        </div>
    )
}