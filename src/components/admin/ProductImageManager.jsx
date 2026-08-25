import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  Plus,
  Star,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { extractDriveFileId, getDriveImageUrl } from '../../utils/imageUtils';
import OptimizedImage from '../common/OptimizedImage';

export default function ProductImageManager({
  selectedImages = [],
  onImagesChange,
}) {
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [inputError, setInputError] = useState('');

  // Handle registering an image from the pasted Google Drive share link
  const handleRegisterImage = (e) => {
    // Prevent any form submission or parent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setInputError('');
    const rawInput = driveUrlInput.trim();

    if (!rawInput) {
      const msg = 'Please paste a valid Google Drive image link';
      setInputError(msg);
      toast.error(msg);
      return;
    }

    // Extract Google Drive File ID
    const fileId = extractDriveFileId(rawInput);

    if (!fileId) {
      const msg = 'Please paste a valid Google Drive image link (e.g. https://drive.google.com/file/d/.../view)';
      setInputError(msg);
      toast.error(msg);
      return;
    }

    // Check for duplicate image in the current product list
    const isDuplicate = selectedImages.some(
      (img) => (img.googleDriveFileId || extractDriveFileId(img.url || img.directUrl || img)) === fileId
    );

    if (isDuplicate) {
      const msg = 'This image has already been added';
      setInputError(msg);
      toast.error(msg);
      return;
    }

    const isFirst = selectedImages.length === 0;
    const directExportUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    const displayImageUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1200`;
    const thumbnailImageUrl = `https://lh3.googleusercontent.com/d/${fileId}=w400`;

    const newImageItem = {
      googleDriveFileId: fileId,
      fileId,
      url: displayImageUrl,
      displayImageUrl,
      thumbnailUrl: thumbnailImageUrl,
      thumbnailImageUrl,
      directUrl: directExportUrl,
      originalShareUrl: rawInput.startsWith('http') ? rawInput : directExportUrl,
      alt: `Product Photo ${selectedImages.length + 1}`,
      isCover: isFirst,
      imageOrder: selectedImages.length,
    };

    const updatedList = [...selectedImages, newImageItem];
    onImagesChange(updatedList);
    setDriveUrlInput('');
    toast.success('Image added successfully 📸');
  };

  // Set designated image as Cover Image
  const handleMakeCover = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = selectedImages.map((img, i) => ({
      ...img,
      isCover: i === index,
    }));
    onImagesChange(updated);
    toast.success('Cover image updated! ⭐');
  };

  // Reorder selected images
  const handleMove = (index, direction, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedImages.length) return;

    const updated = [...selectedImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reindexed = updated.map((img, i) => ({
      ...img,
      imageOrder: i,
    }));

    onImagesChange(reindexed);
  };

  // Remove image from selected list
  const handleRemove = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = selectedImages.filter((_, i) => i !== index);
    // If cover was removed, assign next available image as cover
    if (updated.length > 0 && !updated.some((img) => img.isCover)) {
      updated[0].isCover = true;
    }
    onImagesChange(updated);
    toast.success('Image removed');
  };

  return (
    <div className="bg-pink-50/50 dark:bg-charcoal-900/60 border border-pink-200/80 dark:border-charcoal-700 rounded-3xl p-4 sm:p-6 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-100 dark:border-charcoal-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-soft flex-shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-[#1F2937] dark:text-white">
              PRODUCT IMAGES
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-gray-400 mt-0.5">
              Set image in Google Drive to <span className="font-semibold text-pink-600">"Anyone with the link → Viewer"</span>, then paste below.
            </p>
          </div>
        </div>

        {selectedImages.length > 0 && (
          <span className="text-xs font-bold text-pink-600 bg-pink-100/70 dark:bg-pink-950/40 px-3 py-1 rounded-full w-fit self-start sm:self-auto">
            {selectedImages.length} Image{selectedImages.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Google Drive Link Input & Register Button */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300">
          Google Drive Image Link
        </label>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
            <input
              type="text"
              value={driveUrlInput}
              onChange={(e) => {
                setDriveUrlInput(e.target.value);
                if (inputError) setInputError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRegisterImage(e);
                }
              }}
              placeholder="Paste Google Drive share link here..."
              className={`input-field pl-10 py-3 text-xs w-full bg-white dark:bg-[#1F2937] shadow-soft ${
                inputError ? 'border-rose-400 ring-1 ring-rose-400' : ''
              }`}
            />
          </div>

          {/* Explicit type="button" to never trigger form submit */}
          <button
            type="button"
            onClick={handleRegisterImage}
            className="btn-primary text-xs py-3 px-5 font-bold whitespace-nowrap shadow-soft flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ REGISTER IMAGE</span>
          </button>
        </div>

        {inputError && (
          <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {inputError}
          </p>
        )}
      </div>

      {/* Selected Images Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#1F2937] dark:text-white">
            Selected Images ({selectedImages.length})
          </span>
          {selectedImages.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onImagesChange([]);
              }}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedImages.length === 0 ? (
          <div className="text-center py-8 px-4 bg-white dark:bg-[#1F2937] rounded-2xl border border-dashed border-pink-200 dark:border-charcoal-700 space-y-1.5">
            <ImageIcon className="w-8 h-8 text-pink-300 mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#1F2937] dark:text-gray-200">
              No images added yet.
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-gray-400">
              Paste a Google Drive image link and click <strong>Register Image</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedImages.map((img, index) => {
              const fileId = img.googleDriveFileId || extractDriveFileId(img.url || img.directUrl || img);
              const previewUrl = getDriveImageUrl(fileId, 400) || img.url || img.thumbnailUrl;

              return (
                <div
                  key={fileId || index}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    img.isCover
                      ? 'bg-pink-50/90 dark:bg-pink-950/40 border-pink-400 ring-2 ring-pink-400/40 shadow-soft'
                      : 'bg-white dark:bg-charcoal-800 border-[#E5E7EB] dark:border-charcoal-700'
                  }`}
                >
                  {/* Thumbnail Preview */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-[#E5E7EB] dark:border-charcoal-700">
                    <OptimizedImage
                      src={previewUrl}
                      alt={img.alt || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                      #{index + 1}
                    </span>
                    {img.isCover && (
                      <span className="absolute bottom-1 right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm leading-tight">
                        COVER
                      </span>
                    )}
                  </div>

                  {/* Metadata & Controls */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-[#1F2937] dark:text-white truncate font-mono">
                        IMAGE {index + 1}
                      </p>
                      {img.isCover ? (
                        <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-100/80 dark:bg-pink-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ COVER
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Set as Cover button */}
                      {!img.isCover && (
                        <button
                          type="button"
                          onClick={(e) => handleMakeCover(index, e)}
                          className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-1 rounded-lg border border-pink-200 dark:border-pink-800 hover:bg-pink-100 transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" /> Set as Cover
                        </button>
                      )}

                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={(e) => handleMove(index, -1, e)}
                        disabled={index === 0}
                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-charcoal-700 disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleMove(index, 1, e)}
                        disabled={index === selectedImages.length - 1}
                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-charcoal-700 disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(index, e)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-auto flex items-center gap-1 text-[10px] font-bold"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
