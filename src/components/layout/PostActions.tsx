
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostWithComments } from '@/lib/posts';

interface PostActionsProps {
  post: PostWithComments;
  onCommentClick: () => void;
}

export function PostActions({ post, onCommentClick }: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center ml-2 gap-3">
          <Button variant="ghost" size="icon" onClick={handleLike} className="h-12 w-12 flex items-center gap-2">
              <Heart className={cn("h-12 w-12", isLiked && "fill-red-500 text-red-500")} />
              <span className="text-sm font-semibold">{likeCount.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onCommentClick} className="h-12 w-12 flex items-center gap-2">
              <MessageCircle className="h-12 w-12" />
                <span className="text-sm font-semibold">{post.commentsCount.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 flex items-center gap-2">
              <Send className="h-12 w-12" />
                <span className="text-sm font-semibold">{post.sharesCount.toLocaleString()}</span>
          </Button>
      </div>
      <div className="flex items-center -mr-2">
            <Button variant="ghost" size="icon" onClick={handleBookmark} className="h-12 w-12">
              <Bookmark className={cn("h-12 w-12", isBookmarked && "fill-foreground text-foreground")} />
          </Button>
      </div>
    </div>
  );
}
