import React, { useState } from 'react';
import { X, Star, Check, ShoppingCart, ExternalLink, Heart, Shield, Truck, RefreshCw, Pencil } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyClick: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  isAdminAuthenticated?: boolean;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onBuyClick,
  isWishlisted,
  onToggleWishlist,
  isAdminAuthenticated,
  onEditProduct
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-lg hover:bg-stone-100 transition-colors z-10"
          aria-label="Tutup detail produk"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Left Column: Image & Badges */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Value Props & Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-stone-600 text-[11px]">
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/80">
                <Shield className="w-4 h-4 mx-auto mb-1 text-stone-700" />
                <span>100% Original</span>
              </div>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/80">
                <Truck className="w-4 h-4 mx-auto mb-1 text-stone-700" />
                <span>Gratis </span>
              </div>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/80">
                <RefreshCw className="w-4 h-4 mx-auto mb-1 text-stone-700" />
                <span>Garansi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center gap-2 text-xs text-stone-600 mb-2">
                <span className="font-semibold text-orange-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-stone-900 tabular-nums">{product.rating}</span>
                  <span className="text-stone-500">({product.reviewsCount} ulasan)</span>
                </div>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span>Terjual {product.soldCount}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Price Module */}
              <div className="mt-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-baseline gap-3">
                <div className="text-2xl font-extrabold text-stone-950 tabular-nums">
                  {formatRupiah(product.price)}
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-sm text-stone-500 line-through tabular-nums">
                    {formatRupiah(product.originalPrice)}
                  </div>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700 ml-auto">
                    Terbaru {discountPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Feature Highlights */}
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  kualitas video
                </span>
                <ul className="space-y-1 text-xs text-stone-600">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Purchase CTA and Quantity Bar */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-stone-900 tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-lg border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'bg-orange-50 border-orange-200 text-orange-600'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                  title={isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBuyClick(product);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Tonton sekarang</span>
                </button>
              </div>

              {/* Admin Quick Action */}
              {isAdminAuthenticated && onEditProduct && (
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-stone-500">Mode Pemilik Toko (Admin)</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditProduct(product);
                    }}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Pencil className="w-3 h-3 text-orange-400" />
                    <span>Edit Produk & Ganti Foto</span>
                  </button>
                </div>
              )}

              <div className="text-[11px] text-stone-500 text-center">
                
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
