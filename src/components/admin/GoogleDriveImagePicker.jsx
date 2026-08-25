import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RefreshCw,
  Plus,
  Check,
  Star,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Link2,
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { extractDriveFileId, getDriveImageUrl } from '../../utils/imageUtils';
import OptimizedImage from '../common/OptimizedImage';

export default function GoogleDriveImagePicker({
  selectedImages = [],
  onImagesChange,
}) {
  const [search, setSearch] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [addingManual, setAddingManual] = useState(false);
  const queryClient = useQueryClient();

  // Fetch Google Drive folder files with explicit routes and fallback
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['google-drive-files'],
    queryFn: async () => {
      let lastErr = null;

      // 1. Try explicit GET /drive/images
      try {
        const res = await api.get('/drive/images');
        if (res.data && Array.isArray(res.data.files)) return res.data.files;
      } catch (err) {
        lastErr = err;
      }

      // 2. Try GET /drive/files
      try {
        const res = await api.get('/drive/files');
        if (res.data && Array.isArray(res.data.files)) return res.data.files;
      } catch (err) {
        lastErr = err;
      }

      // 3. Try Vercel Serverless direct fetch
      try {
        const directRes = await fetch('/api/drive/images');
        if (directRes.ok) {
          const json = await directRes.json();
          if (json && Array.isArray(json.files)) return json.files;
        }
      } catch (err) {
        lastErr = err;
      }

      if (lastErr) {
        throw new Error(lastErr.response?.data?.message || lastErr.message || 'Unable to connect to Google Drive route');
      }

      return [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Sync / Force Refresh mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      let lastErr = null;

      // 1. Try explicit POST /drive/sync
      try {
        const res = await api.post('/drive/sync');
        if (res.data && Array.isArray(res.data.files)) return res.data.files;
      } catch (err) {
        lastErr = err;
      }

      // 2. Try GET /drive/images?refresh=true
      try {
        const res = await api.get('/drive/images?refresh=true');
        if (res.data && Array.isArray(res.data.files)) return res.data.files;
      } catch (err) {
        lastErr = err;
      }

      // 3. Try Vercel Serverless direct POST
      try {
        const directRes = await fetch('/api/drive/sync', { method: 'POST' });
        if (directRes.ok) {
          const json = await directRes.json();
          if (json && Array.isArray(json.files)) return json.files;
        }
      } catch (err) {
        lastErr = err;
      }

      throw new Error(lastErr?.response?.data?.message || lastErr?.message || 'Failed to sync with Google Drive');
    },
    onSuccess: (files) => {
      toast.success(`Synced ${files.length} images from Google Drive! ✨`);
      queryClient.setQueryData(['google-drive-files'], files);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to sync with Google Drive');
    },
  });

  // Manual Add / Register mutation
  const registerMutation = useMutation({
    mutationFn: async (input) => {
      const fileId = extractDriveFileId(input);
      if (!fileId) throw new Error('Invalid Google Drive share link or file ID');

      try {
        const res = await api.post('/drive/register', { fileInput: input });
        if (res.data?.file) return res.data.file;
      } catch (e) {}

      // Fallback local construct
      return {
        fileId,
        name: `Product Photo (${fileId.slice(0, 8)})`,
        mimeType: 'image/jpeg',
        thumbnailUrl: getDriveImageUrl(fileId, 400),
        displayUrl: getDriveImageUrl(fileId, 1200),
      };
    },
    onSuccess: (newFile) => {
      toast.success('Google Drive image added to gallery! 📸');
      setManualLink('');
      setAddingManual(false);
      queryClient.invalidateQueries(['google-drive-files']);

      if (newFile) {
        toggleSelect(newFile);
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Invalid Google Drive link or ID');
    },
  });

  const files = data || [];

  // Filter files by search term
  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    const term = search.toLowerCase();
    return files.filter(
      (f) =>
        f.name?.toLowerCase().includes(term) ||
        f.fileId?.toLowerCase().includes(term)
    );
  }, [files, search]);

  // Check if a file is already selected
  const isSelected = (file) => {
    const fileId = file.fileId || file.id || extractDriveFileId(file.url || file);
    return selectedImages.some(
      (img) => (img.googleDriveFileId || extractDriveFileId(img.url || img)) === fileId
    );
  };

  // Toggle selection of an image
  const toggleSelect = (file) => {
    const fileId = file.fileId || file.id || extractDriveFileId(file.url || file);
    if (!fileId) return;

    const existingIndex = selectedImages.findIndex(
      (img) => (img.googleDriveFileId || extractDriveFileId(img.url || img)) === fileId
    );

    if (existingIndex >= 0) {
      // Remove from selection
      const updated = selectedImages.filter((_, i) => i !== existingIndex);
      if (updated.length > 0 && !updated.some((img) => img.isCover)) {
        updated[0].isCover = true;
      }
      onImagesChange(updated);
    } else {
      // Add to selection
      const isFirst = selectedImages.length === 0;
      const newImg = {
        googleDriveFileId: fileId,
        url: getDriveImageUrl(fileId, 1200),
        thumbnailUrl: getDriveImageUrl(fileId, 400),
        alt: file.name || 'Product Photo',
        isCover: isFirst,
        imageOrder: selectedImages.length,
      };
      onImagesChange([...selectedImages, newImg]);
    }
  };

  // Set designated image as Cover Image
  const makeCover = (index) => {
    const updated = selectedImages.map((img, i) => ({
      ...img,
      isCover: i === index,
    }));
    onImagesChange(updated);
    toast.success('Cover image updated! ⭐');
  };

  // Reorder selected images
  const moveImage = (index, direction) => {
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

  // Remove specific selected image
  const removeSelected = (index) => {
    const updated = selectedImages.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isCover)) {
      updated[0].isCover = true;
    }
    onImagesChange(updated);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLink.trim()) return;
    registerMutation.mutate(manualLink.trim());
  };

  return (
    <div className="bg-pink-50/40 dark:bg-charcoal-900/50 border border-pink-100 dark:border-charcoal-800 rounded-3xl p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100 dark:border-charcoal-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-soft flex-shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-[#1F2937] dark:text-white">
                Select from Google Drive
              </h3>
              <span className="badge badge-soft text-[10px] font-bold uppercase tracking-wider">
                Central Image Store
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Folder ID: <span className="font-mono font-bold text-pink-600">1p2C_7uNfCnHU-dFlwTlj14Avm0Xgz0c</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending || isFetching}
            className="btn-secondary text-xs py-2 px-3 gap-1.5 shadow-soft"
            title="Sync latest photos from Google Drive"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncMutation.isPending || isFetching ? 'animate-spin text-pink-600' : ''
              }`}
            />
            <span>{syncMutation.isPending || isFetching ? 'Syncing...' : 'Sync Drive'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAddingManual(!addingManual)}
            className="btn-secondary text-xs py-2 px-3 gap-1.5 shadow-soft"
            title="Add image by link or file ID"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Manual Link Input Drawer */}
      <AnimatePresence>
        {addingManual && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleManualSubmit}
            className="flex gap-2 pt-1 pb-2 overflow-hidden"
          >
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
              <input
                type="text"
                value={manualLink}
                onChange={(e) => setManualLink(e.target.value)}
                placeholder="Paste Google Drive share link or File ID..."
                className="input-field pl-9 py-2 text-xs w-full shadow-soft"
              />
            </div>
            <button
              type="submit"
              disabled={registerMutation.isPending || !manualLink.trim()}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
            >
              {registerMutation.isPending ? 'Adding...' : 'Register Image'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Selected Images Section */}
      {selectedImages.length > 0 && (
        <div className="bg-white dark:bg-[#1F2937] p-3.5 sm:p-4 rounded-2xl border border-pink-200/80 dark:border-charcoal-700 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#1F2937] dark:text-white">
                Selected Product Photos ({selectedImages.length})
              </span>
              <span className="text-[10px] text-[#64748B]">
                (Click ⭐ to change Cover Image)
              </span>
            </div>
            <button
              type="button"
              onClick={() => onImagesChange([])}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {selectedImages.map((img, index) => {
              const fileId = img.googleDriveFileId || extractDriveFileId(img.url);
              const thumbUrl = getDriveImageUrl(fileId, 300) || img.url;

              return (
                <div
                  key={fileId || index}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    img.isCover
                      ? 'bg-pink-50/60 dark:bg-pink-950/30 border-pink-400 ring-1 ring-pink-400'
                      : 'bg-[#F5F7FA] dark:bg-charcoal-800 border-[#E5E7EB] dark:border-charcoal-700'
                  }`}
                >
                  {/* Thumbnail & Order */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-[#E5E7EB]">
                    <OptimizedImage
                      src={thumbUrl}
                      alt={img.alt || 'Selected'}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                      #{index + 1}
                    </span>
                    {img.isCover && (
                      <span className="absolute bottom-1 right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow-sm">
                        COVER
                      </span>
                    )}
                  </div>

                  {/* Metadata & Controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-[11px] font-bold text-[#1F2937] dark:text-white truncate font-mono">
                      ID: {fileId ? `${fileId.slice(0, 10)}...` : 'Drive Photo'}
                    </p>

                    <div className="flex items-center gap-1">
                      {/* Make Cover Button */}
                      {!img.isCover && (
                        <button
                          type="button"
                          onClick={() => makeCover(index)}
                          className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-md border border-pink-200 dark:border-pink-800 hover:bg-pink-100 transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" /> Make Cover
                        </button>
                      )}

                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-charcoal-700 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === selectedImages.length - 1}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-charcoal-700 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeSelected(index)}
                        className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-auto"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Drive photos by name or ID..."
          className="input-field pl-10 py-2.5 text-xs w-full shadow-soft bg-white dark:bg-[#1F2937]"
        />
      </div>

      {/* Google Drive Gallery Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>Available Drive Photos ({filteredFiles.length})</span>
          <span>Click image thumbnail to select / unselect</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array(8)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gray-200 dark:bg-slate-700 animate-pulse border border-[#E5E7EB]"
                />
              ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-white dark:bg-[#1F2937] rounded-2xl border border-rose-200 p-4 space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto opacity-80" />
            <div>
              <p className="text-xs font-bold text-rose-600">
                Failed to load Google Drive folder images
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {error?.message || 'Check network connection or Drive folder permissions'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="btn-secondary text-xs py-2 px-4 mx-auto gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
            </button>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1F2937] rounded-2xl border border-dashed border-[#E5E7EB] dark:border-charcoal-700 p-4 space-y-3">
            <ImageIcon className="w-10 h-10 text-pink-300 mx-auto opacity-40" />
            <div>
              <p className="text-xs font-bold text-[#1F2937] dark:text-white">
                No images found in Google Drive folder
              </p>
              <p className="text-[11px] text-[#64748B] max-w-sm mx-auto mt-1">
                Photos uploaded directly from mobile into folder{' '}
                <span className="font-mono font-bold text-pink-600">1p2C_7uNfCnHU-dFlwTlj14Avm0Xgz0c</span>{' '}
                will appear here automatically.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => syncMutation.mutate()}
                className="btn-secondary text-xs py-2 px-3 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
              </button>
              <button
                type="button"
                onClick={() => setAddingManual(true)}
                className="btn-primary text-xs py-2 px-3 gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add by Link
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1 p-1">
            {filteredFiles.map((file) => {
              const fileId = file.fileId || file.id;
              const selected = isSelected(file);
              const thumbUrl = getDriveImageUrl(fileId, 400);

              return (
                <div
                  key={fileId}
                  onClick={() => toggleSelect(file)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 shadow-sm ${
                    selected
                      ? 'border-pink-500 ring-2 ring-pink-500/40 scale-[0.98]'
                      : 'border-transparent hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  <OptimizedImage
                    src={thumbUrl}
                    alt={file.name || 'Drive Image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Selection Checkmark Overlay */}
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      selected
                        ? 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md scale-100'
                        : 'bg-black/40 text-white/60 group-hover:bg-black/60 group-hover:text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* File Name Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-4">
                    <p className="text-[10px] font-bold text-white truncate drop-shadow-sm">
                      {file.name || 'Product Photo'}
                    </p>
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
