import { Document, Types } from "mongoose";

// Interface định nghĩa các thông tin cần thiết cho seller
export interface IAttributes {
  category: string;
  value: string;
}

// Interface định nghĩa các thông tin cần thiết cho variation
export interface IProductVariation {
  attributes: IAttributes[];
  price: number;
  quantity: number;
  orders_count?: number;
}

// Interface định nghĩa các thông tin cần thiết cho product
export interface IProduct extends Document {
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_slug: string;
  product_type: 'electronic' | 'clothing' | 'furniture' | 'book' | 'sports' | 'beauty';
  product_user: Types.ObjectId;
  product_ratingsAverage?: number;
  images?: string[];
  isDraft?: boolean;
  isPublished?: boolean;
  product_variations: IProductVariation[];
  favorites_count?: number;
  units_sold?: number;
  total_revenue?: number;
}
