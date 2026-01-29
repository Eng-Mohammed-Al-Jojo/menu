import React from "react";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (img: string) => void;
    featureImages: string[];
    selectedImage?: string;
}

const FeaturedGallery: React.FC<Props> = ({ visible, onClose, onSelect, featureImages, selectedImage }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-xl w-64">
                <h3 className="font-bold mb-2 text-center">اختر صورة للصنف</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {featureImages.map((img) => (
                        <button
                            key={img}
                            type="button"
                            onClick={() => onSelect(img)}
                            className={`relative rounded-lg overflow-hidden border-2 transition
                ${selectedImage === img ? "border-[#FDB143]" : "border-transparent hover:border-gray-300"}`}
                        >
                            <img
                                src={`/featured/${img}`}
                                alt={img}
                                className="w-full h-20 object-contain bg-black"
                            />
                            {selectedImage === img && (
                                <div className="absolute inset-0 bg-[#FDB143]/20 flex items-center justify-center font-bold">
                                    ✓
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    إلغاء
                </button>
            </div>
        </div>
    );
};

export default FeaturedGallery;
