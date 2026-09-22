import { Product } from '../types';
import smartwatchImg from '../assets/images/smartwatch_oled_black_1790105508170.jpg';
import twsImg from '../assets/images/tws_earbuds_case_1790105524294.jpg';
import shirtImg from '../assets/images/oversized_linen_shirt_1790105539917.jpg';
import tumblerImg from '../assets/images/tumbler_vacuum_flask_1790105552059.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Smartwatch Sport OLED Series Ultra Waterproof',
    category: 'Elektronik',
    price: 329000,
    originalPrice: 659000,
    rating: 4.9,
    reviewsCount: 1420,
    soldCount: '3.8rb',
    image: smartwatchImg,
    badge: 'Diskon 50%',
    isPromo: true,
    description: 'Smartwatch generasi terbaru dengan panel layar AMOLED jernih, sensor detak jantung presisi tinggi 24 jam, ketahanan air IP68, dan daya tahan baterai hingga 14 hari pemakaian aktif.',
    features: [
      'Layar AMOLED 1.43 inci Always-on Display',
      'Waterproof IP68 tahan renang hingga 30m',
      '100+ mode olahraga otomatis',
      'Notifikasi panggilan dan chat WhatsApp langsung'
    ],
    stock: 45,
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'prod-2',
    name: 'TWS Wireless Earbuds Pro Bass Low-Latency Bluetooth 5.4',
    category: 'Elektronik',
    price: 169000,
    originalPrice: 380000,
    rating: 4.8,
    reviewsCount: 2890,
    soldCount: '7.2rb',
    image: twsImg,
    badge: 'Terlaris',
    isPromo: true,
    description: 'Earphone nirkabel ergonomis dengan acoustic driver 13mm bertenaga bass dalam. Dilengkapi active noise reduction dan mode latensi rendah 40ms khusus gaming dan nonton film.',
    features: [
      'Bluetooth 5.4 stabil tanpa jeda audio',
      'ENC Dual Microphone suara telepon jernih',
      'Total baterai 36 jam bersama case pengisi daya',
      'Kontrol sentuh pintar (Smart Touch Control)'
    ],
    stock: 120,
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'prod-3',
    name: 'Kemeja Casual Linen Katun Premium Relaxed Fit',
    category: 'Fashion',
    price: 139000,
    originalPrice: 220000,
    rating: 4.7,
    reviewsCount: 890,
    soldCount: '1.9rb',
    image: shirtImg,
    badge: 'Koleksi Baru',
    isPromo: false,
    description: 'Kemeja santai bahan perpaduan katun linen organik adem, menyerap keringat, dan tidak mudah kusut. Potongan relaxed fit kasual modern cocok untuk acara kerja santai maupun hangout akhir pekan.',
    features: [
      'Bahan organic linen cotton ultra breathable',
      'Jahitan rapi standar garment ekspor',
      'Kancing corak marmer tahan cuci',
      'Tersedia ukuran M, L, XL, XXL'
    ],
    stock: 68,
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'prod-4',
    name: 'Tumbler Vacuum Insulated Stainless Steel 800ml',
    category: 'Gaya Hidup',
    price: 95000,
    originalPrice: 159000,
    rating: 4.9,
    reviewsCount: 3100,
    soldCount: '5.5rb',
    image: tumblerImg,
    badge: 'Diskon 40%',
    isPromo: true,
    description: 'Botol minum insulasi ganda SUS 304 food-grade yang mampu menjaga suhu minuman dingin hingga 24 jam dan minuman panas hingga 12 jam. Desain minimalis anti bocor dan ergonomis.',
    features: [
      'Double-wall vacuum insulation SUS 304',
      'Tutup seal silikon 100% anti tumpah',
      'Lapisan powder coating doff tahan goresan',
      'BPA Free aman untuk kesehatan'
    ],
    stock: 84,
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'prod-5',
    name: 'Tas Ransel Laptop Minimalis Workpack Waterproof 20L',
    category: 'Fashion',
    price: 198000,
    originalPrice: 349000,
    rating: 4.8,
    reviewsCount: 650,
    soldCount: '1.4rb',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    badge: 'Favorit',
    isPromo: false,
    description: 'Tas ransel komuter dengan kompartemen khusus laptop hingga 15.6 inci berlapis busa tebal. Dilengkapi port USB eksternal dan saku tersembunyi untuk keamanan dompet & smartphone.',
    features: [
      'Bahan Cordura Bimodal Water-Repellent',
      'Busa punggung air-mesh empuk sirkulasi udara',
      'Tali koper (luggage strap) di bagian belakang',
      'Kapasitas luas 20 liter untuk dokumen & baju'
    ],
    stock: 35,
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'prod-6',
    name: 'Kacamata Polarized Retro Aviator Anti UV400',
    category: 'Aksesoris',
    price: 79000,
    originalPrice: 160000,
    rating: 4.7,
    reviewsCount: 1120,
    soldCount: '4.1rb',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    badge: 'Flash Sale',
    isPromo: true,
    description: 'Kacamata hitam dengan lensa polarized 9 lapis perlindungan UV400 untuk menyaring silau matahari dan pantulan jalan saat berkendara. Bingkai titanium ringan dan kuat.',
    features: [
      'Lensa TAC Polarized 100% UV Protection',
      'Bingkai magnesium alloy anti korosi',
      'Nosepad silikon lembut tidak meninggalkan bekas',
      'Termasuk hardcase eksklusif dan lap microfiber'
    ],
    stock: 90,
    shopeeUrl: 'https://shopee.co.id'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Semua Produk' },
  { id: 'Elektronik', label: 'Elektronik' },
  { id: 'Fashion', label: 'Fashion' },
  { id: 'Aksesoris', label: 'Aksesoris' },
  { id: 'Gaya Hidup', label: 'Gaya Hidup' },
] as const;
