'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AgentChatMessage, Product } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  ShoppingBag,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Terminal,
  Star,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AIAgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProduct: (product: Product) => void;
  initialPrompt?: string;
}

const SUGGESTED_PROMPTS = [
  'Show me black shoes under 2000',
  'What sizes are available for Urban Black Sneakers?',
  'Is size 8 available for Urban Black Sneakers?',
  'How much does Urban Black Sneakers cost?',
  'Show me the best rated shoes under 2500',
  'Add Urban Black Sneakers to my cart',
  'Find a red dress under 3000 in size M'
];

export default function AIAgentChat({
  isOpen,
  onClose,
  onViewProduct,
  initialPrompt = ''
}: AIAgentChatProps) {
  const { items: currentCart, addToCart } = useCart();
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm **Avira AI**, your autonomous personal shopping stylist. I don't just chat — I can actively search our catalog, check live inventory and sizes, verify prices, and add items straight to your shopping bag.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStepText, setActiveStepText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedToolIndex, setExpandedToolIndex] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<'ready' | 'thinking' | 'tool-executing'>('ready');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Handle initialPrompt trigger from external buttons
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: AgentChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setAgentStatus('thinking');
    setActiveStepText('Understanding shopping goal & choosing tool...');

    try {
      // Small simulated step update for rich HR visualization
      const stepTimer = setTimeout(() => {
        setAgentStatus('tool-executing');
        setActiveStepText('Executing autonomous agent tools...');
      }, 400);

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentCart
        })
      });

      clearTimeout(stepTimer);

      if (!response.ok) {
        throw new Error('Agent API request failed');
      }

      const data = await response.json();
      const assistantMessage: AgentChatMessage = data.message;

      // Handle any action payload returned by agent tools (e.g. addToCart)
      if (assistantMessage.actionTaken && assistantMessage.actionTaken.type === 'ADD_TO_CART') {
        const payload = assistantMessage.actionTaken.payload;
        // Trigger client cart update!
        const matched = assistantMessage.products?.find(p => p.id === payload.productId) ||
                        currentCart.find(i => i.product.id === payload.productId)?.product;

        if (matched) {
          addToCart(matched, payload.size, payload.color, payload.quantity);
        } else if (assistantMessage.products && assistantMessage.products.length > 0) {
          addToCart(assistantMessage.products[0], payload.size, payload.color, payload.quantity);
        }
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Agent chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: "I encountered a minor connection glitch. Please try asking again or select one of the suggested prompts below.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
      setAgentStatus('ready');
      setActiveStepText('');
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: "Chat reset. How can I assist your styling or shopping journey today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const toggleToolExpand = (id: string) => {
    setExpandedToolIndex(expandedToolIndex === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl border border-amber-600/30 bg-stone-900 text-stone-100 ${
        isExpanded
          ? 'inset-4 sm:inset-10 rounded-2xl'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] h-[650px] max-h-[90vh] rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 fill-stone-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-stone-900" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-base font-bold text-white tracking-wide">
                Avira AI Agent
              </h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Terminal className="w-2.5 h-2.5" />
                <span>Tool Calling</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Autonomous Fashion Assistant & Sizing Specialist
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-stone-400">
          <button
            onClick={handleClearHistory}
            className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors hidden sm:block"
            title={isExpanded ? 'Restore size' : 'Expand panel'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompt Bar (Quick Chips) */}
      <div className="bg-stone-950/70 px-4 py-2 border-b border-stone-800/80 overflow-x-auto scrollbar-none flex items-center space-x-2 flex-shrink-0">
        <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center space-x-1 flex-shrink-0">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>Try:</span>
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] bg-stone-900 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                  isUser
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-stone-800/90 text-stone-100 rounded-tl-none border border-stone-750 shadow-md'
                }`}
              >
                {/* Text formatting with basic markdown */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.content.split('\n').map((line, lIdx) => {
                    // Check for bold syntax **bold**
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={lIdx}>
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={pIdx} className={isUser ? 'font-extrabold' : 'text-amber-300 font-bold'}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* TOOL EXECUTION TRACE (Crucial for HR demonstration) */}
              {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="w-full max-w-[90%] space-y-1.5">
                  {msg.toolCalls.map((tc, tIdx) => {
                    const traceKey = `${msg.id}-tool-${tIdx}`;
                    const isToolExpanded = expandedToolIndex === traceKey;
                    return (
                      <div
                        key={tIdx}
                        className="bg-stone-950/80 border border-amber-500/30 rounded-xl overflow-hidden text-[11px]"
                      >
                        <button
                          onClick={() => toggleToolExpand(traceKey)}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-amber-400 hover:bg-stone-900/60 transition-colors"
                        >
                          <div className="flex items-center space-x-1.5 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-stone-400">Tool Executed:</span>
                            <span className="font-bold text-amber-300">{tc.tool}()</span>
                          </div>
                          <div className="flex items-center space-x-1 text-stone-400">
                            <span>Details</span>
                            {isToolExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </div>
                        </button>

                        {isToolExpanded && (
                          <div className="p-3 border-t border-stone-800 font-mono space-y-2 bg-stone-950 text-[10px]">
                            <div>
                              <span className="text-stone-500 uppercase tracking-widest block mb-0.5">Parameters:</span>
                              <pre className="text-amber-200/90 overflow-x-auto bg-stone-900 p-2 rounded">
                                {JSON.stringify(tc.params, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="text-stone-500 uppercase tracking-widest block mb-0.5">Result:</span>
                              <pre className="text-emerald-300/90 overflow-x-auto bg-stone-900 p-2 rounded max-h-32">
                                {JSON.stringify(tc.result, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ACTION TAKEN CARD (e.g. Added to Cart trigger) */}
              {!isUser && msg.actionTaken && (
                <div className="w-full max-w-[90%] bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300 block">
                        Action: Added to Cart!
                      </span>
                      <span className="text-[11px] text-stone-300">
                        {msg.actionTaken.payload.productName} (Size {msg.actionTaken.payload.size}, Qty {msg.actionTaken.payload.quantity})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded">
                    Bag Synced
                  </span>
                </div>
              )}

              {/* PRODUCT CARDS INSIDE AGENT RESPONSE */}
              {!isUser && msg.products && msg.products.length > 0 && (
                <div className="w-full max-w-[95%] grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {msg.products.map(prod => (
                    <div
                      key={prod.id}
                      className="bg-stone-950/90 border border-stone-800 rounded-xl p-2.5 flex items-center space-x-3 hover:border-amber-500/40 transition-all shadow"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-800">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-bold text-white truncate">
                          {prod.name}
                        </h5>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs font-extrabold text-amber-300">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 flex items-center space-x-0.5">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <span>{prod.rating}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            onClick={() => addToCart(prod, prod.availableSizes[0], prod.availableColors[0], 1)}
                            className="flex-1 py-1 px-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center justify-center space-x-1"
                          >
                            <ShoppingBag className="w-2.5 h-2.5" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => onViewProduct(prod)}
                            className="py-1 px-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px]"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking / Tool Calling State */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-stone-800/80 border border-stone-700/70 p-3 rounded-2xl rounded-tl-none space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-semibold text-amber-300">
                  {activeStepText || 'Processing request...'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Avira AI is analyzing intent and querying product catalog tools...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-stone-950 border-t border-stone-800 rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Avira AI (e.g. 'Show me black shoes under 2000')..."
              disabled={isLoading}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-md shadow-amber-500/20"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-stone-500 px-1 pt-2">
          <span>Supported: Catalog Search, Sizes, Stock, and Live Add-To-Cart</span>
          <span className="text-amber-500/80 font-medium">₹ INR Currency</span>
        </div>
      </div>
    </div>
  );
}
