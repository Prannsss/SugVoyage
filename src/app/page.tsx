
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
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("People's Choice");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);

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

  const visibleTabs = useMemo(() => {
    const allTabs = Object.keys(filteredCategories);
    
    const reorderedTabs = [...allTabs];
    const peoplesChoiceIndex = reorderedTabs.indexOf("People's Choice");
    
    if (peoplesChoiceIndex !== -1) {
      const peoplesChoice = reorderedTabs.splice(peoplesChoiceIndex, 1)[0];
      reorderedTabs.unshift(peoplesChoice);
    }
    
    return reorderedTabs;
  }, [filteredCategories]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const availableTabs = Object.keys(filteredCategories);
    
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [filteredCategories, activeTab, isMounted]);


  return (
    <div className="flex flex-col gap-8 px-4 md:px-6 pt-24 md:pt-12 max-w-full overflow-hidden">
      <header className="space-y-4">
        <div className="flex items-center gap-4 relative">
          <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl flex-shrink-0">Explore Cebu</h1>
          
          <div className={cn(
            "transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
            isSearchExpanded ? "w-64" : "w-10"
          )}>
            <div className={cn(
              "relative bg-background/90 backdrop-blur-md border border-border/20 rounded-full shadow-lg transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] h-10",
              isSearchExpanded ? "px-4" : "px-2.5"
            )}>
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
        </div>
        
        <p className="text-muted-foreground md:text-xl/relaxed">
          Discover the best places to visit, eat, and stay in the Queen City of the South.
        </p>
      </header>
      <Tabs value={activeTab} onValueChange={(newTab) => {
        if (newTab === activeTab) return;
        
        setContentVisible(false);
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            setActiveTab(newTab);
            setContentVisible(true);
          }, 100);
        });
      }} className="w-full">
        <div className="flex justify-center mb-8 px-2">
          <div className="relative bg-background/90 backdrop-blur-md border border-border/20 rounded-full shadow-lg p-1 max-w-full overflow-hidden">
            <ScrollArea className="w-full max-w-[calc(100vw-2rem)]">
              <div className="flex space-x-1 px-2">
                {visibleTabs.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (cat !== activeTab) {
                        setContentVisible(false);
                        
                        requestAnimationFrame(() => {
                          setTimeout(() => {
                            setActiveTab(cat);
                            setContentVisible(true);
                          }, 100);
                        });
                      }
                    }}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out whitespace-nowrap z-10 flex-shrink-0",
                      "sm:px-4",
                      activeTab === cat 
                        ? "text-primary bg-primary/10 font-semibold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </div>
        </div>
        
        {Object.entries(filteredCategories).map(([cat, items]) => (
          <TabsContent key={cat} value={cat} className="mt-0">
            <div 
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300 ease-out",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
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
