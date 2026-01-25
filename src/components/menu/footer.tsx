import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";
import { useState } from "react";
import FeedbackModal from "../menu/FeedbackModal";

export default function Footer() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <footer className="mt-16 bg-[#74070b] text-white rounded-t-3xl font-[Almarai]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* يمين – الموقع */}
        <div className="flex flex-col md:items-end items-center space-y-3 w-full md:w-auto">
          <div className="flex items-end gap-2 text-lg font-[Cairo]">
            <FaMapMarkerAlt />
            غزة شارع الثورة مقابل تاج مول
          </div>

          <div className="flex flex-col gap-1 items-start md:items-end">
            <a href="tel:+970597230040" className="flex items-center gap-2">
              <FaMapMarkerAlt className="" />059XXXXXX
            </a>
            <a href="tel:+970567230041" className="flex items-center gap-2">
              <FaPhoneAlt />056XXXXXX
            </a>
          </div>
        </div>

        {/* الوسط – أيقونات التواصل */}
        <div className="flex flex-col items-center gap-5 w-full md:w-auto">
          <div className="flex gap-4">
            {[FaWhatsapp, FaInstagram, FaFacebookF].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#940D11] hover:scale-110 transition"
              >
                <Icon className="text-white text-lg" />
              </a>
            ))}
          </div>
        </div>

        {/* يسار – توقيع المهندس */}
        <div className="flex flex-col md:items-start items-center w-full md:w-auto">
          <a
            href="https://engmohammedaljojo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <FaLaptopCode className="text-white text-lg" />
            </div>

            <div className="leading-tight text-center md:text-left">
              <span className="block text-[10px] opacity-70">
                تصميم وتطوير
              </span>
              <span className="block font-extrabold text-xs md:text-sm">
                Eng. Mohammed Eljoujo
              </span>
            </div>
          </a>
        </div>

      </div>

      <FeedbackModal show={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </footer>
  );
}
