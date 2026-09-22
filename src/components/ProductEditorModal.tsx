import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  Tag,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Product } from '../types';
import smartwatchImg from '../assets/images/smartwatch_oled_black_1790105508170.jpg';
import twsImg from '../assets/images/tws_earbuds_case_1790105524294.jpg';
import shirtImg from '../assets/images/oversized_linen_shirt_1790105539917.jpg';
import tumblerImg from '../assets/images/tumbler_vacuum_flask_1790105552059.jpg';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  productToEdit?: Product | null;
  existingCategories?: string[];
}

const PRESET_SAMPLE_IMAGES = [
  {
    name: 'Smartwatch Hitam OLED',
    category: 'Elektronik',
    url: smartwatchImg
  },
  {
    name: 'TWS Wireless Earbuds',
    category: 'Elektronik',
    url: twsImg
  },
  {
    name: 'Kemeja Katun Linen',
    category: 'Fashion',
    url: shirtImg
  },
  {
    name: 'Tumbler Insulated SUS 304',
    category: 'Gaya Hidup',
    url: tumblerImg
  },
  {
    name: 'Headphone Wireless ANC',
    category: 'Elektronik',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sepatu Sneakers Kasual',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Kacamata Hitam Aviator',
    category: 'Aksesoris',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Tas Ransel Kulit Modern',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
  }
];

const DEFAULT_CATEGORIES = [
  'Elektronik',
  'Fashion',
  'Aksesoris',
  'Gaya Hidup',
  'Kecantikan',
  'Rumah Tangga',
  'Kesehatan',
  'Olahraga'
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  productToEdit,
  existingCategories = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Elektronik');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [price, setPrice] = useState<number>(100000);
  const [originalPrice, setOriginalPrice] = useState<number>(150000);
  const [image, setImage] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [badge, setBadge] = useState('Terlaris');
  const [isPromo, setIsPromo] = useState(true);
  const [stock, setStock] = useState<number>(50);
  const [rating, setRating] = useState<number>(4.8);
  const [soldCount, setSoldCount] = useState('1.5rb');
  const [shopeeUrl, setShopeeUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Combine categories
  const categoryOptions = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...existingCategories.filter((c) => c !== 'all')])
  );

  // Populate form on edit or reset on create
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      if (categoryOptions.includes(productToEdit.category)) {
        setCategory(productToEdit.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setIsCustomCategory(true);
        setCustomCategory(productToEdit.category);
      }
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice || productToEdit.price);
      setImage(productToEdit.image || '');
      setDescription(productToEdit.description || '');
      setFeatures(productToEdit.features && productToEdit.features.length > 0 ? productToEdit.features : ['']);
      setBadge(productToEdit.badge || '');
      setIsPromo(productToEdit.isPromo ?? false);
      setStock(productToEdit.stock ?? 50);
      setRating(productToEdit.rating ?? 4.8);
      setSoldCount(productToEdit.soldCount || '1rb');
      setShopeeUrl(productToEdit.shopeeUrl || '');
      setImagePreviewError(false);
      setErrorMsg(null);
    } else {
      // Reset for new product
      setName('');
      setCategory('Elektronik');
      setIsCustomCategory(false);
      setCustomCategory('');
      setPrice(129000);
      setOriginalPrice(199000);
      setImage(PRESET_SAMPLE_IMAGES[0].url);
      setDescription('Deskripsi produk lengkap mengenai keunggulan, spesifikasi bahan, dan kenyamanan pemakaian.');
      setFeatures([
        'Kualitas bahan premium awet dan tahan lama',
        'Garansi resmi dan packing aman bubble wrap',
        'Pengiriman cepat langsung ke alamat Anda'
      ]);
      setBadge('Diskon 35%');
      setIsPromo(true);
      setStock(75);
      setRating(4.9);
      setSoldCount('2.1rb');
      setShopeeUrl('');
      setImagePreviewError(false);
      setErrorMsg(null);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (around 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file gambar maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setImagePreviewError(false);
        setErrorMsg(null);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };

  // Feature list handlers
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length <= 1) {
      setFeatures(['']);
      return;
    }
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Nama produk tidak boleh kosong.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      setErrorMsg('Kategori produk tidak boleh kosong.');
      return;
    }

    if (!image.trim()) {
      setErrorMsg('Gambar produk wajib dipilih atau diisi.');
      return;
    }

    if (price <= 0) {
      setErrorMsg('Harga produk harus lebih dari 0.');
      return;
    }

    // Clean features
    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);

    const savedProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      rating: Number(rating) || 4.8,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : Math.floor(Math.random() * 800) + 200,
      soldCount: soldCount.trim() || '1rb',
      image: image.trim(),
      badge: badge.trim() || undefined,
      isPromo: Boolean(isPromo),
      description: description.trim() || 'Produk pilihan terbaik kualitas terjamin.',
      features: cleanFeatures.length > 0 ? cleanFeatures : ['Kualitas terbaik', 'Garansi resmi'],
      stock: Number(stock) || 50,
      shopeeUrl: shopeeUrl.trim() || 'https://shopee.co.id'
    };

    onSaveProduct(savedProduct);
    onClose();
  };

  const discountPercent = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              {productToEdit ? '✎' : '+'}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {productToEdit ? 'Edit Produk & Deskripsi' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-xs text-stone-500">
                {productToEdit ? 'Ubah informasi gambar, harga, deskripsi, dan fitur produk' : 'Lengkapi formulir untuk menambahkan produk ke katalog toko'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup form edit produk"
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow text-xs text-stone-800">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Detail Dasar Produk */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
              <Tag className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
                1. Informasi Dasar Produk
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">
                Nama Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Smartwatch Sport AMOLED Ultra Series Waterproof"
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">
                  Kategori Produk <span className="text-rose-500">*</span>
                </label>
                {!isCustomCategory ? (
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="custom">+ Tambah Kategori Baru...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Ketik nama kategori baru"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setCategory(categoryOptions[0] || 'Elektronik');
                      }}
                      className="px-2.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl shrink-0 font-medium"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Badge Produk */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">
                  Label / Badge Penawaran (Opsional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: Diskon 50%, Terlaris, Flash Sale"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  {badge && (
                    <div className="shrink-0 flex items-center px-2.5 bg-stone-900 text-white rounded-lg text-[11px] font-semibold">
                      {badge}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Harga & Promo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 block">
                  Harga Jual / Promo (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <span className="text-[11px] text-stone-500 block">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price || 0)}
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 block">
                  Harga Coret / Normal (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <span className="text-[11px] text-stone-500 block line-through">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(originalPrice || 0)}
                </span>
              </div>

              <div className="space-y-1 sm:border-l sm:border-stone-200 sm:pl-4 flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPromo}
                    onChange={(e) => setIsPromo(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-stone-300"
                  />
                  <span className="font-semibold text-stone-800">
                    Tampilkan di Tab Promo
                  </span>
                </label>
                {discountPercent > 0 && (
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Otomatis terhitung diskon {discountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Ganti & Atur Gambar Produk */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
                  2. Gambar Produk & Foto Etalase
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">
                Pilih file dari HP/komputer, link URL, atau galeri cepat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Preview Gambar */}
              <div className="md:col-span-4 space-y-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative group flex items-center justify-center shadow-xs">
                  {image && !imagePreviewError ? (
                    <img
                      src={image}
                      alt="Preview Produk"
                      onError={() => setImagePreviewError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-stone-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">Belum ada gambar yang valid</span>
                    </div>
                  )}
                  {badge && (
                    <div className="absolute top-2 left-2 bg-stone-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {badge}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-stone-400 text-center">
                  Preview tampilan pada kartu katalog produk
                </p>
              </div>

              {/* Pilihan Sumber Gambar */}
              <div className="md:col-span-8 space-y-3">
                
                {/* Tab Pilihan Upload / URL / Presets */}
                <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      imageTab === 'upload'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Upload File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      imageTab === 'url'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                    <span>Link / URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      imageTab === 'presets'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Galeri Contoh</span>
                  </button>
                </div>

                {/* Sub-view: Upload File */}
                {imageTab === 'upload' && (
                  <div className="p-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors text-center space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                      >
                        Pilih Gambar dari Komputer / HP
                      </button>
                      <p className="text-[11px] text-stone-500 mt-1.5">
                        Mendukung format JPG, PNG, WEBP hingga 5MB. Gambar langsung tersimpan otomatis.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-view: Input URL */}
                {imageTab === 'url' && (
                  <div className="space-y-2 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <label className="font-semibold text-stone-700 block text-xs">
                      Tautan URL Gambar Langsung
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                          setImagePreviewError(false);
                        }}
                        placeholder="https://images.unsplash.com/... atau link foto Shopee"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600 text-xs"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Pastikan URL mengarah langsung ke berkas gambar (format .jpg, .png, .webp).
                    </p>
                  </div>
                )}

                {/* Sub-view: Preset Gallery */}
                {imageTab === 'presets' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-stone-500">
                      Klik salah satu gambar siap pakai di bawah untuk menerapkannya ke produk:
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImage(preset.url);
                            setImagePreviewError(false);
                          }}
                          className={`aspect-[4/3] rounded-lg overflow-hidden border-2 relative transition-all group ${
                            image === preset.url
                              ? 'border-orange-600 ring-2 ring-orange-200'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {image === preset.url && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Section 3: Edit Deskripsi & Fitur Keunggulan */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
              <Layers className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
                3. Deskripsi & Keunggulan Produk
              </h3>
            </div>

            {/* Textarea Deskripsi */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">
                Deskripsi Lengkap Produk <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan spesifikasi, bahan, kegunaan, keunggulan fitur, dan petunjuk pemakaian..."
                required
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600 leading-relaxed text-xs"
              />
            </div>

            {/* Fitur Utama / Bullet Points */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-stone-700 block">
                  Poin Fitur & Spesifikasi Utama (Tampil sebagai Checklist di Modal Produk)
                </label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-orange-600 hover:text-orange-700 font-semibold text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin Fitur</span>
                </button>
              </div>

              <div className="space-y-2">
                {features.map((feat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-5 text-center text-stone-400 font-mono text-xs">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Contoh: Baterai tahan 14 hari, Garansi resmi 1 tahun`}
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Hapus poin fitur"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 4: Detail Stok, Rating & Link Khusus Shopee */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
                4. Data Tambahan & Tautan Shopee
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 block">
                  Stok Tersedia
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 block">
                  Rating Bintang (1.0 - 5.0)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 block">
                  Jumlah Terjual (Label)
                </label>
                <input
                  type="text"
                  value={soldCount}
                  onChange={(e) => setSoldCount(e.target.value)}
                  placeholder="Contoh: 1.5rb, 850"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">
                Tautan Khusus Shopee Produk Ini (Opsional)
              </label>
              <input
                type="url"
                value={shopeeUrl}
                onChange={(e) => setShopeeUrl(e.target.value)}
                placeholder="https://shopee.co.id/product/..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <p className="text-[11px] text-stone-500">
                Jika dikosongkan, tombol "Beli" akan otomatis mengarah ke link afiliasi utama toko Anda yang diatur di tab Afiliasi.
              </p>
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200/70 border border-stone-300 transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{productToEdit ? 'Simpan Perubahan' : 'Tambahkan Produk'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
