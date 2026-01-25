import { useState } from "react";
import CartButton from "../components/cart/CartButton";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";
import { FaCommentDots } from "react-icons/fa";
import FeedbackModal from "../components/menu/FeedbackModal";

export default function MenuPage() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-[#231F20] text-[#F7F3E8] font-[Cairo] relative"
    >
      {/* Logo */}
      <div className="flex justify-center py-10 relative">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-60 object-contain drop-shadow-lg"
        />

        {/* زر الشكاوى أعلى الشاشة */}
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="
                    absolute 
                    top-4 md:top-10    /* مسافة من الأعلى متناسبة */
                    left-4 md:left-10  /* مسافة من اليسار متناسبة */
                    w-12 h-12          /* زر دائري */
                    flex items-center justify-center
                    bg-[#D2000E] text-white 
                    rounded-full      /* دائري */
                    shadow-lg 
                    hover:scale-110 transition-all duration-300
                    z-50
                  "
        >
          <FaCommentDots className="w-6 h-6" />
        </button>
      </div>

      {/* Menu Content */}
      <div className="flex-1 w-full relative">
        <Menu />
      </div>

      {/* Footer */}
      <Footer />
      <CartButton />

      {/* مودال الشكاوى */}
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
}
