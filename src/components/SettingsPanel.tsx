import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Link2, 
  Sliders, 
  HelpCircle, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  MousePointerClick,
  Sparkles,
  Info,
  Lock,
  KeyRound,
  Shield,
  EyeOff,
  Package,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Image as ImageIcon,
  Search,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { RedirectConfig, CatalogPreferences, SettingsTab, AdminSecurityConfig, Product } from '../types';
import { ProductEditorModal } from './ProductEditorModal';

interface SettingsPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onResetProducts: () => void;
  redirectConfig: RedirectConfig;
  onUpdateRedirectConfig: (config: RedirectConfig) => void;
  preferences: CatalogPreferences;
  onUpdatePreferences: (pref: CatalogPreferences) => void;
  adminConfig: AdminSecurityConfig;
  onUpdateAdminConfig: (config: AdminSecurityConfig) => void;
  onBackToMain: () => void;
  onResetTrigger: () => void;
  onLockAdmin: () => void;
  hasTriggered: boolean;
  onShowToast: (msg: string) => void;
  initialTab?: SettingsTab;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  products,
  onUpdateProducts,
  onResetProducts,
  redirectConfig,
  onUpdateRedirectConfig,
  preferences,
  onUpdatePreferences,
  adminConfig,
  onUpdateAdminConfig,
  onBackToMain,
  onResetTrigger,
  onLockAdmin,
  hasTriggered,
  onShowToast,
  initialTab = 'produk'
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  
  // Product management state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Local form state
  const [localConfig, setLocalConfig] = useState<RedirectConfig>({ ...redirectConfig });
  const [localPref, setLocalPref] = useState<CatalogPreferences>({ ...preferences });
  const [localAdmin, setLocalAdmin] = useState<AdminSecurityConfig>({ ...adminConfig });
  const [savedAlert, setSavedAlert] = useState(false);

  // PIN change state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showPins, setShowPins] = useState(false);

  // Product actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    const exists = products.some((p) => p.id === savedProduct.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      onShowToast(`Produk "${savedProduct.name.slice(0, 20)}..." berhasil diperbarui!`);
    } else {
      updated = [savedProduct, ...products];
      onShowToast(`Produk baru "${savedProduct.name.slice(0, 20)}..." berhasil ditambahkan!`);
    }
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    onUpdateProducts(updated);
    setDeleteConfirmId(null);
    onShowToast(`Produk "${target ? target.name.slice(0, 20) + '...' : ''}" telah dihapus.`);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicate: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Salinan)`
    };
    const updated = [duplicate, ...products];
    onUpdateProducts(updated);
    onShowToast(`Produk "${prod.name.slice(0, 20)}..." berhasil diduplikasi.`);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  const filteredAdminProducts = products.filter((prod) => {
    if (productCategoryFilter !== 'all' && prod.category !== productCategoryFilter) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc;
    }
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRedirectConfig(localConfig);
    onUpdatePreferences(localPref);
    onUpdateAdminConfig(localAdmin);
    setSavedAlert(true);
    onShowToast('Pengaturan berhasil disimpan!');
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput.trim() !== localAdmin.pin) {
      setPinChangeMsg({ type: 'error', text: 'PIN Lama salah! Silakan coba lagi.' });
      return;
    }
    if (newPinInput.length < 4 || newPinInput.length > 8) {
      setPinChangeMsg({ type: 'error', text: 'PIN baru harus 4 hingga 8 digit angka.' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN baru tidak sesuai.' });
      return;
    }

    const updated = { ...localAdmin, pin: newPinInput.trim() };
    setLocalAdmin(updated);
    onUpdateAdminConfig(updated);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeMsg({ type: 'success', text: 'PIN Admin berhasil diperbarui!' });
    onShowToast('PIN Admin berhasil diperbarui!');
  };

  const handleTestLink = () => {
    if (!localConfig.targetUrl) {
      onShowToast('Silakan isi URL Shopee terlebih dahulu!');
      return;
    }
    window.open(localConfig.targetUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Membuka tautan uji coba di tab baru...');
  };

  const handleResetToDefaults = () => {
    const defaultConf: RedirectConfig = {
      enabled: true,
      targetUrl: 'https://shopee.co.id',
      mode: 'first_interaction',
      openInNewTab: true,
      showToastNotification: true,
      customAffiliateCode: ''
    };
    const defaultPref: CatalogPreferences = {
      viewMode: 'grid',
      showDiscountBadge: true,
      showRating: true,
      sortBy: 'popular'
    };
    setLocalConfig(defaultConf);
    setLocalPref(defaultPref);
    onUpdateRedirectConfig(defaultConf);
    onUpdatePreferences(defaultPref);
    onResetTrigger();
    onShowToast('Pengaturan dikembalikan ke setelan pabrik.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-200">
      
      {/* Top Header & Breadcrumb Separation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToMain}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 mb-2 group transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Menu Utama (Katalog)</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Menu Pengaturan Sistem
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              Area Konfigurasi
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Menu ini sengaja dipisahkan agar navigasi belanja katalog tetap bersih dan mudah dipahami oleh pengguna baru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center gap-1.5"
            title="Kembalikan ke pengaturan awal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Bawaan</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Saved Notification */}
      {savedAlert && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Perubahan pengaturan berhasil disimpan dan langsung diterapkan ke sistem!
          </span>
        </div>
      )}

      {/* Sub-Tab Navigation for Settings */}
      <div className="flex items-center gap-2 border-b border-stone-200 mt-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('produk')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'produk'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kelola Produk ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('afiliasi')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'afiliasi'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Tautan Afiliasi & Redirect</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tampilan')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'tampilan'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Preferensi Tampilan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keamanan')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'keamanan'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-600" />
          <span>Keamanan & PIN</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('panduan_admin')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'panduan_admin'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Panduan Pengelola</span>
        </button>
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="mt-6 space-y-6">
        
        {/* TAB 0: KELOLA PRODUK, GANTI GAMBAR & EDIT DESKRIPSI */}
        {activeTab === 'produk' && (
          <div className="space-y-6">
            
            {/* Header Action & Stats Card */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-stone-900">
                    Katalog & Manajemen Produk
                  </h2>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {products.length} Produk Terdaftar
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Tambah produk baru, ganti gambar/foto, ubah harga, serta edit deskripsi & fitur keunggulan produk.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Cari produk berdasarkan nama atau deskripsi..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-[11px] font-semibold text-stone-500 whitespace-nowrap">
                  Kategori:
                </label>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600 w-full sm:w-auto"
                >
                  <option value="all">Semua ({products.length})</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({products.filter((p) => p.category === cat).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product List */}
            {filteredAdminProducts.length > 0 ? (
              <div className="space-y-3">
                {filteredAdminProducts.map((prod) => {
                  const discountPercent = prod.originalPrice > prod.price
                    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={prod.id}
                      className="p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-start gap-4 flex-grow min-w-0">
                        {/* Thumbnail Image with Quick Click to Edit Photo */}
                        <div 
                          onClick={() => handleOpenEditProduct(prod)}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative group cursor-pointer"
                          title="Klik untuk ganti foto atau edit deskripsi produk ini"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1">
                            <ImageIcon className="w-4 h-4" />
                            <span>Ganti Foto</span>
                          </div>
                          {prod.isPromo && (
                            <div className="absolute top-1 left-1 bg-stone-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              PROMO
                            </div>
                          )}
                        </div>

                        {/* Text info */}
                        <div className="space-y-1 min-w-0 flex-grow">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                              {prod.category}
                            </span>
                            {prod.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-semibold">
                                {prod.badge}
                              </span>
                            )}
                            <span className="text-[11px] text-stone-400 font-mono">
                              ID: {prod.id}
                            </span>
                          </div>

                          <h3 
                            onClick={() => handleOpenEditProduct(prod)}
                            className="text-sm font-bold text-stone-900 truncate hover:text-orange-600 cursor-pointer transition-colors"
                            title={prod.name}
                          >
                            {prod.name}
                          </h3>

                          {/* Price & Discount */}
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-sm font-bold text-stone-950 tabular-nums">
                              {formatRupiah(prod.price)}
                            </span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-stone-400 line-through tabular-nums">
                                {formatRupiah(prod.originalPrice)}
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Hemat {discountPercent}%
                              </span>
                            )}
                          </div>

                          {/* Description Snippet */}
                          <p className="text-xs text-stone-500 line-clamp-1 max-w-xl">
                            {prod.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                        {deleteConfirmId === prod.id ? (
                          <div className="flex items-center gap-1.5 p-1.5 bg-rose-50 border border-rose-200 rounded-xl">
                            <span className="text-[11px] font-semibold text-rose-700 px-1">
                              Hapus produk ini?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Ya, Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-medium border border-stone-200"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-3 py-1.5 bg-stone-900 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                              title="Edit deskripsi, foto & informasi produk"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit & Ganti Foto</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDuplicateProduct(prod)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 border border-stone-200 transition-colors"
                              title="Duplikat produk"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(prod.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-stone-200 transition-colors"
                              title="Hapus produk dari katalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <span className="text-[11px] text-stone-400">
                          Stok: {prod.stock || 50} · Terjual: {prod.soldCount || '1rb'}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">
                  Tidak ada produk yang cocok
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {productSearch || productCategoryFilter !== 'all'
                    ? 'Coba ganti kata kunci pencarian atau ubah filter kategori di atas.'
                    : 'Katalog Anda saat ini masih kosong. Klik tombol di bawah untuk menambah produk baru.'}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold"
                  >
                    + Tambah Produk Baru
                  </button>
                  <button
                    type="button"
                    onClick={onResetProducts}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-medium"
                  >
                    Pulihkan Produk Bawaan
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Restore Tool */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="font-semibold text-stone-800 block">
                  Pulihkan Katalog ke Setelan Pabrik?
                </span>
                <span className="text-stone-500 text-[11px]">
                  Jika ingin mengembalikan 6 produk default bawaan sistem beserta foto dan deskripsi aslinya.
                </span>
              </div>
              <button
                type="button"
                onClick={onResetProducts}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 font-semibold rounded-lg border border-stone-300 transition-colors shrink-0 shadow-xs"
              >
                Reset Katalog ke Contoh Awal
              </button>
            </div>

          </div>
        )}

        {/* TAB 1: AFILIASI & AUTO REDIRECT */}
        {activeTab === 'afiliasi' && (
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Status Fitur Redirect
                </span>
                <span className="text-sm font-semibold text-stone-900 block mt-0.5">
                  {localConfig.enabled ? 'Auto-Redirect Shopee Sedang Aktif' : 'Auto-Redirect Dinonaktifkan'}
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Bila aktif, pengunjung akan diarahkan ke link Shopee sesuai mode pemicu di bawah.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localConfig.enabled}
                  onChange={(e) => setLocalConfig({ ...localConfig, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {/* Target URL Shopee */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Target URL Shopee / Toko Afiliasi
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={localConfig.targetUrl}
                  onChange={(e) => setLocalConfig({ ...localConfig, targetUrl: e.target.value })}
                  placeholder="https://shopee.co.id/shop/... atau https://shope.ee/..."
                  required
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-600 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-500">
                  Masukkan link toko Shopee atau link Shopee Affiliate Anda.
                </span>
                <button
                  type="button"
                  onClick={handleTestLink}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Uji Tautan di Tab Baru</span>
                </button>
              </div>
            </div>

            {/* Trigger Mode Selection */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Mode Pemicu Pengalihan (Trigger Mode)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  localConfig.mode === 'first_interaction' 
                    ? 'border-orange-600 bg-orange-50/40' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900">Klik Pertama di Halaman (Popunder)</span>
                      <input
                        type="radio"
                        name="redirectMode"
                        checked={localConfig.mode === 'first_interaction'}
                        onChange={() => setLocalConfig({ ...localConfig, mode: 'first_interaction' })}
                        className="text-orange-600 focus:ring-orange-600"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Ketika pengunjung mengeklik area mana pun untuk pertama kalinya, link Shopee terbuka di tab baru.
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] text-stone-600 font-medium">
                    Status: {hasTriggered ? 'Sudah terpemicu pada sesi ini' : 'Menunggu klik berikutnya'}
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  localConfig.mode === 'product_click' 
                    ? 'border-orange-600 bg-orange-50/40' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900">Hanya Saat Klik Kartu Produk</span>
                      <input
                        type="radio"
                        name="redirectMode"
                        checked={localConfig.mode === 'product_click'}
                        onChange={() => setLocalConfig({ ...localConfig, mode: 'product_click' })}
                        className="text-orange-600 focus:ring-orange-600"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Ramah pengguna baru: Pengalihan hanya terjadi saat calon pembeli secara sadar mengeklik tombol beli produk.
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-600 font-medium">
                    Direkomendasikan untuk kredibilitas toko
                  </div>
                </label>
              </div>

              {/* Reset Click State Button */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <span className="text-xs text-stone-500">
                  Perlu mencoba kembali pemicu klik pertama?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetTrigger();
                    onShowToast('Status pemicu klik berhasil direset!');
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                  <span>Reset Status Pemicu Sesi</span>
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Opsi Perilaku Tambahan
              </span>

              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="text-xs font-medium text-stone-800 block">
                    Buka selalu di Tab Baru (_blank)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Memastikan halaman katalog produk Anda tetap terbuka saat Shopee dikunjungi.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localConfig.openInNewTab}
                  onChange={(e) => setLocalConfig({ ...localConfig, openInNewTab: e.target.checked })}
                  className="rounded text-orange-600 focus:ring-orange-600 h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-stone-100">
                <div>
                  <span className="text-xs font-medium text-stone-800 block">
                    Tampilkan Notifikasi Pemberitahuan
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Memberi info transparan "Membuka Shopee..." ke pengunjung.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localConfig.showToastNotification}
                  onChange={(e) => setLocalConfig({ ...localConfig, showToastNotification: e.target.checked })}
                  className="rounded text-orange-600 focus:ring-orange-600 h-4 w-4"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TAMPILAN KATALOG */}
        {activeTab === 'tampilan' && (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Tata Letak Kartu Produk
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocalPref({ ...localPref, viewMode: 'grid' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    localPref.viewMode === 'grid'
                      ? 'border-orange-600 bg-orange-50/40 text-stone-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs block font-bold">Grid Standar (3-4 Kolom)</span>
                  <span className="text-[11px] text-stone-500 font-normal">Fokus visual gambar produk besar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalPref({ ...localPref, viewMode: 'compact' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    localPref.viewMode === 'compact'
                      ? 'border-orange-600 bg-orange-50/40 text-stone-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs block font-bold">Tampilan Kompak / Rapat</span>
                  <span className="text-[11px] text-stone-500 font-normal">Menampilkan lebih banyak barang per baris</span>
                </button>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stone-800 block">Tampilkan Badge Diskon (Diskon 50%)</span>
                    <span className="text-[11px] text-stone-500">Membantu menyorot produk dengan potongan harga</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPref.showDiscountBadge}
                    onChange={(e) => setLocalPref({ ...localPref, showDiscountBadge: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-600 h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <div>
                    <span className="text-xs font-medium text-stone-800 block">Tampilkan Nilai Bintang & Jumlah Terjual</span>
                    <span className="text-[11px] text-stone-500">Meningkatkan kepercayaan pembeli baru</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localPref.showRating}
                    onChange={(e) => setLocalPref({ ...localPref, showRating: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-600 h-4 w-4"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Pengurutan Produk Bawaan
              </label>
              <select
                value={localPref.sortBy}
                onChange={(e) => setLocalPref({ ...localPref, sortBy: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="popular">Paling Populer & Banyak Terjual</option>
                <option value="lowest_price">Harga Termurah ke Termahal</option>
                <option value="highest_price">Harga Termahal ke Termurah</option>
                <option value="rating">Rating Ulasan Tertinggi</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: KEAMANAN & AKSES ADMIN */}
        {activeTab === 'keamanan' && (
          <div className="space-y-6">
            
            {/* Status Keamanan PIN */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Sistem Proteksi Menu Pengaturan
                </span>
                <span className="text-sm font-semibold text-stone-900 block mt-0.5">
                  Pengaturan Terproteksi PIN Keamanan
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Pengunjung umum tidak dapat mengakses atau mengubah tautan afiliasi Shopee Anda tanpa mengetahui PIN ini.
                </p>
              </div>

              <button
                type="button"
                onClick={onLockAdmin}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Kunci Sesi Pengelola Sekarang</span>
              </button>
            </div>

            {/* Form Ganti PIN */}
            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Ubah PIN Pengelola (Admin)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ganti PIN bawaan <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono font-bold text-stone-700">1234</code> dengan PIN pribadi Anda (4-8 digit).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPins ? 'Sembunyikan' : 'Tampilkan'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    PIN Saat Ini / Lama
                  </label>
                  <input
                    type={showPins ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={8}
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="PIN lama (default: 1234)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    PIN Baru (4-8 Digit)
                  </label>
                  <input
                    type={showPins ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={8}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Masukkan PIN baru"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    Konfirmasi PIN Baru
                  </label>
                  <input
                    type={showPins ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={8}
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="Ulangi PIN baru"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {pinChangeMsg && (
                <div className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  pinChangeMsg.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {pinChangeMsg.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{pinChangeMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const resetCfg = { ...localAdmin, pin: '1234' };
                    setLocalAdmin(resetCfg);
                    onUpdateAdminConfig(resetCfg);
                    onShowToast('PIN Admin berhasil direset ke bawaan (1234)');
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset PIN ke 1234</span>
                </button>

                <button
                  type="button"
                  onClick={handleChangePin}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Perbarui PIN Sekarang
                </button>
              </div>
            </div>

            {/* Mode Senyap (Stealth Mode) */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Mode Senyap Akses Pengelola (Stealth Access)
                  </span>
                  <span className="text-xs font-medium text-stone-800 block mt-0.5">
                    Sembunyikan pintasan "Akses Pengelola" dari Footer
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Bila aktif, pengunjung biasa tidak akan melihat teks admin sama sekali. Anda dapat membuka popup PIN dengan mengklik 3 kali nama "KatalogKu" di footer bawah.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localAdmin.stealthMode}
                  onChange={(e) => {
                    const updated = { ...localAdmin, stealthMode: e.target.checked };
                    setLocalAdmin(updated);
                    onUpdateAdminConfig(updated);
                  }}
                  className="rounded text-amber-600 focus:ring-amber-600 h-4 w-4 shrink-0 ml-4"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PANDUAN PENGELOLA & FAQ */}
        {activeTab === 'panduan_admin' && (
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Info className="w-4 h-4 text-orange-600" />
                <span>Mengapa Menu Pengaturan Ini Ditaruh Terpisah?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pada versi lama, tombol konfigurasi sering ditaruh berjejer di samping menu belanja utama, sehingga pengguna baru sering mengira menu pengaturan adalah bagian dari katalog atau kategori produk.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dengan pemisahan ini:
              </p>
              <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                <li><strong>Pengunjung umum:</strong> Hanya melihat menu navigasi yang relevan untuk belanja (Katalog, Kategori, Promo, Wishlist).</li>
                <li><strong>Pengelola toko:</strong> Memiliki satu pintu masuk khusus di pojok kanan atas untuk menyetel link dan preferensi tanpa mengganggu estetika etalase.</li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bagaimana Cara Kerja Shopee Affiliate Redirect?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ketika calon pembeli mengunjungi website Anda dan tertarik pada salah satu produk, mekanisme tautan akan mengarahkan mereka ke tautan afiliasi Shopee yang telah Anda simpan di tab <em>"Tautan Afiliasi & Redirect"</em>. Komisi afiliasi akan tercatat secara resmi di dashboard Shopee Anda.
              </p>
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToMain}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            ← Kembali ke Katalog
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>

      </form>

      {/* Product Editor Modal for Add & Edit */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveProduct={handleSaveProduct}
        productToEdit={editingProduct}
        existingCategories={uniqueCategories}
      />

    </div>
  );
};
