
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Send } from 'lucide-react';
import type { PostWithComments, Comment } from '@/lib/posts';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CommentsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: PostWithComments;
}

const CommentItem = ({ comment, onReply }: { comment: Comment, onReply: (username: string) => void }) => {
    const [isLiked, setIsLiked] = useState(false);
    return (
  <div className="flex flex-col">
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold mr-2">{comment.user.name}</span>
          {comment.text}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span>{comment.time}</span>
          {comment.likes > 0 && <span>{comment.likes} likes</span>}
          <button className="font-semibold" onClick={() => onReply(comment.user.name)}>Reply</button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent" onClick={() => setIsLiked(!isLiked)}>
        <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
      </Button>
    </div>
    {comment.replies && comment.replies.length > 0 && (
      <div className="pl-11 mt-3 space-y-3">
        {comment.replies.map((reply) => {
           const [isReplyLiked, setIsReplyLiked] = useState(false);
            return (
          <div key={reply.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm">
                <span className="font-semibold mr-2">{reply.user.name}</span>
                {reply.text}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>{reply.time}</span>
                    {reply.likes > 0 && <span>{reply.likes} likes</span>}
                    <button className="font-semibold" onClick={() => onReply(reply.user.name)}>Reply</button>
                </div>
            </div>
             <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent" onClick={() => setIsReplyLiked(!isReplyLiked)}>
                <Heart className={cn("h-4 w-4", isReplyLiked && "fill-red-500 text-red-500")} />
            </Button>
          </div>
        )})}
      </div>
    )}
  </div>
)};

export function CommentsSheet({ isOpen, onOpenChange, post }: CommentsSheetProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReplyClick = (username: string) => {
    setReplyingTo(username);
    setCommentText(`@${username} `);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    // If user deletes the @mention, cancel the reply
    if (replyingTo && !text.startsWith(`@${replyingTo} `)) {
      setReplyingTo(null);
    }
    setCommentText(text);
  };

  const handleInputFocus = () => {
    // If the user focuses the input without clicking reply, clear the reply state
    if (!replyingTo) {
      setCommentText('');
    }
  };

  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setReplyingTo(null);
      setCommentText('');
    }
  }, [isOpen]);

  const placeholder = replyingTo ? `Replying to ${replyingTo}...` : "Add a comment...";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="text-center pb-4 border-b">
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-6">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onReply={handleReplyClick} />
            ))}
             {post.comments.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p className="font-semibold">No comments yet</p>
                    <p className="text-sm">Start the conversation.</p>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-auto border-t pt-4 -mb-4 -mx-6 px-4 bg-background">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/50/50?random=99" alt="User" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder={placeholder}
                  value={commentText}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="pr-10" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
