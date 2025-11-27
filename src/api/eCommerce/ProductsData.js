import { sub } from 'date-fns';
import { Chance } from 'chance';
import s11 from 'src/assets/images/products/s11.jpg';
import s12 from 'src/assets/images/products/s12.jpg';
import { http, HttpResponse } from 'msw';

const chance = new Chance();

let ProductsData = [
 


  {
    title: 'Cute Soft Teddybear',
    price: 285,
    discount: 60,
    related: false,
    salesPrice: 345,
    category: ['toys'],
    gender: 'Kids',
    rating: 3,
    stock: true,
    qty: 1,
    colors: ['#FF4842', '#1890FF', '#94D82D'],
    photo: s11,
    id: 11,
    created: sub(new Date(), { days: 1, hours: 6, minutes: 20 }),
    description: chance.paragraph({ sentences: 2 }),
  },
  {
    title: 'Little Angel Toy',
    price: 5,
    discount: 5,
    related: false,
    salesPrice: 10,
    category: ['toys'],
    gender: 'Kids',
    rating: 3,
    stock: true,
    qty: 1,
    colors: ['#1890FF', '#94D82D', '#FFC107'],
    photo: s12,
    id: 12,
    created: sub(new Date(), { days: 9, hours: 6, minutes: 20 }),
    description: chance.paragraph({ sentences: 2 }),
  },
];

export default ProductsData;

let cartItems = [];

export const Ecommercehandlers = [
  //  Mock api endpoint to get products
  http.get('/api/data/eCommerce/Produc', () => {
    try {
      return HttpResponse.json({
        status: 200,
        msg: 'Success',
        data: ProductsData,
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Failed to fetch products',
        data: error,
      });
    }
  }),
  //  Mock api endpoint to get Cart item
  http.post('/api/eCommerce/carts', async () => {
    try {
      return HttpResponse.json({ status: 200, msg: 'success', data: cartItems });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'failed', error });
    }
  }),

  // Mock endpoint to add a product to the cart
  http.post('/api/data/eCommerce/add', async ({ request }) => {
    try {
      const { productId } = (await request.json());
      const productToAdd = ProductsData.find((product) => product.id === productId);
      if (!productToAdd) {
        return HttpResponse.json({ status: 400, msg: 'Product not found' });
      }
      const isItemInCart = cartItems.find(
        (cartItem) => cartItem.id === productToAdd?.id,
      );
      if (isItemInCart) {
        // if product available in the cart then update product to cartItems state
        let newItems = cartItems.map((cartItem) =>
          cartItem.id === productToAdd?.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem,
        );
        cartItems = newItems;
      } else {
        // Add the product to cartItems state
        cartItems.push({ ...productToAdd, qty: 1 });
      }

      return HttpResponse.json({ status: 200, msg: 'Success', data: cartItems });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        data: error,
      });
    }
  }),

  // Mock endpoint to increment - decrementqty of a product in the cart
  http.put('/api/eCommerce/carts/increment-decrementqty', async ({ request }) => {
    try {
      const { id, action } = (await request.json());
      const productToAdd = ProductsData.find((product) => product.id === id);
      if (!productToAdd) {
        return HttpResponse.json({ status: 400, msg: 'Product not found' });
      }
      if (action === 'Increment') {
        let newItems = cartItems.map((cartItem) =>
          cartItem.id === productToAdd?.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem,
        );
        cartItems = newItems;
      } else {
        let newItems = cartItems.map((cartItem) =>
          cartItem.id === productToAdd?.id
            ? {
              ...cartItem,
              qty: cartItem.qty > 0 ? cartItem.qty - 1 : cartItem.qty,
            }
            : cartItem,
        );
        cartItems = newItems;
      }

      return HttpResponse.json({ status: 200, msg: 'Success', data: cartItems });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        data: error,
      });
    }
  }),

  //Mock endpoint to remove an item from the cart
  http.delete('/api/eCommerce/remove-item-carts', async ({ request }) => {
    try {
      const { id } = (await request.json());
      let remainingItems = cartItems.filter((product) => {
        return product.id !== id;
      });
      cartItems = remainingItems;
      return HttpResponse.json({ status: 200, msg: 'Success', data: cartItems });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),
];
