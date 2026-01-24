import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiCheck } from "react-icons/fi";
import { type PopupState } from "./types";
import { db } from "../../firebase"; // استدعاء الـ db من إعدادات Firebase
import { ref, update } from "firebase/database";

interface Props {
  categories: Record<string, { name: string; createdAt: number }>;
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
    if (tempName.trim() === "") return;

    try {
      const categoryRef = ref(db, `categories/${id}`);
      await update(categoryRef, { name: tempName.trim() });
      setEditingId(null);
      setTempName("");
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-3xl mb-6 border-4" style={{ borderColor: "#940D11" }}>
      <h2 className="font-bold mb-3 text-xl">الأقسام</h2>

      {/* إضافة قسم جديد */}
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          className="flex-1 p-2 border rounded-xl min-w-30"
          placeholder="اسم القسم"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          onClick={() => setPopup({ type: "addCategory" })}
          className="px-4 rounded-xl bg-[#940D11] flex items-center text-white hover:bg-[#940D11]/80"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      {/* قائمة الأقسام */}
      <div className="flex flex-col gap-2">
        {Object.keys(categories).map((id) => (
          <div key={id} className="bg-gray-100 px-3 py-1 rounded-xl flex gap-2 items-center justify-between">
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
                <span className="flex-1">{categories[id].name}</span>
                <button
                  onClick={() => startEditing(id, categories[id].name)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit />
                </button>
              </>
            )}

            <button
              onClick={() => setPopup({ type: "deleteCategory", id })}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
