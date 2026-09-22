export type NavigationTab = 'katalog' | 'kategori' | 'promo' | 'panduan' | 'wishlist';

export type SettingsTab = 'produk' | 'afiliasi' | 'tampilan' | 'keamanan' | 'panduan_admin';

export type RedirectMode = 'first_interaction' | 'product_click' | 'manual_only';

export interface AdminSecurityConfig {
  pin: string;
  stealthMode: boolean; // if true, hide footer link and require secret click
}

export interface RedirectConfig {
  enabled: boolean;
  targetUrl: string;
  mode: RedirectMode;
  openInNewTab: boolean;
  showToastNotification: boolean;
  customAffiliateCode: string;
}

export interface CatalogPreferences {
  viewMode: 'grid' | 'compact';
  showDiscountBadge: boolean;
  showRating: boolean;
  sortBy: 'popular' | 'lowest_price' | 'highest_price' | 'rating';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  image: string;
  badge?: string;
  isPromo?: boolean;
  description: string;
  features: string[];
  stock: number;
  shopeeUrl: string;
}
