"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { PostWithComments } from "@/lib/posts";
import {
  Languages,
  Bookmark,
  Link as LinkIcon,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface PostOptionsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: PostWithComments;
}

export function PostOptionsSheet({
  isOpen,
  onOpenChange,
  post,
}: PostOptionsSheetProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const postUrl = `${window.location.origin}/feed/${post.id}`;
      navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link Copied!",
        description: "The link to the post has been copied to your clipboard.",
      });
      onOpenChange(false);
    }
  };

  const handleReport = () => {
    onOpenChange(false);
    router.push(`/report/${post.user.username}`);
  };

  const isCurrentUserPost = post.user.username === user?.username;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl flex flex-col max-h-[90vh] py-6 gap-0"
      >
        <SheetHeader className="text-center pb-4 -mt-2">
          <SheetTitle>Post Options</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-base"
          >
            <Languages className="mr-4" /> Translate
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-base"
          >
            <Bookmark className="mr-4" /> Save
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-base"
            onClick={handleCopyLink}
          >
            <LinkIcon className="mr-4" /> Copy Link
          </Button>
          <Separator className="my-2" />
          {!isCurrentUserPost && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-base text-destructive hover:text-destructive"
              >
                <ShieldAlert className="mr-4" /> Block
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-base text-destructive hover:text-destructive"
                onClick={handleReport}
              >
                <AlertCircle className="mr-4" /> Report
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
