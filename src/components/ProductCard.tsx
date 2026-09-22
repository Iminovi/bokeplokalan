import React, { useState } from 'react';
import { Heart, Star, ExternalLink, ArrowRight, Pencil } from 'lucide-react';
import { Product, CatalogPreferences } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onBuyClick: (product: Product) => void;
  preferences: CatalogPreferences;
  isAdminAuthenticated?: boolean;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
  onBuyClick,
  preferences,
  isAdminAuthenticated,
  onEditProduct
}) => {
  const [imgError, setImgError] = useState(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all duration-200 relative">
      
      {/* Top Image Container */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
      >
        {/* Admin Quick Edit Button */}
        {isAdminAuthenticated && onEditProduct && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="absolute top-2.5 left-2.5 z-20 px-2 py-1 bg-stone-950/90 hover:bg-orange-600 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-md transition-colors"
            title="Edit deskripsi, ganti foto, dan ubah harga"
          >
            <Pencil className="w-2.5 h-2.5" />
            <span>Edit Produk</span>
          </button>
        )}

        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-100 text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              {product.category}
            </span>
            <span className="text-xs text-stone-600 line-clamp-2">{product.name}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-950'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Promo tag text (Subtle text tag, strictly no excessive pill clutter) */}
        {preferences.showDiscountBadge && product.isPromo && discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide">
            Hemat {discountPercent}%
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        
        {/* Zero-Pill Metadata Line */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-1">
            <span className="font-medium tracking-wide text-orange-700">{product.category}</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>Terjual {product.soldCount}</span>
            {preferences.showRating && (
              <>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="flex items-center gap-0.5 font-medium text-stone-700">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="tabular-nums">{product.rating}</span>
                </span>
              </>
            )}
          </div>

          <h3 
            onClick={() => onOpenDetail(product)}
            className="text-sm font-semibold text-stone-900 line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between gap-2">
          <div>
            <div className="text-base font-bold text-stone-950 tabular-nums">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-stone-500 line-through tabular-nums">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onBuyClick(product)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-orange-600 transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Beli</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
