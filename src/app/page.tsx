
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/places';
import { cn } from '@/lib/utils';
import styles from './page.module.css';

type CategoryName = keyof typeof categories;

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("People's Choice");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Memoize filtered categories to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    return Object.entries(categories).reduce((acc, [category, items]) => {
      const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        acc[category as CategoryName] = filteredItems;
      }
      return acc;
    }, {} as typeof categories);
  }, [searchTerm]);

  const setTabRef = useCallback((cat: string) => (el: HTMLButtonElement | null) => {
    tabRefs.current[cat] = el;
  }, []);

  const updateTabPosition = useCallback(() => {
    if (!isMounted) return;
    
    const activeTabRef = tabRefs.current[activeTab];
    if (!activeTabRef) return;
    
    const parentElement = activeTabRef.parentElement;
    if (!parentElement) return;
    
    const parentRect = parentElement.getBoundingClientRect();
    const activeRect = activeTabRef.getBoundingClientRect();
    
    const newLeft = activeRect.left - parentRect.left;
    const newWidth = activeRect.width;
    
    // Calculate distance to determine animation type
    const distance = Math.abs(newLeft - tabPosition.left);
    const isLongDistance = distance > 120; // Threshold for long distance
    
    if (isLongDistance && tabPosition.left !== 0) {
      // For long distances, use a fade-out/fade-in approach
      setIsAnimating(true);
      
      // Temporarily hide the background
      setTimeout(() => {
        setTabPosition({
          left: newLeft,
          width: newWidth,
        });
        setIsAnimating(false);
      }, 100);
    } else {
      // For short distances, use normal smooth transition
      setTabPosition({
        left: newLeft,
        width: newWidth,
      });
    }
  }, [activeTab, isMounted, tabPosition.left]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateTabPosition();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [updateTabPosition, filteredCategories, isMounted]);


  return (
    <div className="flex flex-col gap-8 px-4 md:px-6 pt-24 md:pt-12">
      <header className="space-y-4">
        <div className="flex items-center gap-4 relative">
          <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">Explore Cebu</h1>
          
          {/* Search Pill */}
          <div className="relative">
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-10",
              isSearchExpanded ? "w-[calc(100vw-4rem)] md:w-72" : "w-10"
            )}>
              <div className={cn(
                "relative bg-background/90 backdrop-blur-md border border-border/20 rounded-full shadow-lg transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] h-10",
                isSearchExpanded ? "px-4" : "px-2.5"
              )}>
                {/* Static Search Icon */}
                <Search 
                  className="h-5 w-5 text-muted-foreground cursor-pointer absolute left-2.5 top-1/2 -translate-y-1/2"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                />
                
                {isSearchExpanded && (
                  <Input
                    type="search"
                    placeholder="Search for places in Cebu..."
                    className="border-0 bg-transparent pl-8 pr-2 text-xs placeholder:text-xs focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => {
                      if (!searchTerm) {
                        setTimeout(() => setIsSearchExpanded(false), 150);
                      }
                    }}
                    autoFocus
                  />
                )}
              </div>
            </div>
            {/* Spacer to maintain layout */}
            <div className="w-10 h-10 opacity-0" />
          </div>
        </div>
        
        <p className="text-muted-foreground md:text-xl/relaxed">
          Discover the best places to visit, eat, and stay in the Queen City of the South.
        </p>
      </header>
      <Tabs value={activeTab} onValueChange={(newTab) => {
        // Fade out current content
        setContentVisible(false);
        
        // Change tab and fade in new content after a short delay
        setTimeout(() => {
          setActiveTab(newTab);
          setContentVisible(true);
        }, 150);
      }} className="w-full">
        {/* Centered Tab Bar with Bouncy Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative bg-background/90 backdrop-blur-md border border-border/20 rounded-full shadow-lg p-1">
            <ScrollArea className="w-full">
              <div className="flex space-x-1">
                {Object.keys(filteredCategories).map((cat) => (
                  <button
                    key={cat}
                    ref={setTabRef(cat)}
                    onClick={() => setActiveTab(cat)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap z-10",
                      activeTab === cat 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            {/* Animated Background */}
            {tabPosition.width > 0 && (
              <div 
                className={cn(
                  styles.tabBackground,
                  isAnimating && "opacity-0"
                )}
                ref={(el) => {
                  if (el) {
                    el.style.transform = `translateX(${tabPosition.left}px)`;
                    el.style.width = `${tabPosition.width}px`;
                  }
                }}
              />
            )}
          </div>
        </div>
        
        {Object.entries(filteredCategories).map(([cat, items]) => (
          <TabsContent key={cat} value={cat} className="mt-0">
            <div 
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-500 ease-out",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {items.map((item, index) => (
                <Link 
                  key={item.title} 
                  href={`/explore/${slugify(item.title)}`} 
                  className="group"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Card className={cn(
                    "overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-full",
                    styles['animate-fade-in-up']
                  )}>
                    <CardHeader className="p-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={item.hint}
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-bold font-headline">{item.title}</CardTitle>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Badge variant="secondary">Cebu</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
