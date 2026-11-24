export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  category?: Category;
  prompt: string;
  model_used: string;
  duration: number; // in seconds
  resolution: "4K" | "1080p" | "8K";
  fps: number;
  aspect_ratio: "16:9" | "9:16" | "1:1" | "21:9";
  preview_url: string;
  thumbnail_url: string;
  r2_master_key: string;
  r2_master_file_size_mb: number;
  price: number;
  sale_price?: number;
  tags: string[];
  is_featured?: boolean;
  is_trending?: boolean;
  downloads_count: number;
  views_count: number;
  created_at: string;
}

export interface BundleItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  price: number;
  regular_price: number;
  badge?: string;
  is_featured?: boolean;
  videos?: VideoItem[];
  video_ids?: string[];
  created_at: string;
}

export interface CartItem {
  id: string;
  type: "video" | "bundle";
  title: string;
  thumbnail: string;
  price: number;
  resolution?: string;
  license_type: "standard" | "commercial" | "extended";
}

export interface Order {
  id: string;
  user_id?: string;
  customer_email: string;
  customer_name?: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  items?: CartItem[];
  created_at: string;
}

export interface UserLicense {
  id: string;
  user_id: string;
  video_id: string;
  video: VideoItem;
  order_id: string;
  license_key: string;
  license_type: string;
  downloads_remaining: number;
  created_at: string;
}
