"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
  label?: string;
  hint?: string;
  aspectRatio?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onClear,
  label,
  hint,
  aspectRatio = "16/9",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange(json.url!);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) upload(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };

  return (
    <div>
      {label && (
        <label className="block font-mono text-[10px] text-slate-500 tracking-[0.2em] uppercase mb-2">
          {label}
        </label>
      )}

      {value ? (
        <div
          className="relative rounded-xl overflow-hidden border border-white/10 group"
          style={{ aspectRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-community-200/20 border border-community-200/40 text-community-200 font-mono text-xs hover:bg-community-200/30 transition-all"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs hover:bg-red-500/30 transition-all"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-community-200 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-3 group ${
            dragOver
              ? "border-community-200/60 bg-community-200/[0.06]"
              : "border-white/10 hover:border-community-200/35 bg-white/[0.02] hover:bg-community-200/[0.03]"
          }`}
          style={{ minHeight: "140px" }}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-community-200 animate-spin" />
          ) : (
            <>
              <div className="h-12 w-12 rounded-xl bg-community-200/10 border border-community-200/20 flex items-center justify-center group-hover:bg-community-200/15 transition-colors">
                <ImageIcon className="h-6 w-6 text-community-200/60 group-hover:text-community-200/80 transition-colors" />
              </div>
              <div className="text-center">
                <p className="font-mono text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Click to upload or drag & drop
                </p>
                <p className="font-mono text-xs text-slate-600 mt-1">JPG, PNG, WebP · Max 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="font-mono text-xs text-red-400 mt-2">{error}</p>}
      {hint && !error && <p className="font-mono text-xs text-slate-600 mt-2">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
