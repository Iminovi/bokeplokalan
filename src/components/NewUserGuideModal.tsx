import React from 'react';
import { X, ShoppingBag, CheckCircle2, ArrowRight, Lightbulb, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

interface NewUserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplorePromo: () => void;
  onExploreCatalog: () => void;
}

export const NewUserGuideModal: React.FC<NewUserGuideModalProps> = ({
  isOpen,
  onClose,
  onExplorePromo,
  onExploreCatalog
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Tutup panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Panduan Belanja di KatalogKu
            </h2>
            <p className="text-xs text-stone-500">
              Cara mudah menemukan dan membeli produk rekomendasi terbaik
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
          KatalogKu menyajikan kurasi produk terlaris dengan diskon terbaik dari Shopee. Ikuti langkah sederhana di bawah untuk pengalaman belanja terbaik:
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          
          {/* Fitur 1 */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-2">
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              <span>1. Temukan Produk</span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Gunakan fitur pencarian dan filter kategori:
            </p>
            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Katalog:</strong> Jelajahi semua koleksi produk</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Filter Kategori:</strong> Pilih Elektronik, Fashion, dll</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Urutkan:</strong> Terlaris, Termurah, atau Rating</span>
              </li>
            </ul>
          </div>

          {/* Fitur 2 */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 transition-colors">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Beli Resmi di Shopee</span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Transaksi aman dengan jaminan resmi Shopee:
            </p>
            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Beli di Shopee:</strong> Klik langsung menuju toko resmi</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Wishlist:</strong> Simpan barang favorit untuk nanti</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span><strong>Garansi Shopee:</strong> Pembayaran dan pengiriman terjamin</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Key Takeaway */}
        <div className="mt-5 p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-xl text-xs text-orange-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <p>
            <strong>Tips Hemat:</strong> Buka menu <em>"Promo & Diskon"</em> di navigasi atas untuk melihat produk dengan potongan harga hingga 50%!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onClose();
              onExploreCatalog();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Mulai Jelajahi Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => {
              onClose();
              onExplorePromo();
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center justify-center gap-1.5 border border-stone-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Lihat Produk Promo</span>
          </button>
        </div>

      </div>
    </div>
  );
};

