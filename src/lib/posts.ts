

const users = {
    'wanderlust_jane': {
        username: 'wanderlust_jane',
        name: 'Wanderlust Jane',
        avatar: 'https://picsum.photos/150/150?random=1',
        bio: 'Chasing sunsets and adventures.',
        description: 'Just a girl who loves to travel and explore new places. Follow my journey!',
        postCount: 1,
        followers: '2,541',
        following: '321',
    },
    'cebu_foodie': {
        username: 'cebu_foodie',
        name: 'Cebu Foodie',
        avatar: 'https://picsum.photos/150/150?random=2',
        bio: 'Eating my way through Cebu.',
        description: 'Documenting the best food finds in the Queen City of the South.',
        postCount: 1,
        followers: '5,832',
        following: '102',
    },
    'adventure_alex': {
        username: 'adventure_alex',
        name: 'Adventure Alex',
        avatar: 'https://picsum.photos/150/150?random=3',
        bio: 'Adrenaline junkie & nature lover.',
        description: 'From canyoneering to diving, I\'m always up for an adventure.',
        postCount: 1,
        followers: '3,123',
        following: '456',
    },
    'island_hopper': {
        username: 'island_hopper',
        name: 'Island Hopper',
        avatar: 'https://picsum.photos/150/150?random=4',
        bio: 'Exploring the islands of the Philippines.',
        description: 'Salt in the air, sand in my hair.',
        postCount: 1,
        followers: '4,678',
        following: '234',
    },
    'city_explorer': {
        username: 'city_explorer',
        name: 'City Explorer',
        avatar: 'https://picsum.photos/150/150?random=5',
        bio: 'Finding beauty in urban landscapes.',
        description: 'Not all who wander are lost. Some are just exploring the city.',
        postCount: 1,
        followers: '1,987',
        following: '567',
    },
     'alex_doe': {
        username: 'alex_doe',
        name: 'Alex Doe',
        avatar: 'https://picsum.photos/150/150?random=99',
        bio: 'Travel Enthusiast & Cebu Explorer',
        description: 'Discovering the hidden gems of the Philippines, one island at a time. 🌴',
        postCount: 0,
        followers: '1,234',
        following: '567'
    },
};


export const posts = [
  {
    id: 1,
    user: users['wanderlust_jane'],
    image: { src: 'https://picsum.photos/800/600?random=11', width: 800, height: 600, hint: 'beach sunset' },
    caption: 'Sunset in Moalboal was absolutely breathtaking! A must-see for anyone visiting Cebu. 🌅',
    likes: 124,
    commentsCount: 3,
    sharesCount: 12,
  },
  {
    id: 2,
    user: users['cebu_foodie'],
    image: { src: 'https://picsum.photos/600/800?random=12', width: 600, height: 800, hint: 'filipino food' },
    caption: 'Finally tried the famous Cebu lechon! Worth the hype. Crispy skin and juicy meat. 10/10!',
    likes: 256,
    commentsCount: 1,
    sharesCount: 45,
  },
  {
    id: 3,
    user: users['adventure_alex'],
    image: { src: 'https://picsum.photos/800/800?random=13', width: 800, height: 800, hint: 'waterfall nature' },
    caption: 'Canyoneering at Kawasan Falls was an adrenaline rush! The water is unbelievably blue.',
    likes: 88,
    commentsCount: 1,
    sharesCount: 23,
  },
   {
    id: 4,
    user: users['island_hopper'],
    image: { src: 'https://picsum.photos/800/500?random=14', width: 800, height: 500, hint: 'small island' },
    caption: 'Island hopping in Mactan. Found this little paradise!',
    likes: 152,
    commentsCount: 0,
    sharesCount: 18,
  },
   {
    id: 5,
    user: users['city_explorer'],
    image: { src: 'https://picsum.photos/600/700?random=15', width: 600, height: 700, hint: 'city street' },
    caption: 'Exploring the streets of old Cebu. So much history in every corner.',
    likes: 73,
    commentsCount: 1,
    sharesCount: 9,
  },
];

export const comments: Record<string, Readonly<Comment[]>> = {
  '1': [
    { id: 'c1-1', user: users['cebu_foodie'], text: 'Wow, amazing shot!', likes: 5, time: '2d', replies: [] },
    { id: 'c1-2', user: users['adventure_alex'], text: 'I was there last week! The sunset is even better in person.', likes: 12, time: '2d', replies: [
      { id: 'r1-2-1', user: users['wanderlust_jane'], text: 'Hope you had a great time!', likes: 1, time: '1d' }
    ] },
    { id: 'c1-3', user: { username: 'photofan', name: 'PhotoFan', avatar: 'https://picsum.photos/50/50?random=23' }, text: 'Great composition!', likes: 2, time: '1d', replies: [] },
  ],
  '2': [
    { id: 'c2-1', user: { username: 'gourmetguy', name: 'GourmetGuy', avatar: 'https://picsum.photos/50/50?random=24' }, text: 'Makes me hungry just looking at it!', likes: 8, time: '5h', replies: [] },
  ],
  '3': [
      { id: 'c3-1', user: { username: 'thrillseeker', name: 'ThrillSeeker', avatar: 'https://picsum.photos/50/50?random=25' }, text: 'How was the jump? Looks scary!', likes: 3, time: '1d', replies: [
      { id: 'r3-1-1', user: users['adventure_alex'], text: 'It was amazing! You should try it.', likes: 2, time: '1d' }
    ] },
  ],
  '4': [],
  '5': [
    { id: 'c5-1', user: { username: 'historybuff', name: 'HistoryBuff', avatar: 'https://picsum.photos/50/50?random=26' }, text: 'I love historical places like this.', likes: 4, time: '3d', replies: [] },
  ],
};


export type Comment = {
  id: string;
  user: { name: string; username: string; avatar: string };
  text: string;
  likes: number;
  time: string;
  replies?: Omit<Comment, 'replies'>[];
};

export type Post = typeof posts[0];

export type PostWithComments = Post & {
    comments: readonly Comment[];
};

export function findPostById(id: number): PostWithComments | undefined {
  const post = posts.find(post => post.id === id);
  if (!post) return undefined;
  return {
    ...post,
    comments: comments[id.toString() as keyof typeof comments] || [],
  };
}

export function findUserByUsername(username: string) {
    return (users as Record<string, any>)[username];
}

export function findPostsByUsername(username: string) {
    if (username === 'alex_doe') return []; // alex_doe has no posts yet
    return posts.filter(post => post.user.username === username);
}
