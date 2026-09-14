import { products } from '@/data/products';
import { Product, CartItem } from '@/types';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export interface SearchProductsParams {
  query?: string;
  category?: 'Men' | 'Women' | 'Shoes' | 'Accessories' | string;
  maxPrice?: number;
  color?: string;
  size?: string;
  minRating?: number;
  sortBy?: 'rating' | 'price-asc' | 'price-desc' | 'relevance';
}

export interface GetProductDetailsParams {
  productId?: string;
  productName?: string;
}

export interface CheckAvailabilityParams {
  productId?: string;
  productName?: string;
  size?: string;
  color?: string;
}

export interface AddToCartParams {
  productId?: string;
  productName?: string;
  size?: string;
  color?: string;
  quantity?: number;
}

export const agentToolDefinitions: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description: 'Search the Avira product catalog using natural-language queries and multi-dimensional filters such as category, maximum price in INR, color, size, or minimum rating.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Keywords to match against product title, description, or style (e.g. "sneakers", "midi dress", "blazer", "black shoes").'
          },
          category: {
            type: 'string',
            enum: ['Men', 'Women', 'Shoes', 'Accessories'],
            description: 'Filter strictly by category.'
          },
          maxPrice: {
            type: 'number',
            description: 'Maximum price threshold in Indian Rupees (INR ₹), e.g. 2000, 2500, 3000.'
          },
          color: {
            type: 'string',
            description: 'Desired color filter (e.g. "Black", "Red", "Navy", "Crimson").'
          },
          size: {
            type: 'string',
            description: 'Desired size filter (e.g. "8", "M", "S", "10").'
          },
          minRating: {
            type: 'number',
            description: 'Minimum customer star rating (e.g. 4.5).'
          },
          sortBy: {
            type: 'string',
            enum: ['rating', 'price-asc', 'price-desc'],
            description: 'Sort criteria for matching results.'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getProductDetails',
      description: 'Look up full detailed product information for a specific product by its ID or product name.',
      parameters: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'Unique identifier of the product (e.g. "prod-shoes-01").'
          },
          productName: {
            type: 'string',
            description: 'Exact or partial name of the product (e.g. "Urban Black Sneakers", "Crimson Midi Dress").'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'checkProductAvailability',
      description: 'Verify if a product variant (specific size and/or color) is currently in stock, and retrieve exact inventory quantity.',
      parameters: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'Unique product ID.'
          },
          productName: {
            type: 'string',
            description: 'Product name to check.'
          },
          size: {
            type: 'string',
            description: 'Size to check for availability (e.g. "8", "M", "L").'
          },
          color: {
            type: 'string',
            description: 'Color variant to check (e.g. "Black", "Red").'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'addToCart',
      description: 'Add a specific product, size, color, and quantity to the user shopping cart. Automatically selects default available size/color if not provided.',
      parameters: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'Unique ID of the product to add.'
          },
          productName: {
            type: 'string',
            description: 'Product name if product ID is unknown.'
          },
          size: {
            type: 'string',
            description: 'Size choice (e.g. "8", "M", "L"). Defaults to first available if omitted.'
          },
          color: {
            type: 'string',
            description: 'Color choice. Defaults to primary color if omitted.'
          },
          quantity: {
            type: 'number',
            description: 'Quantity to add (default is 1).'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getCart',
      description: 'Retrieve current shopping cart contents, line items, and total price in INR (₹).',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  }
];

// Helper: Normalize strings for fuzzy matching
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

// Helper: Find product by ID or Name
export function findProduct(idOrName?: string): Product | undefined {
  if (!idOrName) return undefined;
  const target = idOrName.toLowerCase().trim();

  // Exact ID match
  const byId = products.find(p => p.id.toLowerCase() === target);
  if (byId) return byId;

  // Exact name match
  const byExactName = products.find(p => p.name.toLowerCase() === target);
  if (byExactName) return byExactName;

  // Fuzzy substring match
  const normTarget = normalize(idOrName);
  return products.find(p => normalize(p.name).includes(normTarget) || normTarget.includes(normalize(p.name)));
}

// Tool Implementation 1: searchProducts
export function searchProducts(params: SearchProductsParams): { count: number; products: Product[] } {
  let matched = [...products];

  if (params.category && params.category !== 'All') {
    const cat = params.category.toLowerCase();
    matched = matched.filter(p => p.category.toLowerCase() === cat);
  }

  if (params.query) {
    const tokens = params.query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);
    matched = matched.filter(p => {
      const searchTarget = `${p.name} ${p.description} ${p.brand} ${p.category} ${p.tag || ''} ${p.availableColors.join(' ')} ${p.details?.join(' ') || ''}`.toLowerCase();
      return tokens.every(token => searchTarget.includes(token));
    });
  }

  if (params.maxPrice !== undefined && params.maxPrice !== null) {
    matched = matched.filter(p => p.price <= params.maxPrice!);
  }

  if (params.minRating !== undefined && params.minRating !== null) {
    matched = matched.filter(p => p.rating >= params.minRating!);
  }

  if (params.color) {
    const c = params.color.toLowerCase().trim();
    matched = matched.filter(p =>
      p.availableColors.some(color => color.toLowerCase().includes(c) || c.includes(color.toLowerCase()))
    );
  }

  if (params.size) {
    const s = params.size.toLowerCase().trim();
    matched = matched.filter(p =>
      p.availableSizes.some(size => size.toLowerCase() === s)
    );
  }

  // Sorting
  if (params.sortBy === 'rating') {
    matched.sort((a, b) => b.rating - a.rating);
  } else if (params.sortBy === 'price-asc') {
    matched.sort((a, b) => a.price - b.price);
  } else if (params.sortBy === 'price-desc') {
    matched.sort((a, b) => b.price - a.price);
  }

  return {
    count: matched.length,
    products: matched
  };
}

// Tool Implementation 2: getProductDetails
export function getProductDetails(params: GetProductDetailsParams): { found: boolean; product?: Product; error?: string } {
  const query = params.productId || params.productName;
  if (!query) {
    return { found: false, error: 'Please provide a productId or productName.' };
  }

  const product = findProduct(query);
  if (!product) {
    return { found: false, error: `Product "${query}" was not found in the Avira catalog.` };
  }

  return {
    found: true,
    product
  };
}

// Tool Implementation 3: checkProductAvailability
export function checkProductAvailability(params: CheckAvailabilityParams): {
  found: boolean;
  available: boolean;
  productName?: string;
  stockQuantity?: number;
  requestedSize?: string;
  sizeAvailable?: boolean;
  availableSizes?: string[];
  requestedColor?: string;
  colorAvailable?: boolean;
  availableColors?: string[];
  price?: number;
  message: string;
} {
  const query = params.productId || params.productName;
  const product = findProduct(query);

  if (!product) {
    return {
      found: false,
      available: false,
      message: `Product "${query || 'Unknown'}" was not found in our catalog.`
    };
  }

  const sizeReq = params.size ? params.size.trim() : undefined;
  const colorReq = params.color ? params.color.trim() : undefined;

  const sizeAvailable = sizeReq
    ? product.availableSizes.some(s => s.toLowerCase() === sizeReq.toLowerCase())
    : true;

  const colorAvailable = colorReq
    ? product.availableColors.some(c => c.toLowerCase().includes(colorReq.toLowerCase()))
    : true;

  const isAvailable = (product.stockQuantity > 0) && sizeAvailable && colorAvailable;

  let message = '';
  if (product.stockQuantity === 0) {
    message = `${product.name} is currently out of stock.`;
  } else if (sizeReq && !sizeAvailable) {
    message = `Size ${sizeReq} is currently not available for ${product.name}. Available sizes: ${product.availableSizes.join(', ')}.`;
  } else if (colorReq && !colorAvailable) {
    message = `Color ${colorReq} is currently not available for ${product.name}. Available colors: ${product.availableColors.join(', ')}.`;
  } else {
    message = `Yes! ${product.name} is in stock (${product.stockQuantity} units remaining) at ₹${product.price.toLocaleString('en-IN')}.${sizeReq ? ` Size ${sizeReq} is available.` : ''}`;
  }

  return {
    found: true,
    available: isAvailable,
    productName: product.name,
    stockQuantity: product.stockQuantity,
    requestedSize: sizeReq,
    sizeAvailable,
    availableSizes: product.availableSizes,
    requestedColor: colorReq,
    colorAvailable,
    availableColors: product.availableColors,
    price: product.price,
    message
  };
}

// Tool Implementation 4: addToCart
export function addToCart(params: AddToCartParams, currentCart: CartItem[] = []): {
  success: boolean;
  message: string;
  action?: {
    type: 'ADD_TO_CART';
    payload: {
      productId: string;
      size: string;
      color: string;
      quantity: number;
      productName: string;
    };
  };
  product?: Product;
} {
  const query = params.productId || params.productName;
  const product = findProduct(query);

  if (!product) {
    return {
      success: false,
      message: `Could not add to cart: Product "${query || 'Unknown'}" was not found.`
    };
  }

  if (product.stockQuantity <= 0) {
    return {
      success: false,
      message: `Sorry, ${product.name} is currently out of stock.`
    };
  }

  // Validate or fallback size
  let chosenSize = params.size?.trim();
  if (!chosenSize || !product.availableSizes.some(s => s.toLowerCase() === chosenSize?.toLowerCase())) {
    // If user specified invalid size, report it
    if (params.size) {
      return {
        success: false,
        message: `Size "${params.size}" is not available for ${product.name}. Available sizes: ${product.availableSizes.join(', ')}.`
      };
    }
    // Default to first available size
    chosenSize = product.availableSizes[0];
  } else {
    // Match exact casing from product
    const exact = product.availableSizes.find(s => s.toLowerCase() === chosenSize?.toLowerCase());
    if (exact) chosenSize = exact;
  }

  // Validate or fallback color
  let chosenColor = params.color?.trim();
  if (!chosenColor || !product.availableColors.some(c => c.toLowerCase().includes(chosenColor?.toLowerCase() || ''))) {
    chosenColor = product.availableColors[0];
  } else {
    const exact = product.availableColors.find(c => c.toLowerCase().includes(chosenColor?.toLowerCase() || ''));
    if (exact) chosenColor = exact;
  }

  const quantity = Math.max(1, params.quantity || 1);

  return {
    success: true,
    message: `Done! ${product.name} (${chosenColor}, Size: ${chosenSize}, Qty: ${quantity}) has been added to your cart for ₹${(product.price * quantity).toLocaleString('en-IN')}.`,
    action: {
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        size: chosenSize,
        color: chosenColor,
        quantity,
        productName: product.name
      }
    },
    product
  };
}

// Tool Implementation 5: getCart
export function getCart(cartItems: CartItem[] = []): {
  itemCount: number;
  totalPrice: number;
  formattedTotal: string;
  items: Array<{
    id: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
} {
  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    itemCount: count,
    totalPrice: total,
    formattedTotal: `₹${total.toLocaleString('en-IN')}`,
    items: cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity
    }))
  };
}

// Tool Dispatcher
export function executeAgentTool(name: string, args: any, currentCart: CartItem[] = []) {
  switch (name) {
    case 'searchProducts':
      return searchProducts(args || {});
    case 'getProductDetails':
      return getProductDetails(args || {});
    case 'checkProductAvailability':
      return checkProductAvailability(args || {});
    case 'addToCart':
      return addToCart(args || {}, currentCart);
    case 'getCart':
      return getCart(currentCart);
    default:
      return { error: `Unknown tool "${name}".` };
  }
}
