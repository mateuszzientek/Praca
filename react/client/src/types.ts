export interface ErrorInterface {
  msg: string;
  type: string;
  value: string;
  path: string;
  location: string;
}

export interface AddressInterface {
  _id: string;
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

interface Address extends AddressInterface {
  email: string;
}

interface Products {
  _id: string;
  shoeId: string;
  size: string;
  quantity: number;
}

export interface OrderInterface {
  _id: string;
  orderNumber: string;
  userId: string;
  address: Address;
  products: Products[];
  price: number;
  paymentMethod: string;
  deliveryMethod: string;
  orderDate: Date;
  status: string;
  discount: number
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
