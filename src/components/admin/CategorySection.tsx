import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiCheck, FiChevronDown, FiMove } from "react-icons/fi";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import type { PopupState, Category } from "./types";

interface Props {
  categories: Record<string, Category>;
  setPopup: (popup: PopupState) => void;
  newCategoryNameAr: string;
  setNewCategoryNameAr: React.Dispatch<React.SetStateAction<string>>;
  newCategoryNameEn: string;
  setNewCategoryNameEn: React.Dispatch<React.SetStateAction<string>>;
}

const SortableCategory: React.FC<{
  cat: Category & { id: string };
  editingId: string | null;
  tempNameAr: string;
  setTempNameAr: React.Dispatch<React.SetStateAction<string>>;
  tempNameEn: string;
  setTempNameEn: React.Dispatch<React.SetStateAction<string>>;
  saveEdit: (id: string) => void;
  startEditing: (id: string, nameAr: string, nameEn: string) => void;
  toggleAvailability: (id: string, current: boolean) => void;
  setPopup: (popup: PopupState) => void;
}> = ({
  cat,
  editingId,
  tempNameAr,
  setTempNameAr,
  tempNameEn,
  setTempNameEn,
  saveEdit,
  startEditing,
  toggleAvailability,
  setPopup,
}) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: cat.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
    };

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        layout
        className={`
          relative group flex items-center bg-(--bg-card) rounded-2xl border transition-all duration-300 mb-3
          ${isDragging ? "z-50 border-primary shadow-2xl scale-[1.02]" : "border-(--border-color) hover:border-primary/30 shadow-sm"}
        `}
      >
        {/* Drag Handle */}
        <div
          {...listeners}
          className={`
            cursor-grab active:cursor-grabbing p-4
            text-(--text-muted) hover:text-primary transition-colors
            ${isRtl ? 'border-l' : 'border-r'} border-(--border-color)
          `}
        >
          <FiMove className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {editingId === cat.id ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  className="w-full p-2 bg-(--bg-main) border border-primary rounded-xl text-sm font-bold outline-none"
                  placeholder={t('common.name') + " (AR)"}
                  value={tempNameAr}
                  onChange={(e) => setTempNameAr(e.target.value)}
                />
                <input
                  className="w-full p-2 bg-(--bg-main) border border-primary rounded-xl text-sm font-bold outline-none"
                  placeholder={t('common.name') + " (EN)"}
                  value={tempNameEn}
                  onChange={(e) => setTempNameEn(e.target.value)}
                />
                <button
                  onClick={() => saveEdit(cat.id)}
                  className="w-full py-2 flex items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20 text-xs font-black"
                >
                  <FiCheck className={`${isRtl ? 'ml-2' : 'mr-2'}`} /> {t('common.save')}
                </button>
              </div>
            ) : (
              <h3 className="text-sm sm:text-base font-black text-(--text-main) truncate">
                {isRtl ? cat.nameAr || cat.name : cat.nameEn || cat.name}
                {cat.nameEn && cat.nameAr && (
                  <span className={`text-[10px] opacity-40 font-normal ${isRtl ? 'mr-2' : 'ml-2'}`}>
                    ({isRtl ? cat.nameEn : cat.nameAr})
                  </span>
                )}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => startEditing(cat.id, cat.nameAr || cat.name, cat.nameEn || "")}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-(--bg-main) text-(--text-muted) hover:text-primary hover:bg-primary/10 transition-all border border-(--border-color)"
              >
                <FiEdit size={14} />
              </button>

              <button
                onClick={() => setPopup({ type: "deleteCategory", id: cat.id })}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-(--bg-main) text-(--text-muted) hover:text-red-500 hover:bg-red-50 transition-all border border-(--border-color)"
              >
                <FiTrash2 size={14} />
              </button>
            </div>

            <button
              onClick={() => toggleAvailability(cat.id, cat.available ?? true)}
              className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-all duration-300 border
              ${cat.available ? "bg-secondary border-secondary/20" : "bg-gray-200 border-gray-300"}`}
            >
              <motion.span
                animate={{ x: cat.available ? (isRtl ? 2 : (window.innerWidth < 640 ? 18 : 24)) : (isRtl ? (window.innerWidth < 640 ? 18 : 24) : 2) }}
                className={`absolute top-0.5 left-0 w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 rounded-full bg-white shadow-md`}
              />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

const CategorySection: React.FC<Props> = ({
  categories,
  setPopup,
  newCategoryNameAr,
  setNewCategoryNameAr,
  newCategoryNameEn,
  setNewCategoryNameEn,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNameAr, setTempNameAr] = useState("");
  const [tempNameEn, setTempNameEn] = useState("");
  const [openCategories, setOpenCategories] = useState(false);
  const [formLang, setFormLang] = useState<"ar" | "en">("ar");

  const startEditing = (id: string, nameAr: string, nameEn: string) => {
    setEditingId(id);
    setTempNameAr(nameAr);
    setTempNameEn(nameEn);
  };

  const saveEdit = async (id: string) => {
    if (!tempNameAr.trim() && !tempNameEn.trim()) return;
    await update(ref(db, `categories/${id}`), {
      name: tempNameAr.trim() || tempNameEn.trim(),
      nameAr: tempNameAr.trim(),
      nameEn: tempNameEn.trim(),
    });
    setEditingId(null);
    setTempNameAr("");
    setTempNameEn("");
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    await update(ref(db, `categories/${id}`), {
      available: !current,
    });
  };

  const categoriesArray = Object.entries(categories)
    .map(([id, cat]) => ({ ...cat, id }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categoriesArray.findIndex((c) => c.id === active.id);
    const newIndex = categoriesArray.findIndex((c) => c.id === over.id);

    const newArray = arrayMove(categoriesArray, oldIndex, newIndex);

    const updates: Record<string, any> = {};
    newArray.forEach((cat, index) => {
      updates[`categories/${cat.id}/order`] = index;
    });

    await update(ref(db), updates);
  };

  return (
    <div className="bg-(--bg-card) p-6 sm:p-8 rounded-4xl sm:rounded-[2.5rem] mb-8 border border-(--border-color) shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-primary">{t('admin.categories')}</h2>
          <p className="text-(--text-muted) text-xs sm:text-sm font-medium mt-1">{t('admin.category_desc')}</p>
        </div>

        {/* Add Section */}
        <div className="flex items-center gap-2 sm:gap-3 bg-(--bg-main) p-1.5 rounded-2xl border border-(--border-color) w-full md:w-auto shadow-inner">
          <input
            className={`flex-1 md:w-48 bg-transparent ${isRtl ? 'pr-4 pl-2 text-right' : 'pl-4 pr-2 text-left'} py-2 text-xs sm:text-sm font-bold outline-none`}
            placeholder={formLang === "ar" ? t('common.name') + " (AR)" : t('common.name') + " (EN)"}
            value={formLang === "ar" ? newCategoryNameAr : newCategoryNameEn}
            onChange={(e) => {
              if (formLang === "ar") setNewCategoryNameAr(e.target.value);
              else setNewCategoryNameEn(e.target.value);
            }}
          />
          <button
            onClick={() => setFormLang(p => p === "ar" ? "en" : "ar")}
            className="px-2 py-1 text-[8px] font-black bg-white/50 rounded-lg border border-(--border-color) hover:bg-white transition-all uppercase shrink-0"
          >
            {formLang}
          </button>
          <button
            onClick={() => setPopup({ type: "addCategory" })}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* View Categories Button */}
      <button
        onClick={() => setOpenCategories((p) => !p)}
        className="
          w-full mb-2
          flex items-center justify-between
          px-4 sm:px-6 py-4
          bg-(--bg-main)
          rounded-2xl
          font-black text-sm sm:text-base text-(--text-main)
          hover:bg-primary/5 hover:text-primary
          transition-all border border-(--border-color)
        "
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <FiChevronDown className={`transition-transform duration-300 ${openCategories ? "rotate-180" : ""}`} />
          </span>
          <span>{t('admin.view_all_categories')}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-(--text-muted) uppercase mr-2 tracking-widest hidden sm:inline">{t('admin.total')}</span>
          <span className="bg-primary text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-lg shadow-lg shadow-primary/20">
            {categoriesArray.length}
          </span>
        </div>
      </button>

      {/* Accordion List */}
      <AnimatePresence>
        {openCategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categoriesArray.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col">
                    {categoriesArray.map((cat) => (
                      <SortableCategory
                        key={cat.id}
                        cat={cat}
                        editingId={editingId}
                        tempNameAr={tempNameAr}
                        setTempNameAr={setTempNameAr}
                        tempNameEn={tempNameEn}
                        setTempNameEn={setTempNameEn}
                        saveEdit={saveEdit}
                        startEditing={startEditing}
                        toggleAvailability={toggleAvailability}
                        setPopup={setPopup}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySection;
