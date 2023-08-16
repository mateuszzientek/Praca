export interface ErrorInterface {
  msg: string;
  type: string;
  value: string;
  path: string;
  location: string;
}

export interface AddressInterface {
  _id: string;
  email: string;
  name: string;
  surname: string;
  street: string;
  city: string;
  postalCode: string;
  telephone: string;
  extra: string;
  isDefault: boolean;
  country: string;
}

export interface SizesInterface {
  size: string;
  quantity: number;
}

export interface ShoeInterface {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  sizes: SizesInterface[];
  discountPrice: number;
  image: string;
  imageUrl?: string;
  isHearted: boolean;
}

export interface ProductInterface {
  _id: string;
  shoe: ShoeInterface;
  size: string;
  quantity: number;
  imageUrl?: string;
}
