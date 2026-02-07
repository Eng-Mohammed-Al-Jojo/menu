import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";

interface Props {
  category: Category;
  items: Item[];
  orderSystem: boolean;
}

export default function CategorySection({ category, items, orderSystem }: Props) {
  return (
    <section className="px-4 md:px-0 py-6">
      {/* عنوان القسم */}
      <div className="mb-8 flex items-center justify-center gap-4 w-full">
        <span className="flex-1 h-px bg-linear-to-r from-transparent via-[#a62303]/70 to-transparent"></span>

        <h2 className="font-[Almarai] font-extrabold
         text-[#a62303] drop-shadow-[0_4px_20px_rgba(253,177,67,0.45)]
          tracking-wide text-center text-3xl md:text-6xl">
          {category.name}
        </h2>

        <span className="flex-1 h-px bg-linear-to-r from-transparent via-[#a62303]/70 to-transparent"></span>
      </div>

      {/* Scrollable الأصناف أفقياً */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="shrink-0 w-full md:w-full">
            <ItemRow item={item} orderSystem={orderSystem} />
          </div>
        ))}
      </div>
    </section>
  );
}
