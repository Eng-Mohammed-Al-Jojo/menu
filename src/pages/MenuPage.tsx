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
      className="
        min-h-screen flex flex-col
        bg-[url('/sha.jpg')]
        bg-cover bg-center bg-no-repeat
        bg-fixed
        text-[#F5F8F7]
        font-[Cairo]
        relative
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#040309]/70 backdrop-blur-md z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Logo */}
        <div className="flex justify-center py-10 relative">
          <img
            src="/hamada.png"
            alt="Logo"
            className="w-60 object-contain drop-shadow-[0_10px_40px_rgba(253,177,67,0.4)] animate-pulseScale"
          />

          <button
            onClick={() => setShowFeedbackModal(true)}
            className="
              absolute top-4 md:top-10 left-4 md:left-10
              w-12 h-12 flex items-center justify-center
              bg-[#FDB143] text-[#040309]
              rounded-full
              shadow-[0_0_30px_rgba(253,177,67,0.6)]
              hover:scale-110 transition
              z-50
            "
          >
            <FaCommentDots className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 w-full">
          <Menu />
        </div>

        <Footer />
      </div>

      <CartButton />

      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
}
