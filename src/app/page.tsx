
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/places';

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

  const filteredCategories = Object.entries(categories).reduce((acc, [category, items]) => {
    const filteredItems = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[category as CategoryName] = filteredItems;
    }
    return acc;
  }, {} as typeof categories);


  return (
    <div className="flex flex-col gap-8 px-4 md:px-6 pt-20 md:pt-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">Explore Cebu</h1>
        <p className="text-muted-foreground md:text-xl/relaxed">
          Discover the best places to visit, eat, and stay in the Queen City of the South.
        </p>
         <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for places in Cebu..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <Tabs defaultValue="People's Choice" className="w-full">
        <ScrollArea>
          <TabsList>
            {Object.keys(filteredCategories).map(cat => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {Object.entries(filteredCategories).map(([cat, items]) => (
          <TabsContent key={cat} value={cat} className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map(item => (
                <Link key={item.title} href={`/explore/${slugify(item.title)}`} className="group">
                  <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg h-full">
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
