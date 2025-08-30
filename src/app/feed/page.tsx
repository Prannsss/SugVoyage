
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { posts, comments } from '@/lib/posts';
import { useState } from 'react';
import { CommentsSheet } from '@/components/layout/CommentsSheet';
import type { PostWithComments } from '@/lib/posts';
import { cn } from '@/lib/utils';
import { PostOptionsSheet } from '@/components/layout/PostOptionsSheet';
import { PostActions } from '@/components/layout/PostActions';


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

export default function FeedPage() {
    const postsWithComments: PostWithComments[] = posts.map(post => ({
        ...post,
        comments: comments[post.id.toString() as keyof typeof comments] || [],
    }));

    return (
        <div className="relative min-h-screen px-4 md:px-6 pt-20 md:pt-8">
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

        <Button asChild className="fixed bottom-28 right-4 md:bottom-8 md:right-8 h-16 w-16 rounded-full shadow-lg bg-accent hover:bg-accent/90">
            <Link href="/feed/new">
            <Plus className="h-8 w-8 text-accent-foreground" />
            <span className="sr-only">New Post</span>
            </Link>
        </Button>
        </div>
    );
}
