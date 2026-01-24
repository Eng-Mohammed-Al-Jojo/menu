import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";

interface Props {
  category: Category;
  items: Item[];
}

export default function CategorySection({ category, items }: Props) {
  return (
    <section className="mb-20 px-4 md:px-0">
      {/* عنوان القسم مع الخطوط */}
      <div className="mb-12 flex items-center justify-center flex-wrap gap-2 w-full">
        <span className="flex-1 h-1 bg-linear-to-r from-[#F7F3E8]/50 via-[#940D11]/40 to-[#F7F3E8]/50 rounded-full shadow-inner"></span>

        <h2 className="font-[Almarai] font-extrabold text-[#940D11] drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)] 
        tracking-wide uppercase text-center text-4xl md:text-6xl sm:text-5xl px-2">
          {category.name}
        </h2>

        <span className="flex-1 h-1 bg-linear-to-r from-[#F7F3E8]/50 via-[#940D11]/40 to-[#F7F3E8]/50 rounded-full shadow-inner"></span>
      </div>

      {/* كل صنف بسطر */}
      <div className="flex flex-col gap-2">
        {items.map(item => <ItemRow key={item.id} item={item} />)}
      </div>
    </section>
  );
}
