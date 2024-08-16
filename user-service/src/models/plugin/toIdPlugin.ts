import mongoose, { Schema } from 'mongoose';

// Mongoose plugin to convert _id to id
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
      delete ret._id; // Remove _id from the response
    },
  });
};

export default toIdPlugin;
