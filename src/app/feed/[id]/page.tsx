
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { findPostById } from '@/lib/posts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { PostOptionsSheet } from '@/components/layout/PostOptionsSheet';
import { CommentsSheet } from '@/components/layout/CommentsSheet';
import type { PostWithComments } from '@/lib/posts';
import { PostActions } from '@/components/layout/PostActions';

const PostDetails = ({ post }: { post: PostWithComments }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    
    return (
    <>
        <div className="flex flex-col h-full">
            {/* User Header */}
            <div className="flex items-center justify-between p-4 border-b">
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
            
            {/* Image for Mobile */}
            <div className={cn(
                "relative bg-black flex items-center justify-center md:hidden",
                "h-[60vh]"
            )}>
                 <Image
                    src={post.image.src}
                    alt={`Post by ${post.user.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={post.image.hint}
                    priority
                />
            </div>

            {/* Post Info & Actions */}
            <div className="px-4 pb-4 flex-1 overflow-auto space-y-1">
                 <PostActions post={post} onCommentClick={() => setIsCommentsOpen(true)} />
                 <p className="text-sm">
                    <Link href={`/profile/${post.user.username}`} className="font-semibold mr-2">{post.user.name}</Link>
                    {post.caption}
                </p>
                 {post.comments.length > 0 && (
                    <p className="text-xs text-muted-foreground cursor-pointer hover:underline" onClick={() => setIsCommentsOpen(true)}>
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
)};


export default function PostDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const post = findPostById(id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 pt-24 md:pt-12">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-muted-foreground">Sorry, we couldn't find the post you're looking for.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/feed">Back to Feed</Link>
        </Button>
      </div>
    );
  }
  
  const aspectRatio = post.image.width / post.image.height;
  const isVertical = aspectRatio < 1;

  return (
    <div className="w-full h-full pt-24 md:pt-12">
         <Link href="/feed" className="hidden md:inline-flex items-center justify-center absolute top-20 left-4 z-10 p-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors md:left-72">
            <ArrowLeft className="h-6 w-6"/>
        </Link>
        
        {/* Mobile View */}
        <div className="md:hidden">
            <PostDetails post={post} />
        </div>

        {/* Desktop View */}
        <div className={cn(
            "hidden md:grid w-full h-full",
            isVertical ? "md:grid-cols-2" : "max-w-4xl mx-auto"
        )}>
            <div className={cn(
                "relative bg-black flex items-center justify-center",
                 "h-full md:rounded-lg md:overflow-hidden"
            )}>
                 <Image
                    src={post.image.src}
                    alt={`Post by ${post.user.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={post.image.hint}
                    priority
                />
            </div>
            <div className={cn(
                "border-l", 
                isVertical ? "" : "border-l-0"
             )}>
                <PostDetails post={post} />
            </div>
        </div>
    </div>
  );
}
