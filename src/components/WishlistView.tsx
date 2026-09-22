import React from 'react';
import { Heart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onClearWishlist: () => void;
  onOpenDetail: (product: Product) => void;
  onBuyClick: (product: Product) => void;
  onBackToCatalog: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  onRemoveFromWishlist,
  onClearWishlist,
  onOpenDetail,
  onBuyClick,
  onBackToCatalog
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Produk</span>
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Daftar Keinginan (Wishlist)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
              {wishlist.length} Produk Disimpan
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Produk favorit yang Anda tandai selama menjelajahi Menu Utama.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={onClearWishlist}
            className="text-xs font-semibold text-stone-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua Wishlist</span>
          </button>
        )}
      </div>

      {/* Content */}
      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 mt-6 max-w-md mx-auto p-6">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-1">
            Belum Ada Produk di Wishlist
          </h3>
          <p className="text-xs text-stone-500 mb-5 leading-relaxed">
            Jelajahi Menu Utama Katalog dan klik ikon hati pada produk yang Anda sukai untuk menyimpannya di sini.
          </p>
          <button
            onClick={onBackToCatalog}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Jelajahi Katalog Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-stone-400 transition-all p-4 space-y-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  onClick={() => onOpenDetail(item)}
                  className="w-20 h-20 rounded-lg object-cover bg-stone-100 cursor-pointer shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h4
                    onClick={() => onOpenDetail(item)}
                    className="text-xs font-bold text-stone-900 truncate hover:text-orange-600 cursor-pointer mt-0.5"
                  >
                    {item.name}
                  </h4>
                  <div className="mt-1 text-sm font-bold text-stone-950 tabular-nums">
                    {formatRupiah(item.price)}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onRemoveFromWishlist(item)}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBuyClick(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors flex items-center gap-1"
                >
                  <span>Beli di Shopee</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
