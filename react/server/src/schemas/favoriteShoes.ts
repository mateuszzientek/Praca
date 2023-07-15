import mongoose, { Document, Model } from 'mongoose';

export interface FavoriteShoesInterface extends Document {
  userId: mongoose.Types.ObjectId;
  shoeId: mongoose.Types.ObjectId;
}

const favoriteShoeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe' },
});

const FavoriteShoes: Model<FavoriteShoesInterface> = mongoose.model<FavoriteShoesInterface>(
  'FavoriteShoes',
  favoriteShoeSchema
);

export default FavoriteShoes;