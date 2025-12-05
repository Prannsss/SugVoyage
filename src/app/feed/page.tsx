
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { MoreHorizontal, Plus, Heart, MessageCircle, Share2, Bookmark, Play, ImageIcon, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { posts, comments } from '@/lib/posts';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CommentsSheet } from '@/components/layout/CommentsSheet';
import type { PostWithComments } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { PostOptionsSheet } from '@/components/layout/PostOptionsSheet';
import { PostActions } from '@/components/layout/PostActions';

// Mock video data
const videoData = [
  {
    id: 1,
    user: {
      username: 'sarah_adventures',
      name: 'Sarah Adventures',
      avatar: 'https://picsum.photos/150/150?random=20',
    },
    video: 'https://picsum.photos/400/700?random=50', // Using image as placeholder
    caption: 'Golden hour in Moalboal never disappoints. The ocean is calling! 🌅✨',
    likes: 2400,
    comments: 412,
    shares: 203,
    saves: 155,
    tags: ['#IslandHopping', '#CebuAdventures', '#Sunset'],
    location: 'Moalboal, Cebu',
  },
  {
    id: 2,
    user: {
      username: 'cebu_diver',
      name: 'Cebu Diver',
      avatar: 'https://picsum.photos/150/150?random=21',
    },
    video: 'https://picsum.photos/400/700?random=51',
    caption: 'Swimming with millions of sardines is a surreal experience! 🐟🌊',
    likes: 5200,
    comments: 890,
    shares: 445,
    saves: 320,
    tags: ['#SardineRun', '#Diving', '#Moalboal'],
    location: 'Panagsama Beach',
  },
  {
    id: 3,
    user: {
      username: 'foodie_cebu',
      name: 'Foodie Cebu',
      avatar: 'https://picsum.photos/150/150?random=22',
    },
    video: 'https://picsum.photos/400/700?random=52',
    caption: 'Best lechon in the world! The crispy skin is to die for 🐷🔥',
    likes: 3800,
    comments: 567,
    shares: 234,
    saves: 445,
    tags: ['#CebuLechon', '#FoodPorn', '#Filipino'],
    location: 'Zubuchon, Cebu City',
  },
  {
    id: 4,
    user: {
      username: 'island_hopper',
      name: 'Island Hopper',
      avatar: 'https://picsum.photos/150/150?random=23',
    },
    video: 'https://picsum.photos/400/700?random=53',
    caption: 'Kawasan Falls is absolutely magical! The turquoise water is unreal 💙',
    likes: 8900,
    comments: 1200,
    shares: 678,
    saves: 890,
    tags: ['#KawasanFalls', '#Nature', '#Adventure'],
    location: 'Badian, Cebu',
  },
  {
    id: 5,
    user: {
      username: 'sunset_chaser',
      name: 'Sunset Chaser',
      avatar: 'https://picsum.photos/150/150?random=24',
    },
    video: 'https://picsum.photos/400/700?random=54',
    caption: 'Temple of Leah at golden hour hits different 🏛️✨',
    likes: 4500,
    comments: 345,
    shares: 189,
    saves: 267,
    tags: ['#TempleOfLeah', '#CebuCity', '#GoldenHour'],
    location: 'Busay, Cebu',
  },
];

const MobilePostCard = ({ post }: { post: PostWithComments }) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    return (
    <>
        <div className="flex flex-col border-b border-t">
            <div className="flex flex-row items-center justify-between p-4">
                <Link href={`/profile/${post.user.username}`} className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={post.user.avatar} alt={post.user.name} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{post.user.name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOptionsOpen(true)}>
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
            <div>
                <Image
                    src={post.image.src}
                    alt={`Post by ${post.user.name}`}
                    width={post.image.width}
                    height={post.image.height}
                    className="w-full object-cover"
                    data-ai-hint={post.image.hint}
                />
            </div>
            <div className="flex flex-col items-start px-4 pb-4">
                <PostActions post={post} onCommentClick={() => setIsCommentsOpen(true)} />
                <p className="text-sm">
                    <Link href={`/profile/${post.user.username}`} className="font-semibold mr-2">{post.user.name}</Link>
                    {post.caption}
                </p>
                {post.comments.length > 0 && (
                    <p 
                        className="text-xs text-muted-foreground cursor-pointer hover:underline"
                        onClick={() => setIsCommentsOpen(true)}
                    >
                        View all {post.comments.length} comments
                    </p>
                )}
            </div>
        </div>
        <CommentsSheet
            isOpen={isCommentsOpen}
            onOpenChange={setIsCommentsOpen}
            post={post}
        />
        <PostOptionsSheet
            isOpen={isOptionsOpen}
            onOpenChange={setIsOptionsOpen}
            post={post}
        />
    </>
    );
};

const DesktopPostCard = ({ post }: { post: (typeof posts)[0] }) => (
    <Card className="overflow-hidden shadow-md rounded-lg group relative h-full">
        <Link href={`/feed/${post.id}`} className="absolute inset-0 z-0" />
        <Image
            src={post.image.src}
            alt={`Post by ${post.user.name}`}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={post.image.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link href={`/profile/${post.user.username}`} className="relative z-10 flex items-center gap-3">
                <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-white text-sm drop-shadow-md">{post.user.name}</span>
            </Link>
        </div>
    </Card>
);

// TikTok-style Video Card
const VideoCard = ({ video, isActive }: { video: typeof videoData[0]; isActive: boolean }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <div className="relative h-full w-full snap-start snap-always">
            {/* Video/Image Background */}
            <div className="absolute inset-0 bg-black">
                <Image
                    src={video.video}
                    alt={video.caption}
                    fill
                    className="object-cover"
                    priority={isActive}
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Right side actions */}
            <div className="absolute right-3 bottom-32 md:bottom-20 flex flex-col items-center gap-5">
                {/* Profile */}
                <Link href={`/profile/${video.user.username}`} className="relative">
                    <Avatar className="w-12 h-12 border-2 border-white">
                        <AvatarImage src={video.user.avatar} alt={video.user.name} />
                        <AvatarFallback>{video.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <Plus className="h-3 w-3 text-white" />
                    </div>
                </Link>

                {/* Like */}
                <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Heart className={cn("h-6 w-6", isLiked ? "text-accent fill-accent" : "text-white")} />
                    </div>
                    <span className="text-white text-xs font-semibold">{formatNumber(video.likes)}</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold">{formatNumber(video.comments)}</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold">{formatNumber(video.shares)}</span>
                </button>

                {/* Save */}
                <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Bookmark className={cn("h-6 w-6", isSaved ? "text-primary fill-primary" : "text-white")} />
                    </div>
                    <span className="text-white text-xs font-semibold">{formatNumber(video.saves)}</span>
                </button>
            </div>

            {/* Bottom content - positioned above bottom nav on mobile */}
            <div className="absolute bottom-28 md:bottom-4 left-4 right-20 text-white">
                <Link href={`/profile/${video.user.username}`} className="flex items-center gap-2 mb-2">
                    <span className="font-bold">@{video.user.username}</span>
                    <Button size="sm" variant="outline" className="h-7 rounded-full border-white/50 text-white bg-transparent hover:bg-white/20 text-xs">
                        Follow
                    </Button>
                </Link>
                <p className="text-sm mb-2 line-clamp-2">{video.caption}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                    {video.tags.map((tag) => (
                        <span key={tag} className="text-xs text-primary font-medium">{tag}</span>
                    ))}
                </div>
                <p className="text-xs text-white/70">{video.location}</p>
            </div>
        </div>
    );
};

export default function FeedPage() {
    const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [displayedVideos, setDisplayedVideos] = useState(videoData.slice(0, 3));
    const videoContainerRef = useRef<HTMLDivElement>(null);

    const postsWithComments: PostWithComments[] = posts.map(post => ({
        ...post,
        comments: comments[post.id.toString() as keyof typeof comments] || [],
    }));

    // Infinite scroll for videos
    const loadMoreVideos = useCallback(() => {
        if (displayedVideos.length < videoData.length) {
            setDisplayedVideos(prev => [
                ...prev,
                ...videoData.slice(prev.length, prev.length + 2)
            ]);
        } else {
            // Loop back to start for infinite scroll effect
            setDisplayedVideos(prev => [...prev, ...videoData.slice(0, 2)]);
        }
    }, [displayedVideos.length]);

    // Handle scroll for video feed
    useEffect(() => {
        const container = videoContainerRef.current;
        if (!container || activeTab !== 'videos') return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;

            // Update active video index
            const newIndex = Math.round(scrollTop / containerHeight);
            setActiveVideoIndex(newIndex);

            // Load more when near bottom
            if (scrollTop + containerHeight >= scrollHeight - 100) {
                loadMoreVideos();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeTab, loadMoreVideos]);

    return (
        <div className="relative min-h-screen">
            {/* Sticky Tabs - Transparent on videos, liquid glass effect on photos */}
            <div className={cn(
                "sticky top-0 z-40",
                activeTab === 'videos' 
                    ? "bg-transparent" 
                    : "backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-white/20 shadow-sm"
            )}>
                <div className="flex items-center justify-center gap-8 py-4 px-4">
                    <button
                        onClick={() => setActiveTab('photos')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                            activeTab === 'photos' 
                                ? "bg-primary text-primary-foreground" 
                                : activeTab === 'videos'
                                    ? "text-white/90 hover:text-white hover:bg-white/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <ImageIcon className="h-4 w-4" />
                        Photos
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                            activeTab === 'videos' 
                                ? "bg-primary text-primary-foreground" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <Film className="h-4 w-4" />
                        Videos
                    </button>
                </div>
            </div>

            {/* Photos Tab Content */}
            {activeTab === 'photos' && (
                <div className="px-4 md:px-6 pt-4 pb-24 md:pb-8">
                    <header className="space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">Community Posts</h1>
                        <p className="text-muted-foreground md:text-xl/relaxed">
                            See the latest adventures from fellow travelers and locals.
                        </p>
                    </header>

                    {/* Desktop: Bento Box Grid */}
                    <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-4 h-[90vh]">
                        <div className="col-span-2 row-span-2">
                            <DesktopPostCard post={posts[1]} />
                        </div>
                        <div className="col-span-1 row-span-1">
                            <DesktopPostCard post={posts[0]} />
                        </div>
                        <div className="col-span-1 row-span-1">
                            <DesktopPostCard post={posts[4]} />
                        </div>
                        <div className="col-span-2 row-span-1">
                            <DesktopPostCard post={posts[3]} />
                        </div>
                    </div>
                    
                    {/* Mobile: Instagram-style Feed */}
                    <div className="md:hidden flex flex-col -mx-4">
                        {postsWithComments.map((post) => (
                            <MobilePostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            )}

            {/* Videos Tab Content - TikTok Style Full Screen */}
            {activeTab === 'videos' && (
                <div 
                    ref={videoContainerRef}
                    className="fixed inset-0 overflow-y-scroll snap-y snap-mandatory bg-black"
                >
                    {displayedVideos.map((video, index) => (
                        <div 
                            key={`${video.id}-${index}`} 
                            className="h-screen w-full snap-start"
                        >
                            <VideoCard video={video} isActive={index === activeVideoIndex} />
                        </div>
                    ))}
                </div>
            )}

            {/* New Post FAB - only show on photos tab */}
            {activeTab === 'photos' && (
                <Button asChild className="fixed bottom-28 right-4 md:bottom-8 md:right-8 h-16 w-16 rounded-full shadow-lg bg-accent hover:bg-accent/90">
                    <Link href="/feed/new">
                        <Plus className="h-8 w-8 text-accent-foreground" />
                        <span className="sr-only">New Post</span>
                    </Link>
                </Button>
            )}
        </div>
    );
}

