import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiCheck } from "react-icons/fi";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import type { PopupState, Category } from "./types";

interface Props {
  categories: Record<string, Category>;
  setPopup: (popup: PopupState) => void;
  newCategoryName: string;
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
}

const CategorySection: React.FC<Props> = ({
  categories,
  setPopup,
  newCategoryName,
  setNewCategoryName,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const saveEdit = async (id: string) => {
    if (!tempName.trim()) return;
    try {
      await update(ref(db, `categories/${id}`), {
        name: tempName.trim(),
      });
      setEditingId(null);
      setTempName("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await update(ref(db, `categories/${id}`), {
        available: !current,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="bg-white p-4 rounded-3xl mb-6 border-4"
      style={{ borderColor: "#FDB143" }}
    >
      <h2 className="font-bold mb-3 text-2xl">الأقسام</h2>

      {/* إضافة قسم */}
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          className="flex-1 p-2 border rounded-xl min-w-[160px]"
          placeholder="اسم القسم"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          onClick={() => setPopup({ type: "addCategory" })}
          className="px-4 rounded-xl bg-[#FDB143] flex items-center text-white hover:bg-[#FDB143]/80"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      {/* عرض الأقسام */}
      <div className="flex flex-col gap-2">
        {Object.keys(categories).map((id) => {
          const cat = categories[id];

          return (
            <div
              key={id}
              className="bg-gray-100 px-3 py-2 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* الاسم */}
              <div className="flex items-center gap-2 flex-1">
                {editingId === id ? (
                  <>
                    <input
                      className="flex-1 p-1 border rounded-xl"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                    <button
                      onClick={() => saveEdit(id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiCheck />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{cat.name}</span>

                  </>
                )}
              </div>

              {/* الجهة اليمنى */}
              <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-4">

                {/* تعديل + حذف (جنب بعض على الموبايل) */}
                <div className="flex items-center gap-3 order-1">
                  <button
                    onClick={() => startEditing(id, cat.name)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>

                  <button
                    onClick={() => setPopup({ type: "deleteCategory", id })}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* السويتش */}
                <div className="flex items-center gap-2 order-2">
                  <button
                    onClick={() => toggleAvailability(id, cat.available)}
                    className={`
          relative w-10 h-5 rounded-full transition-all duration-300 ease-in-out
          ${cat.available ? "bg-green-500" : "bg-gray-400"}
        `}
                  >
                    <span
                      className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white shadow
            transition-all duration-300 ease-in-out
            ${cat.available ? "translate-x-5 scale-105" : "translate-x-0.5"}
          `}
                    />
                  </button>

                  <span
                    className={`text-[11px] font-bold ${cat.available ? "text-green-700" : "text-gray-600"
                      }`}
                  >
                    {cat.available ? "متوفر" : "غير متوفر"}
                  </span>
                </div>
              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;
