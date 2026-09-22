import React from 'react';
import { Lightbulb, ArrowRight, X } from 'lucide-react';

interface OnboardingBannerProps {
  onOpenGuide: () => void;
  onDismiss: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  onOpenGuide,
  onDismiss
}) => {
  return (
    <div className="bg-stone-900 text-white px-4 py-3 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-stone-200">
            <strong className="text-white">Selamat Datang di KatalogKu:</strong> Temukan produk rekomendasi terlaris dengan diskon terbaik, garansi resmi langsung dari Shopee.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenGuide}
            className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 underline underline-offset-2"
          >
            <span>Panduan Belanja</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          
          <button
            onClick={onDismiss}
            aria-label="Tutup pemberitahuan"
            className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
