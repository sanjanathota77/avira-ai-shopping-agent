import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  agentToolDefinitions,
  executeAgentTool,
  findProduct,
  searchProducts,
  addToCart,
  getCart,
  getProductDetails,
  checkProductAvailability
} from '@/lib/agentTools';
import { CartItem, Product, ToolExecutionRecord } from '@/types';
import { products } from '@/data/products';

interface RequestBody {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  currentCart?: CartItem[];
}

const SYSTEM_PROMPT = `You are "Avira AI", an elite personal fashion and shopping assistant for Avira - a luxury and contemporary fashion house in India.
All prices are strictly in Indian Rupees (₹).

You have access to 5 powerful shopping tools:
1. searchProducts(query, category, maxPrice, color, size, minRating, sortBy)
2. getProductDetails(productId, productName)
3. checkProductAvailability(productId, productName, size, color)
4. addToCart(productId, productName, size, color, quantity)
5. getCart()

OPERATIONAL DIRECTIVES:
- You must NEVER invent or hallucinate product prices, stock, ratings, colors, or sizes. Always use your tools to check reality.
- When the user asks to add an item to the cart, invoke addToCart immediately.
- When the user asks for sizes or colors of a product, use getProductDetails or checkProductAvailability.
- When the user asks for recommendations, products within budget, or filtered items, use searchProducts.
- If a user query asks "under 2000", pass maxPrice: 2000.
- If a user asks for highest rated or best rated, pass sortBy: 'rating'.
- Keep your tone sophisticated, warm, helpful, and concise. Always format prices with the Indian Rupee symbol (e.g., ₹1,899).
- If multiple matching products are found, mention their key highlights concisely.`;

// Intelligent Rule & NLP Agent Engine (when OpenAI API Key is absent or during offline demo)
function runDeterministicAgent(userQuery: string, currentCart: CartItem[] = []) {
  const query = userQuery.trim().toLowerCase();
  const toolCalls: ToolExecutionRecord[] = [];
  let returnedProducts: Product[] = [];
  let actionTaken: any = undefined;
  let assistantResponse = '';

  // Case 1: Add to cart
  if (query.includes('add') && (query.includes('cart') || query.includes('bag') || query.includes('buy'))) {
    // Determine product
    let targetProduct: Product | undefined;
    for (const p of products) {
      if (query.includes(p.name.toLowerCase())) {
        targetProduct = p;
        break;
      }
    }
    if (!targetProduct) {
      // Check partial names
      if (query.includes('sneaker') || query.includes('black shoe')) {
        targetProduct = products.find(p => p.id === 'prod-shoes-01'); // Urban Black Sneakers
      } else if (query.includes('crimson') || query.includes('red dress')) {
        targetProduct = products.find(p => p.id === 'prod-dress-01');
      } else if (query.includes('runner') || query.includes('veloce')) {
        targetProduct = products.find(p => p.id === 'prod-shoes-02');
      }
    }

    // Extract size
    let targetSize: string | undefined;
    const sizeMatch = query.match(/size\s+([a-z0-9]+)/i) || query.match(/size\s*:\s*([a-z0-9]+)/i);
    if (sizeMatch) {
      targetSize = sizeMatch[1].toUpperCase();
    } else if (query.includes('size 8') || query.includes(' 8 ')) {
      targetSize = '8';
    } else if (query.includes('size m') || query.includes(' m ')) {
      targetSize = 'M';
    } else if (query.includes('size s') || query.includes(' s ')) {
      targetSize = 'S';
    }

    // Extract color
    let targetColor: string | undefined;
    if (query.includes('black')) targetColor = 'Black';
    else if (query.includes('red') || query.includes('crimson')) targetColor = 'Crimson';
    else if (query.includes('white')) targetColor = 'White';

    if (targetProduct) {
      const toolParams = {
        productId: targetProduct.id,
        productName: targetProduct.name,
        size: targetSize || targetProduct.availableSizes[0],
        color: targetColor || targetProduct.availableColors[0],
        quantity: 1
      };

      const result = addToCart(toolParams, currentCart);
      toolCalls.push({
        tool: 'addToCart',
        params: toolParams,
        result,
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        actionTaken = result.action;
        assistantResponse = `Done! I've added **${targetProduct.name}** (Size ${toolParams.size}, ${toolParams.color}) to your shopping cart for **₹${targetProduct.price.toLocaleString('en-IN')}**. You can review your cart anytime or proceed to checkout.`;
        returnedProducts = [targetProduct];
      } else {
        assistantResponse = result.message;
      }
    } else {
      assistantResponse = "I'd love to add that to your cart, but could you specify which product you'd like me to add?";
    }
  }
  // Case 2: View cart / get cart
  else if (query.includes('my cart') || query.includes('view cart') || query.includes('show cart') || query.includes('in cart') || query.includes('what is in my cart')) {
    const result = getCart(currentCart);
    toolCalls.push({
      tool: 'getCart',
      params: {},
      result,
      timestamp: new Date().toISOString()
    });

    if (result.itemCount === 0) {
      assistantResponse = "Your shopping cart is currently empty. Would you like me to suggest our trending pieces or seasonal footwear?";
    } else {
      const itemNames = result.items.map(i => `${i.name} (${i.size}, ${i.color}) x${i.quantity}`).join(', ');
      assistantResponse = `You have ${result.itemCount} item(s) in your cart: ${itemNames}. Total: **${result.formattedTotal}**.`;
    }
  }
  // Case 3: Check availability / size inquiry
  else if (query.includes('available') || query.includes('in stock') || query.includes('do you have size') || query.includes('is size') || query.includes('what sizes')) {
    let targetProduct: Product | undefined;
    for (const p of products) {
      if (query.includes(p.name.toLowerCase())) {
        targetProduct = p;
        break;
      }
    }
    if (!targetProduct) {
      if (query.includes('sneaker') || query.includes('black shoe')) {
        targetProduct = products.find(p => p.id === 'prod-shoes-01');
      } else if (query.includes('crimson') || query.includes('dress')) {
        targetProduct = products.find(p => p.id === 'prod-dress-01');
      }
    }

    if (targetProduct) {
      const sizeMatch = query.match(/size\s+([a-z0-9]+)/i) || query.match(/size\s*:\s*([a-z0-9]+)/i);
      const requestedSize = sizeMatch ? sizeMatch[1].toUpperCase() : undefined;

      const toolParams = {
        productId: targetProduct.id,
        productName: targetProduct.name,
        size: requestedSize
      };

      if (query.includes('what sizes') || (!requestedSize && query.includes('sizes'))) {
        const result = getProductDetails({ productId: targetProduct.id });
        toolCalls.push({
          tool: 'getProductDetails',
          params: { productId: targetProduct.id },
          result,
          timestamp: new Date().toISOString()
        });

        assistantResponse = `**${targetProduct.name}** is available in sizes: **${targetProduct.availableSizes.join(', ')}**. Current price is **₹${targetProduct.price.toLocaleString('en-IN')}** with ${targetProduct.stockQuantity} pairs remaining in inventory.`;
        returnedProducts = [targetProduct];
      } else {
        const result = checkProductAvailability(toolParams);
        toolCalls.push({
          tool: 'checkProductAvailability',
          params: toolParams,
          result,
          timestamp: new Date().toISOString()
        });

        assistantResponse = result.message;
        returnedProducts = [targetProduct];
      }
    } else {
      assistantResponse = "Could you tell me which product you'd like me to check availability for?";
    }
  }
  // Case 4: Price inquiry
  else if (query.includes('how much') || query.includes('price') || query.includes('cost')) {
    let targetProduct: Product | undefined;
    for (const p of products) {
      if (query.includes(p.name.toLowerCase())) {
        targetProduct = p;
        break;
      }
    }
    if (!targetProduct) {
      if (query.includes('sneaker') || query.includes('black shoe')) {
        targetProduct = products.find(p => p.id === 'prod-shoes-01');
      }
    }

    if (targetProduct) {
      const result = getProductDetails({ productId: targetProduct.id });
      toolCalls.push({
        tool: 'getProductDetails',
        params: { productId: targetProduct.id },
        result,
        timestamp: new Date().toISOString()
      });

      assistantResponse = `The **${targetProduct.name}** by ${targetProduct.brand} is priced at **₹${targetProduct.price.toLocaleString('en-IN')}**. It has an outstanding customer rating of ${targetProduct.rating} ★ (${targetProduct.reviewCount} reviews).`;
      returnedProducts = [targetProduct];
    } else {
      assistantResponse = "Which product's price would you like me to look up?";
    }
  }
  // Case 5: Search / Recommendations / Filter
  else {
    let maxPrice: number | undefined;
    const priceMatch = query.match(/under\s*(?:rs\.?|inr|₹)?\s*([0-9]+)/i) || query.match(/below\s*(?:rs\.?|inr|₹)?\s*([0-9]+)/i) || query.match(/less than\s*(?:rs\.?|inr|₹)?\s*([0-9]+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    let category: string | undefined;
    if (query.includes('shoe') || query.includes('sneaker') || query.includes('boot')) category = 'Shoes';
    else if (query.includes('dress') || query.includes('women')) category = 'Women';
    else if (query.includes('blazer') || query.includes('shirt') || query.includes('men')) category = 'Men';
    else if (query.includes('bag') || query.includes('scarf') || query.includes('sunglass') || query.includes('accessories')) category = 'Accessories';

    let color: string | undefined;
    if (query.includes('black')) color = 'Black';
    else if (query.includes('red') || query.includes('crimson')) color = 'Red';
    else if (query.includes('white')) color = 'White';
    else if (query.includes('camel') || query.includes('brown')) color = 'Camel';

    let size: string | undefined;
    const sizeMatch = query.match(/size\s+([a-z0-9]+)/i);
    if (sizeMatch) size = sizeMatch[1].toUpperCase();

    let sortBy: 'rating' | 'price-asc' | 'price-desc' | undefined;
    if (query.includes('best rated') || query.includes('highest rated') || query.includes('top rated')) {
      sortBy = 'rating';
    } else if (query.includes('cheapest') || query.includes('lowest price')) {
      sortBy = 'price-asc';
    }

    // Extract search query keyword and remove stop words
    let searchWords = query
      .replace(/show me/g, '')
      .replace(/find me/g, '')
      .replace(/find a/g, '')
      .replace(/find/g, '')
      .replace(/i need/g, '')
      .replace(/looking for/g, '')
      .replace(/under\s*(?:rs\.?|inr|₹)?\s*[0-9]+/g, '')
      .replace(/below\s*(?:rs\.?|inr|₹)?\s*[0-9]+/g, '')
      .replace(/less than\s*(?:rs\.?|inr|₹)?\s*[0-9]+/g, '')
      .replace(/best rated/g, '')
      .replace(/highest rated/g, '')
      .replace(/top rated/g, '')
      .replace(/in size\s+[a-z0-9]+/gi, '')
      .replace(/size\s+[a-z0-9]+/gi, '')
      .toLowerCase()
      .split(/\s+/)
      .filter(w => !['a', 'an', 'the', 'in', 'on', 'with', 'for', 'of', 'and', 'or', 'me', 'to', 'at', 'i', 'is'].includes(w) && w.length > 1);

    // If category was already extracted, remove generic category words from keyword query
    if (category) {
      searchWords = searchWords.filter(w => w !== 'shoes' && w !== 'shoe' && w !== 'sneakers' && w !== 'sneaker' && w !== 'dress' && w !== 'clothes');
    }
    // If color was already extracted, remove it from keyword query
    if (color) {
      const colWord = color.toLowerCase();
      searchWords = searchWords.filter(w => w !== colWord);
    }

    const searchTerm = searchWords.join(' ').trim();

    const searchParams = {
      query: searchTerm || undefined,
      category,
      maxPrice,
      color,
      size,
      sortBy
    };

    const result = searchProducts(searchParams);
    toolCalls.push({
      tool: 'searchProducts',
      params: searchParams,
      result,
      timestamp: new Date().toISOString()
    });

    returnedProducts = result.products;

    if (returnedProducts.length === 0) {
      assistantResponse = `I searched our catalog with those criteria, but couldn't find an exact match${maxPrice ? ` under ₹${maxPrice.toLocaleString('en-IN')}` : ''}. Here are some similar trending items you might love instead:`;
      returnedProducts = products.filter(p => category ? p.category === category : true).slice(0, 3);
    } else if (sortBy === 'rating') {
      const top = returnedProducts[0];
      assistantResponse = `The **${top.name}** has the highest rating in this selection at **${top.rating}/5.0** (${top.reviewCount} verified reviews), priced at **₹${top.price.toLocaleString('en-IN')}**. I found ${returnedProducts.length} matching option(s):`;
    } else {
      assistantResponse = `I found **${returnedProducts.length}** matching item${returnedProducts.length > 1 ? 's' : ''}${maxPrice ? ` under ₹${maxPrice.toLocaleString('en-IN')}` : ''}${color ? ` in ${color}` : ''}. Here are the top recommendations:`;
    }
  }

  return {
    message: {
      id: 'agent-' + Date.now(),
      role: 'assistant' as const,
      content: assistantResponse,
      timestamp: new Date().toISOString(),
      toolCalls,
      products: returnedProducts.slice(0, 4),
      actionTaken
    },
    mode: 'autonomous-agent-engine'
  };
}

export async function POST(req: NextRequest) {
  // Parse the body once up-front; closure vars are available in the catch block
  let parsedMessages: RequestBody['messages'] = [];
  let parsedCart: CartItem[] = [];
  let userPrompt = '';

  try {
    const body: RequestBody = await req.json();
    parsedMessages = body.messages || [];
    parsedCart = body.currentCart || [];

    if (parsedMessages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    // Read the API key server-side only — never exposed to the browser
    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey !== '...' && Boolean(apiKey);

    const lastUserMessage = [...parsedMessages].reverse().find(m => m.role === 'user');
    userPrompt = lastUserMessage ? lastUserMessage.content : '';

    // If no valid OpenAI API Key is provided, use our deterministic autonomous agent engine
    // This guarantees the HR demo runs smoothly with full tool calling without crashing!
    if (!isApiKeyConfigured) {
      const fallbackResult = runDeterministicAgent(userPrompt,parsedCart);
      return NextResponse.json({
        ...fallbackResult,
        apiKeyStatus: 'fallback-agent-engine',
        info: 'Running high-precision local Agent Tool Execution Engine. Add valid OPENAI_API_KEY to .env.local for live GPT-4o-mini.'
      });
    }

    // Live OpenAI API execution with Tool Calling
    const openai = new OpenAI({  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/', });

    // Prepare message history for OpenAI
    const openAiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Include recent messages (last 6 for context)
    for (const m of parsedMessages.slice(-6)) {
      if (m.role === 'user' || m.role === 'assistant') {
        openAiMessages.push({
          role: m.role,
          content: m.content
        });
      }
    }

    // Step 1: Call OpenAI with Tool Definitions
    const response = await openai.chat.completions.create({
      model: 'gemini-3.8-flash',
      messages: openAiMessages,
      tools: agentToolDefinitions,
      tool_choice: 'auto',
      temperature: 0.2
    });

    const responseMessage = response.choices[0].message;
    const toolCallsMade: ToolExecutionRecord[] = [];
    let matchedProducts: Product[] = [];
    let actionTaken: any = undefined;

    // Step 2: Handle Tool Calls if any
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      openAiMessages.push(responseMessage);

      for (const toolCall of responseMessage.tool_calls) {
        const fnName = toolCall.function.name;
        let fnArgs = {};
        try {
          fnArgs = JSON.parse(toolCall.function.arguments);
        } catch {
          fnArgs = {};
        }

        const toolResult: any = executeAgentTool(fnName, fnArgs, parsedCart);

        toolCallsMade.push({
          tool: fnName,
          params: fnArgs,
          result: toolResult,
          timestamp: new Date().toISOString()
        });

        // Collect products if search or details
        if (fnName === 'searchProducts' && toolResult.products) {
          matchedProducts = [...matchedProducts, ...toolResult.products];
        } else if (fnName === 'getProductDetails' && toolResult.product) {
          matchedProducts.push(toolResult.product);
        } else if (fnName === 'checkProductAvailability' && toolResult.productName) {
          const p = findProduct(toolResult.productName);
          if (p) matchedProducts.push(p);
        } else if (fnName === 'addToCart' && toolResult.action) {
          actionTaken = toolResult.action;
          if (toolResult.product) matchedProducts.push(toolResult.product);
        }

        openAiMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        });
      }

      // Step 3: Get final response after tool execution
      const secondResponse = await openai.chat.completions.create({
        model: 'gemini-3.8-flash',
        messages: openAiMessages,
        temperature: 0.3
      });

      const finalContent = secondResponse.choices[0].message.content || 'I have processed your request.';

      // Deduplicate products
      const uniqueProducts = Array.from(new Map(matchedProducts.map(p => [p.id, p])).values());

      return NextResponse.json({
        message: {
          id: 'agent-' + Date.now(),
          role: 'assistant',
          content: finalContent,
          timestamp: new Date().toISOString(),
          toolCalls: toolCallsMade,
          products: uniqueProducts.slice(0, 4),
          actionTaken
        },
        mode: 'gemini-3.8-flash',
        apiKeyStatus: 'live-gemini'
      });
    }

    // No tool calls needed, direct response
    return NextResponse.json({
      message: {
        id: 'agent-' + Date.now(),
        role: 'assistant',
        content: responseMessage.content || "Hello! I am Avira AI. How may I assist your style search today?",
        timestamp: new Date().toISOString(),
        toolCalls: []
      },
      mode: 'openai-gemini-3.8-flash',
      apiKeyStatus: 'live-gemini'
    });

  } catch (error: any) {
    console.error('Agent API Error:', error);

    // If OpenAI fails (e.g. invalid key or network issue), fallback gracefully to deterministic engine
    try {
      const body = await req.json().catch(() => ({}));
      const lastUserMessage = body.messages ? [...body.messages].reverse().find((m: any) => m.role === 'user') : null;
      const fallbackResult = runDeterministicAgent(lastUserMessage?.content || '', body.currentCart || []);
      return NextResponse.json({
        ...fallbackResult,
        apiKeyStatus: 'error-fallback',
        warning: 'OpenAI request encountered an issue. Used local agent engine.'
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to process AI agent request.' },
        { status: 500 }
      );
    }
  }
}
