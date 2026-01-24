import { FaLaptopCode, FaMapMarkerAlt, FaInstagram, FaWhatsapp, FaFacebookF, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#74070b] text-white rounded-t-3xl font-[Almarai] font-bold">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 text-sm">

        {/* معلومات الموقع */}
        <div className="space-y-3 text-center md:text-right">
          <div className="flex items-center gap-2 justify-center md:justify-end text-md md:text-lg font-[Cairo] text-[#F7F3E8]">
            <FaMapMarkerAlt className="text-[#F7F3E8]" />
            غزة
          </div>

          <div className="flex flex-col gap-1 items-center md:items-end">
            <a href="tel:+970597230040" className="flex items-center gap-2 font-[Cairo] text-md md:text-lg text-[#F7F3E8]">
              <FaPhoneAlt className="text-[#F7F3E8]" />059XXXXXX
            </a>
            <a href="tel:+970567230041" className="flex items-center gap-2 font-[Cairo] text-md md:text-lg text-[#F7F3E8]">
              <FaPhoneAlt className="text-[#F7F3E8]" />056XXXXXX
            </a>
          </div>
        </div>

        {/* أيقونات التواصل */}
        <div className="flex gap-4 justify-center md:justify-start">
          {[
            { href: "https://wa.me/+97059XXXXXX", icon: <FaWhatsapp /> },
            { href: "https://www.instagram.com/", icon: <FaInstagram /> },
            { href: "https://www.facebook.com/", icon: <FaFacebookF /> },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-0.5 rounded-full bg-[#F7F3E8] transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#940D11] text-[#F7F3E8] text-base md:text-lg transition-all duration-300 group-hover:bg-[#940D11]/80 group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                {item.icon}
              </span>
            </a>
          ))}
        </div>

        {/* توقيع المطور */}
        <div className="flex items-center gap-2 opacity-80 justify-center md:justify-end">
          <a href="https://engmohammedaljojo.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <FaLaptopCode className="text-[#F7F3E8] text-xl md:text-2xl" />
            <span className="font-[Almarai] font-bold tracking-wide text-sm md:text-md text-[#F7F3E8]">
              Eng. Mohammed Eljoujo
            </span>
          </a>
        </div>

      </div>
    </footer>
  );
}
