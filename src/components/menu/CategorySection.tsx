import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface Props {
  category: Category;
  items: Item[];
  orderSystem: boolean;
}

export default function CategorySection({ category, items, orderSystem }: Props) {
  const { i18n } = useTranslation();
  const catName = i18n.language === 'ar' ? (category.nameAr || category.name) : (category.nameEn || category.name);

  return (
    <section className="w-full py-10 overflow-hidden">
      {/* Premium Category Header */}
      <motion.div
        initial={{ opacity: 0, x: i18n.language === 'ar' ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex items-center gap-5 mb-10 px-2"
      >
        <div className="relative">
          <div className="h-10 w-2 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
          <div className="absolute inset-0 bg-primary blur-md opacity-20"></div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-black text-(--text-main) tracking-tighter">
            {catName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
              {i18n.language === 'ar' ?
                (`${items.length} ${items.length >= 3 && items.length <= 10 ? 'أصناف' : 'صنف'}`) :
                (`${items.length} ${items.length === 1 ? 'Item' : 'Items'}`)
              }
            </span>
            <div className="h-px w-8 bg-primary/20"></div>
          </div>
        </div>

        <div className="flex-1 h-px bg-linear-to-r from-(--border-color) to-transparent opacity-50"></div>
      </motion.div>

      {/* Responsive Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <ItemRow item={item} orderSystem={orderSystem} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
