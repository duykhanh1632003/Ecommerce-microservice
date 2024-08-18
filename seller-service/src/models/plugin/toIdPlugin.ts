import mongoose, { Schema } from 'mongoose';

// Mongoose plugin to convert _id to id and filter out unnecessary fields
const toIdPlugin = (schema: Schema) => {
  // Add a virtual id field
  schema.virtual('id').get(function () {
    return (this._id as mongoose.Types.ObjectId).toHexString();
  });

  // Ensure that the virtual field is included in JSON responses
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      // Remove unnecessary fields
      delete ret._id;
      delete ret.password;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
    },
  });
};

export default toIdPlugin;
