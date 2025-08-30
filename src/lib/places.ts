export const categories = {
  "People's Choice": [
    { title: "Magellan's Cross", image: 'https://picsum.photos/400/300?random=1', hint: 'historical landmark' },
    { title: "Kawasan Falls", image: 'https://picsum.photos/400/300?random=2', hint: 'nature waterfall' },
    { title: "Basilica del Sto. Niño", image: 'https://picsum.photos/400/300?random=3', hint: 'church architecture' },
    { title: "Sirao Garden", image: 'https://picsum.photos/400/300?random=4', hint: 'flower garden' },
  ],
  "Adventure": [
    { title: "Canyoneering in Badian", image: 'https://picsum.photos/400/300?random=5', hint: 'canyoning adventure' },
    { title: "Oslob Whale Shark Watching", image: 'https://picsum.photos/400/300?random=6', hint: 'whale shark' },
    { title: "Moalboal Sardine Run", image: 'https://picsum.photos/400/300?random=7', hint: 'sardine diving' },
    { title: "Danasan Eco Adventure Park", image: 'https://picsum.photos/400/300?random=8', hint: 'eco park' },
  ],
  "Hotels": [
    { title: "Shangri-La Mactan", image: 'https://picsum.photos/400/300?random=9', hint: 'luxury resort' },
    { title: "Crimson Resort and Spa", image: 'https://picsum.photos/400/300?random=10', hint: 'beach resort' },
    { title: "Radisson Blu Cebu", image: 'https://picsum.photos/400/300?random=11', hint: 'city hotel' },
  ],
  "Restaurants": [
    { title: "Lantaw Floating Native Restaurant", image: 'https://picsum.photos/400/300?random=12', hint: 'seafood restaurant' },
    { title: "The Abaca Restaurant", image: 'https://picsum.photos/400/300?random=13', hint: 'fine dining' },
    { title: "House of Lechon", image: 'https://picsum.photos/400/300?random=14', hint: 'filipino food' },
  ],
  "Coffee Shops": [
    { title: "Abaca Baking Company", image: 'https://picsum.photos/400/300?random=15', hint: 'coffee pastry' },
    { title: "Good Cup Coffee Co.", image: 'https://picsum.photos/400/300?random=16', hint: 'specialty coffee' },
    { title: "Tom N Toms Coffee", image: 'https://picsum.photos/400/300?random=17', hint: 'cafe chain' },
  ]
};

export function findPlaceBySlug(slug: string) {
  const allPlaces = Object.values(categories).flat();
  return allPlaces.find(place => slugify(place.title) === slug);
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}
