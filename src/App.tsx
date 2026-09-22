/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Lock,
  Shield
} from 'lucide-react';
import { 
  Product, 
  NavigationTab, 
  RedirectConfig, 
  CatalogPreferences,
  AdminSecurityConfig 
} from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './data/products';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SettingsPanel } from './components/SettingsPanel';
import { NewUserGuideModal } from './components/NewUserGuideModal';
import { OnboardingBanner } from './components/OnboardingBanner';
import { WishlistView } from './components/WishlistView';
import { AdminBar } from './components/AdminBar';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ProductEditorModal } from './components/ProductEditorModal';

const DEFAULT_REDIRECT_CONFIG: RedirectConfig = {
  enabled: true,
  targetUrl: 'https://shopee.co.id',
  mode: 'first_interaction',
  openInNewTab: true,
  showToastNotification: true,
  customAffiliateCode: ''
};

const DEFAULT_PREFERENCES: CatalogPreferences = {
  viewMode: 'grid',
  showDiscountBadge: true,
  showRating: true,
  sortBy: 'popular'
};

const DEFAULT_ADMIN_CONFIG: AdminSecurityConfig = {
  pin: '1234',
  stealthMode: false
};

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('katalog');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(() => {
    return localStorage.getItem('katalogku_banner_dismissed') !== 'true';
  });

  // Admin Security & Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('katalogku_admin_auth') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [adminConfig, setAdminConfig] = useState<AdminSecurityConfig>(() => {
    const saved = localStorage.getItem('katalogku_admin_security');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load admin security config', e);
      }
    }
    return DEFAULT_ADMIN_CONFIG;
  });

  // Secret 3-click trigger ref for stealth admin access
  const secretClickCountRef = useRef(0);
  const secretClickTimerRef = useRef<any>(null);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products State (Persisted in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('katalogku_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to load products from localStorage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Direct editing state for admin quick edit in catalog
  const [directEditingProduct, setDirectEditingProduct] = useState<Product | null>(null);
  const [isDirectEditorOpen, setIsDirectEditorOpen] = useState(false);

  // Settings State (Persisted)
  const [redirectConfig, setRedirectConfig] = useState<RedirectConfig>(() => {
    const saved = localStorage.getItem('katalogku_redirect_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load redirect config', e);
      }
    }
    return DEFAULT_REDIRECT_CONFIG;
  });

  const [preferences, setPreferences] = useState<CatalogPreferences>(() => {
    const saved = localStorage.getItem('katalogku_catalog_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load preferences', e);
      }
    }
    return DEFAULT_PREFERENCES;
  });

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('katalogku_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load wishlist', e);
      }
    }
    return [];
  });

  // Redirect Trigger State
  const [hasTriggeredRedirect, setHasTriggeredRedirect] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update products in state and localStorage
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('katalogku_products', JSON.stringify(newProducts));
    
    // Also update selectedProduct if it was modified
    if (selectedProduct) {
      const updated = newProducts.find((p) => p.id === selectedProduct.id);
      if (updated) {
        setSelectedProduct(updated);
      }
    }
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem('katalogku_products', JSON.stringify(INITIAL_PRODUCTS));
    showToast('Katalog produk berhasil dikembalikan ke 6 produk bawaan.');
  };

  const handleAdminQuickEdit = (product: Product) => {
    setDirectEditingProduct(product);
    setIsDirectEditorOpen(true);
  };

  const handleSaveDirectProduct = (savedProduct: Product) => {
    const exists = products.some((p) => p.id === savedProduct.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      showToast(`Produk "${savedProduct.name.slice(0, 20)}..." berhasil diperbarui!`);
    } else {
      updated = [savedProduct, ...products];
      showToast(`Produk baru "${savedProduct.name.slice(0, 20)}..." berhasil ditambahkan!`);
    }
    handleUpdateProducts(updated);
  };

  // Save configs to localStorage
  const handleUpdateRedirectConfig = (newConfig: RedirectConfig) => {
    setRedirectConfig(newConfig);
    localStorage.setItem('katalogku_redirect_config', JSON.stringify(newConfig));
  };

  const handleUpdatePreferences = (newPref: CatalogPreferences) => {
    setPreferences(newPref);
    localStorage.setItem('katalogku_catalog_preferences', JSON.stringify(newPref));
  };

  const handleUpdateAdminConfig = (newConfig: AdminSecurityConfig) => {
    setAdminConfig(newConfig);
    localStorage.setItem('katalogku_admin_security', JSON.stringify(newConfig));
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('katalogku_admin_auth', 'true');
    setIsSettingsOpen(true);
    showToast('Akses Pengelola terbuka. Selamat datang Admin!');
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('katalogku_admin_auth');
    setIsSettingsOpen(false);
    showToast('Sesi Pengelola dikunci. Menu pengaturan kini aman dari pengguna biasa.');
  };

  const handleToggleSettings = () => {
    if (!isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
    } else {
      setIsSettingsOpen((prev) => !prev);
    }
  };

  const handleSecretAdminTrigger = () => {
    secretClickCountRef.current += 1;
    if (secretClickCountRef.current >= 3) {
      secretClickCountRef.current = 0;
      setIsAdminAuthModalOpen(true);
    } else {
      clearTimeout(secretClickTimerRef.current);
      secretClickTimerRef.current = setTimeout(() => {
        secretClickCountRef.current = 0;
      }, 1500);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('katalogku_banner_dismissed', 'true');
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Global Interaction Redirect Listener (Popunder / First Interaction)
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Do not intercept if in settings view or if target is inside modal/dialog
      if (isSettingsOpen || isGuideOpen || selectedProduct) {
        return;
      }

      // Check if redirect is enabled and in first_interaction mode
      if (
        redirectConfig.enabled &&
        redirectConfig.mode === 'first_interaction' &&
        !hasTriggeredRedirect
      ) {
        // Prevent redirecting if user is clicking explicit navigation or settings buttons
        const target = event.target as HTMLElement | null;
        if (target && target.closest('button, input, select, textarea, a')) {
          // allow the immediate button action, but still trigger background redirect if desired
        }

        setHasTriggeredRedirect(true);

        if (redirectConfig.showToastNotification) {
          showToast('Membuka tautan rekomendasi Shopee di tab baru...');
        }

        const destination = redirectConfig.targetUrl || 'https://shopee.co.id';
        window.open(destination, redirectConfig.openInNewTab ? '_blank' : '_self');
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [
    isSettingsOpen,
    isGuideOpen,
    selectedProduct,
    redirectConfig,
    hasTriggeredRedirect,
    showToast
  ]);

  // Wishlist handler
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = prev.filter((p) => p.id !== product.id);
        showToast(`"${product.name.slice(0, 24)}..." dihapus dari Wishlist.`);
      } else {
        updated = [...prev, product];
        showToast(`"${product.name.slice(0, 24)}..." ditambahkan ke Wishlist!`);
      }
      localStorage.setItem('katalogku_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('katalogku_wishlist');
    showToast('Seluruh daftar wishlist telah dikosongkan.');
  };

  // Buy action (affiliate redirect)
  const handleBuyProduct = (product: Product) => {
    const destination = redirectConfig.enabled && redirectConfig.targetUrl
      ? redirectConfig.targetUrl
      : product.shopeeUrl;

    if (redirectConfig.showToastNotification) {
      showToast(`Membuka "${product.name.slice(0, 25)}..." di Shopee...`);
    }

    window.open(destination, redirectConfig.openInNewTab ? '_blank' : '_self');
  };

  // Dynamic category list derived from active products
  const categoriesList = useMemo(() => {
    const customCats = Array.from(new Set(products.map((p) => p.category)));
    return [
      { id: 'all', label: 'Semua Produk' },
      ...customCats.map((cat) => ({ id: cat, label: cat }))
    ];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Tab filter
      if (currentTab === 'promo' && !prod.isPromo) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(query);
        const matchCat = prod.category.toLowerCase().includes(query);
        const matchDesc = prod.description.toLowerCase().includes(query);
        return matchName || matchCat || matchDesc;
      }
      return true;
    }).sort((a, b) => {
      if (preferences.sortBy === 'lowest_price') return a.price - b.price;
      if (preferences.sortBy === 'highest_price') return b.price - a.price;
      if (preferences.sortBy === 'rating') return b.rating - a.rating;
      // Default: popular
      return b.reviewsCount - a.reviewsCount;
    });
  }, [products, currentTab, selectedCategory, searchQuery, preferences.sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-800">
      
      {/* Top Bar for Authenticated Admin Session */}
      {isAdminAuthenticated && (
        <AdminBar
          isSettingsOpen={isSettingsOpen}
          onToggleSettings={handleToggleSettings}
          onLockAdmin={handleLockAdmin}
          redirectEnabled={redirectConfig.enabled}
        />
      )}

      {/* Informative Onboarding Banner for New Users */}
      {showBanner && !isSettingsOpen && (
        <OnboardingBanner
          onOpenGuide={() => setIsGuideOpen(true)}
          onDismiss={handleDismissBanner}
        />
      )}

      {/* Main App Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsSettingsOpen(false);
          setCurrentTab(tab);
        }}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={handleToggleSettings}
        wishlistCount={wishlist.length}
        redirectActive={redirectConfig.enabled}
        onOpenGuide={() => setIsGuideOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        onRequestAdminAuth={() => setIsAdminAuthModalOpen(true)}
      />

      {/* MAIN VIEW SWITCHER: MENU UTAMA vs MENU PENGATURAN */}
      <main className="flex-grow">
        {isSettingsOpen ? (
          /* ========================================================================= */
          /* DEDICATED SETTINGS SCREEN (Protected by Admin PIN)                        */
          /* ========================================================================= */
          isAdminAuthenticated ? (
            <SettingsPanel
              products={products}
              onUpdateProducts={handleUpdateProducts}
              onResetProducts={handleResetProducts}
              redirectConfig={redirectConfig}
              onUpdateRedirectConfig={handleUpdateRedirectConfig}
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              adminConfig={adminConfig}
              onUpdateAdminConfig={handleUpdateAdminConfig}
              onBackToMain={() => setIsSettingsOpen(false)}
              onResetTrigger={() => setHasTriggeredRedirect(false)}
              onLockAdmin={handleLockAdmin}
              hasTriggered={hasTriggeredRedirect}
              onShowToast={showToast}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-stone-200 text-center shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">Akses Pengaturan Terkunci</h2>
              <p className="text-xs text-stone-500">
                Menu ini dilindungi dengan PIN untuk mencegah pengunjung biasa mengubah tautan toko dan konfigurasi afiliasi.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setIsAdminAuthModalOpen(true)}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Masukkan PIN Pengelola
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Kembali ke Katalog
                </button>
              </div>
            </div>
          )
        ) : currentTab === 'wishlist' ? (
          /* ========================================================================= */
          /* WISHLIST VIEW (Part of Menu Utama)                                        */
          /* ========================================================================= */
          <WishlistView
            wishlist={wishlist}
            onRemoveFromWishlist={handleToggleWishlist}
            onClearWishlist={handleClearWishlist}
            onOpenDetail={(prod) => setSelectedProduct(prod)}
            onBuyClick={handleBuyProduct}
            onBackToCatalog={() => setCurrentTab('katalog')}
          />
        ) : (
          /* ========================================================================= */
          /* MENU UTAMA: SHOPPING & PRODUCT CATALOG                                    */
          /* ========================================================================= */
          <div className="pb-16">
            
            {/* Storefront Hero Showcase */}
            <section className="border-b border-stone-200 bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                
                {/* Visual Label */}
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Bokep Lokal Pilihan & Rekomendasi Resmi</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight max-w-2xl mx-auto">
                  Temukan Bokep Favorit Kualitas Terbaik
                </h1>

                <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                  Koleksi terbaru dari banyak pilihan langsung tonton.
                </p>

                {/* Instant Search Bar */}
                <div className="pt-3 max-w-xl mx-auto">
                  <div className="relative flex items-center shadow-xs">
                    <Search className="w-4 h-4 text-stone-400 absolute left-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari bokep percakapan"
                      className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        aria-label="Hapus kata kunci pencarian"
                        className="absolute right-3.5 text-stone-400 hover:text-stone-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </section>

            {/* Category Filter Bar (Functional Segmented Tabs) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                
                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Info & Sort By */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500">
                  <span>
                    Menampilkan <strong className="text-stone-900 font-bold tabular-nums">{filteredProducts.length}</strong> video
                  </span>

                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                    <select
                      value={preferences.sortBy}
                      onChange={(e) =>
                        handleUpdatePreferences({
                          ...preferences,
                          sortBy: e.target.value as any
                        })
                      }
                      className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 font-medium focus:outline-none"
                    >
                      <option value="popular">Paling Laris</option>
                      <option value="lowest_price">Bokep Terbaru</option>
                      <option value="highest_price">Bokep Terdahulu</option>
                      <option value="rating">Rating Tertinggi</option>
                    </select>
                  </div>
                </div>

              </div>
            </section>

            {/* Product Catalog Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-stone-300 max-w-md mx-auto p-6">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-800 mb-1">
                    Video Tidak Ditemukan
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Tidak ada video yang cocok dengan pencarian kata kunci atau filter yang dipilih.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setCurrentTab('katalog');
                    }}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Reset Filter Pencarian
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-4 sm:gap-6 ${
                    preferences.viewMode === 'compact'
                      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlist.some((p) => p.id === product.id);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={isWishlisted}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenDetail={(prod) => setSelectedProduct(prod)}
                        onBuyClick={handleBuyProduct}
                        preferences={preferences}
                        isAdminAuthenticated={isAdminAuthenticated}
                        onEditProduct={handleAdminQuickEdit}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* Shopper Assurance & Guide Card (No admin buttons exposed to customers) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="bg-stone-100/80 rounded-2xl p-6 sm:p-8 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-stone-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Jaminan Aman & video Terpilih</span>
                  </div>
                  <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                    
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsGuideOpen(true)}
                    className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition-colors shadow-xs"
                  >
                    Baca Panduan 
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentTab('promo');
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Jelajahi video</span>
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyClick={handleBuyProduct}
        isWishlisted={selectedProduct ? wishlist.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isAdminAuthenticated={isAdminAuthenticated}
        onEditProduct={handleAdminQuickEdit}
      />

      {/* Admin Direct Product Editor Modal */}
      <ProductEditorModal
        isOpen={isDirectEditorOpen}
        onClose={() => {
          setIsDirectEditorOpen(false);
          setDirectEditingProduct(null);
        }}
        onSaveProduct={handleSaveDirectProduct}
        productToEdit={directEditingProduct}
        existingCategories={Array.from(new Set(products.map((p) => p.category)))}
      />

      {/* New User Guide Modal */}
      <NewUserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onExplorePromo={() => {
          setIsGuideOpen(false);
          setSelectedCategory('all');
          setCurrentTab('promo');
        }}
        onExploreCatalog={() => {
          setIsGuideOpen(false);
          setCurrentTab('katalog');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-stone-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Clean Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div 
            onClick={handleSecretAdminTrigger}
            className="flex items-center justify-center gap-2 font-bold text-stone-900 select-none cursor-pointer"
            title="KatalogKu"
          >
            <ShoppingBag className="w-4 h-4 text-orange-600" />
            <span>KoleksiKu</span>
          </div>
          <p className="text-stone-500">
            Katalog bokep pilihan.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-stone-400">
            <span 
              onClick={handleSecretAdminTrigger} 
              className="select-none cursor-default"
              title="KatalogKu"
            >
              &copy; {new Date().getFullYear()} Bokepku. Hak cipta dilindungi.
            </span>

            {/* Discreet Admin Link (Visible only if stealth mode is disabled) */}
            {!adminConfig.stealthMode && (
              <>
                <span>•</span>
                <button
                  onClick={() => {
                    if (isAdminAuthenticated) {
                      setIsSettingsOpen(true);
                    } else {
                      setIsAdminAuthModalOpen(true);
                    }
                  }}
                  className="hover:text-stone-700 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                  title="Akses Pengelola (Memerlukan PIN)"
                >
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>{isAdminAuthenticated ? 'Pengaturan Toko' : 'Akses Pengelola'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Admin PIN Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        correctPin={adminConfig.pin}
      />

    </div>
  );
}
