import CartButton from "../components/cart/CartButton";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";

export default function MenuPage() {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        flex flex-col
        bg-[#231F20]  /* خلفية بيج فاتح */
        text-[#F7F3E8] /* نص أسود غامق */
        font-[Cairo]
      "
    >
      {/* Logo */}
      <div className="flex justify-center py-10">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-60 object-contain drop-shadow-lg"
        />
      </div>

      {/* Menu Content */}
      <div className="flex-1 w-full">
        <Menu />
      </div>

      {/* Footer */}
      <Footer />
      <CartButton />
    </div>
  );
}
