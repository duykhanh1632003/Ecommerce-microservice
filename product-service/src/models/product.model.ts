// src/models/user.model.ts
import mongoose, { Schema } from 'mongoose';
import toIdPlugin from './plugin/toIdPlugin';
import { IAttributes, IProduct,IProductVariation } from '../interfaces/product.interface';
import slugify from "slugify";

const attributeSchema = new Schema<IAttributes>({
  category: { type: String, required: true },
  value: { type: String, required: true },
});

// Schema định nghĩa cho product variation
const productVariationSchema = new Schema<IProductVariation>({
  attributes: { type: [attributeSchema], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  orders_count: { type: Number, default: 0 },
});

// Schema định nghĩa cho product
const productSchema = new Schema<IProduct>(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_type: {
      type: String,
      required: true,
      enum: ["electronic", "clothing", "furniture", "book", "sports", "beauty"],
    },
    product_user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    images: [{ type: String }],
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    product_variations: { type: [productVariationSchema], required: true },
    favorites_count: { type: Number, default: 0 },
    units_sold: { type: Number, default: 0 },
    total_revenue: { type: Number, default: 0 },
  },
);

// Middleware để tạo slug từ product_name trước khi lưu vào database
productSchema.pre<IProduct>("save", function (next) {
  if (!this.product_slug) {
    this.product_slug = slugify(this.product_name, { lower: true });
  }
  next();
});

productSchema.plugin(toIdPlugin)

// Tạo index cho product_name và product_description để hỗ trợ tìm kiếm
productSchema.index({ product_name: "text", product_description: "text" });


export const Product = mongoose.model<IProduct>('User', productSchema);
