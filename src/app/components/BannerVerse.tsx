'use client'

export default function BannerVerse() {
  return (
    <div className="overflow-hidden w-full h-[96px] mt-[20px] flex items-center bg-black">
      <div className="scroll-container">
        <div className="scroll-track">
          <BannerText />
          <BannerText />
          <BannerText />
          <BannerText />
    
          <BannerText />
          <BannerText />
          <BannerText />
          <BannerText />
        </div>
      </div>

      <style jsx>{`
        .scroll-container {
          width: 100%;
          overflow: hidden;
        }

        .scroll-track {
          display: flex;
          gap: 60px;
          animation: scroll 30s linear infinite;
          white-space: nowrap;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

function BannerText() {
  return (
    <div className="flex text-[64px] font-koulen leading-none">
     <b><span className="text-white">WE</span>&nbsp;</b> 
      <span className="text-red-500">LOVE</span>&nbsp;
     <b><span className="text-white">BECAUSE</span>&nbsp;</b> 
     <b> <span className="text-white lowercase">he</span>&nbsp;</b>
     <b><span className="text-white">FIRST LOVED</span>&nbsp;</b> 
      <em className="italic font-[kristi]">1 John 4:19</em>
    </div>
  )
}
