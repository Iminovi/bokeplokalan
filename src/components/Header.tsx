import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Settings, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  BookOpen, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  wishlistCount: number;
  redirectActive: boolean;
  onOpenGuide: () => void;
  isAdminAuthenticated: boolean;
  onRequestAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isSettingsOpen,
  onToggleSettings,
  wishlistCount,
  redirectActive,
  onOpenGuide,
  isAdminAuthenticated,
  onRequestAdminAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavigationTab) => {
    if (isSettingsOpen) {
      onToggleSettings(); // exit settings view to main catalog view
    }
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    if (!isAdminAuthenticated) {
      onRequestAdminAuth();
    } else {
      onToggleSettings();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fafaf9]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single-element Brand Title Wordmark */}
        <div 
          onClick={() => handleNavClick('katalog')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-sm group-hover:bg-orange-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
              KatalogKu
            </span>
            <span className="text-[10px] text-stone-600 font-medium tracking-wide">
              Belanja & Afiliasi Pilihan
            </span>
          </div>
        </div>

        {/* Zone 2: 4 Clean Navigation Links (MENU UTAMA) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNavClick('katalog')}
            className={`transition-colors text-sm font-medium relative py-1 ${
              !isSettingsOpen && currentTab === 'katalog'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600'
                : 'hover:text-stone-950'
            }`}
          >
            Katalog
          </button>

          <button
            onClick={() => handleNavClick('kategori')}
            className={`transition-colors text-sm font-medium relative py-1 ${
              !isSettingsOpen && currentTab === 'kategori'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600'
                : 'hover:text-stone-950'
            }`}
          >
            Kategori
          </button>

          <button
            onClick={() => handleNavClick('promo')}
            className={`transition-colors text-sm font-medium relative py-1 ${
              !isSettingsOpen && currentTab === 'promo'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600'
                : 'hover:text-stone-950'
            }`}
          >
            Promo & Diskon
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 hover:text-stone-950 transition-colors text-stone-600 font-medium py-1"
          >
            <BookOpen className="w-4 h-4 text-stone-600" />
            <span>Panduan Baru</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Distinct Segregated Settings Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist button */}
          <button
            onClick={() => handleNavClick('wishlist')}
            aria-label="Wishlist Produk"
            className={`p-2 rounded-lg transition-colors relative ${
              !isSettingsOpen && currentTab === 'wishlist'
                ? 'bg-stone-200 text-stone-900'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* ADMIN ACTION: Only show prominent settings button if Admin is authenticated */}
          {isAdminAuthenticated ? (
            <>
              <div className="h-5 w-px bg-stone-200 hidden sm:block" />
              <button
                onClick={handleSettingsClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isSettingsOpen
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-amber-300 ring-1 ring-amber-300/40'
                }`}
                title="Kelola pengaturan tautan afiliasi & konfigurasi sistem"
              >
                <Settings className={`w-4 h-4 ${isSettingsOpen ? 'text-amber-400 rotate-45 transition-transform' : 'text-amber-600'}`} />
                <span className="hidden sm:inline">
                  {isSettingsOpen ? 'Tutup Pengaturan' : 'Pengaturan (Admin)'}
                </span>
                {redirectActive && !isSettingsOpen && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Redirect Shopee Aktif" />
                )}
              </button>
            </>
          ) : (
            /* Subtle owner login icon (unobtrusive lock icon) */
            <button
              onClick={onRequestAdminAuth}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="Akses Pengelola (Memerlukan PIN)"
              aria-label="Akses Pengelola"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Protected Admin Access */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 space-y-4">
            
            {/* Group 1: MENU UTAMA */}
            <div>
              <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2 px-2">
                Menu Utama Belanja
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('katalog')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !isSettingsOpen && currentTab === 'katalog'
                      ? 'bg-stone-100 text-stone-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  Katalog Semua Produk
                </button>

                <button
                  onClick={() => handleNavClick('kategori')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !isSettingsOpen && currentTab === 'kategori'
                      ? 'bg-stone-100 text-stone-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-stone-500" />
                  Kategori Belanja
                </button>

                <button
                  onClick={() => handleNavClick('promo')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !isSettingsOpen && currentTab === 'promo'
                      ? 'bg-stone-100 text-stone-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-stone-500" />
                  Promo & Diskon Spesial
                </button>

                <button
                  onClick={() => handleNavClick('wishlist')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !isSettingsOpen && currentTab === 'wishlist'
                      ? 'bg-stone-100 text-stone-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-stone-500" />
                    Daftar Keinginan (Wishlist)
                  </span>
                  {wishlistCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGuide();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-stone-500" />
                  Panduan Belanja
                </button>
              </div>
            </div>

            {/* Visual Separation Line */}
            <div className="border-t border-stone-200 pt-3">
              {/* Group 2: MENU PENGATURAN SISTEM (TERKUNCI PIN JIKA BUKAN ADMIN) */}
              {isAdminAuthenticated ? (
                <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                      Area Pengelola (Admin)
                    </div>
                    <span className="text-[10px] text-amber-800 font-mono font-medium">Terbuka</span>
                  </div>
                  <p className="text-xs text-amber-900 mb-3">
                    Konfigurasi tautan Shopee, auto-redirect, dan preferensi toko.
                  </p>
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    {isSettingsOpen ? 'Tutup Panel Pengaturan' : 'Buka Pengaturan Sistem'}
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
                  <div className="text-xs text-stone-500">
                    Menu pengaturan dilindungi PIN admin
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestAdminAuth();
                    }}
                    className="text-xs font-semibold text-stone-700 hover:text-stone-950 px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 transition-colors"
                  >
                    Masuk PIN
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
