export default function textAgent() {
    return (
        <div>
            <div className="flex items-start gap-4 justify-center">



                {/* BOX */}
                <div className="flex-1 relative bg-[#111929] border border-pink-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

                    {/* ACCENT LINE */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-pink-400 rounded-l-xl"></div>

                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] opacity-40">14:22:05</p>

                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-pink-300 tracking-wide">TEXT INTELLIGENCE</h3>
                            <span className="text-[10px] px-2 py-px rounded-full bg-pink-500/20 text-pink-400 tracking-wide">Active</span>
                        </div>
                    </div>

                    <p className="text-sm opacity-80 leading-relaxed">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis quisquam doloribus ea necessitatibus laudantium debitis, facere et eveniet mollitia! Animi exercitationem distinctio quos ut ipsam soluta nihil, sunt voluptatum at illo atque quia reiciendis eos rem magni voluptate ipsa in corrupti sequi inventore assumenda vero tenetur amet natus?
                    </p>
                </div>
                {/* ICON */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-pink-400/40 bg-[rgba(255,0,123,0.1)] 
      shadow-[0_0_8px_2px_rgba(255,0,150,0.4)] backdrop-blur-md">
                    <span className="text-xs tracking-wide text-pink-300 font-semibold">TEXT</span>
                </div>
            </div>

        </div>
    )
}