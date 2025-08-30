// src/components/Utiles/Formulario/ImageUploader.jsx
import { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ImageUploader({ name = "logoUrl", recommendedText = "PNG transparente 300x100px" }) {
  const fileInputRef = useRef(null);
  const { setValue, watch } = useFormContext();
  const current = watch(name);
  const [preview, setPreview] = useState(current || null);

  useEffect(() => {
    setPreview(current || null);
  }, [current]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe exceder los 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setValue(name, reader.result, { shouldDirty: true, shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    setValue(name, "", { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Logo del Gimnasio</label>
      <p className="text-xs text-gray-500 mb-2">Recomendado: {recommendedText}</p>

      {preview ? (
        <div className="flex flex-col items-start gap-4">
          <div className="relative group">
            <img src={preview} alt="Logo preview" className="h-24 object-contain rounded-lg border border-gray-200 bg-white p-2" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
              title="Eliminar logo"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[var(--color-primary)]/100 transition-colors bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            <span className="text-[var(--color-primary)] font-medium">Click para subir</span> o arrastra tu archivo
          </p>
          <p className="text-xs text-gray-400 mt-1">Formatos: JPG, PNG, SVG</p>
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
    </div>
  );
}
