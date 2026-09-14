export type ProductCategory = 'Men' | 'Women' | 'Shoes' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // in INR
  rating: number; // e.g. 4.7
  reviewCount: number;
  availableSizes: string[]; // e.g. ['6', '7', '8', '9'] or ['S', 'M', 'L', 'XL']
  availableColors: string[]; // e.g. ['Black', 'White', 'Navy']
  stockQuantity: number;
  image: string;
  brand: string;
  featured?: boolean;
  tag?: string;
  details?: string[];
}

export interface CartItem {
  id: string; // unique combo of productId-size-color
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface ToolExecutionRecord {
  tool: string;
  params: Record<string, any>;
  result: any;
  timestamp: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolExecutionRecord[];
  products?: Product[];
  actionTaken?: {
    type: 'ADD_TO_CART';
    payload: {
      productId: string;
      size: string;
      color: string;
      quantity: number;
      productName: string;
    };
  };
}

export interface FilterState {
  category: ProductCategory | 'All';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedColor?: string;
  selectedSize?: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
}
