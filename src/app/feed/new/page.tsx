"use client";

import { useState, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Send,
  Image as ImageIcon,
  X,
  Video,
  Globe,
  Users,
  AtSign,
  MapPin,
  Star,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { createPost } from "@/services/postService";

const MAX_IMAGES = 20;
const MAX_VIDEOS = 5;

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  return (
    <div className="flex items-center gap-2 justify-center py-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-10 w-10 cursor-pointer transition-colors",
            star <= rating
              ? "text-accent fill-accent"
              : "text-muted-foreground/50"
          )}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

export default function NewPostPage() {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "friends">("public");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);

  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [isRatingSheetOpen, setIsRatingSheetOpen] = useState(false);
  const [isTaggingSheetOpen, setIsTaggingSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCaptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCaption(event.target.value);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    },
    []
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      if (!selectedFiles.length) return;

      const newFiles = [...files, ...selectedFiles];
      const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
      const videoFiles = newFiles.filter((f) => f.type.startsWith("video/"));

      if (imageFiles.length > MAX_IMAGES) {
        toast({
          title: "Image limit reached",
          description: `You can only upload a maximum of ${MAX_IMAGES} images.`,
          variant: "destructive",
        });
        return;
      }

      if (videoFiles.length > MAX_VIDEOS) {
        toast({
          title: "Video limit reached",
          description: `You can only upload a maximum of ${MAX_VIDEOS} videos.`,
          variant: "destructive",
        });
        return;
      }

      setFiles(newFiles);

      const newPreviews = [...previews];
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });
    },
    [files, previews, toast]
  );

  const removeMedia = useCallback(
    (index: number) => {
      const newFiles = [...files];
      const newPreviews = [...previews];
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);
      setFiles(newFiles);
      setPreviews(newPreviews);
    },
    [files, previews]
  );

  const triggerFileSelect = useCallback(
    () => fileInputRef.current?.click(),
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (files.length === 0) {
        toast({
          title: "Invalid Post",
          description: "Please attach an image to your post.",
          variant: "destructive",
        });
        return;
      }

      if (!location.trim()) {
        toast({
          title: "Invalid Post",
          description: "Please add a location to your post.",
          variant: "destructive",
        });
        return;
      }

      if (rating === 0) {
        toast({
          title: "Invalid Post",
          description: "Please add a star review to your post.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        // For now, use the first image as the post image
        // In a real implementation, you'd upload the file and get the URL
        const imageFile = files[0];
        const imageUrl = URL.createObjectURL(imageFile); // Temporary URL for demo

        const postData = {
          user: "507f1f77bcf86cd799439011", // Mock user ID - replace with actual user ID from auth
          image: {
            src: imageUrl,
            width: 800, // Mock dimensions
            height: 600,
            hint: "user uploaded image",
          },
          caption,
          location,
          rating,
          privacy,
        };

        await createPost(postData);

        toast({
          title: "Post Created!",
          description: "Your story has been shared with the community.",
        });

        router.push("/feed");
      } catch (error) {
        console.error("Error creating post:", error);
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [files, location, rating, caption, privacy, toast, router]
  );

  const PrivacyIcon = privacy === "public" ? Globe : Users;

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 md:px-6 pt-4 md:pt-8 pb-24 md:pb-8">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full h-10 w-10"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight font-headline">
          Create Post
        </h1>
      </header>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="mt-1">
                <AvatarImage
                  src="https://picsum.photos/100/100?random=99"
                  alt="User"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  placeholder="What's on your mind, Alex?"
                  value={caption}
                  onChange={handleCaptionChange}
                  rows={2}
                  className="border-0 focus-visible:ring-0 text-base resize-none overflow-hidden min-h-[40px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-y py-2">
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={triggerFileSelect}
                  aria-label="Add Photo or Video"
                >
                  <ImageIcon className="h-6 w-6" />
                </Button>
                <Sheet
                  open={isTaggingSheetOpen}
                  onOpenChange={setIsTaggingSheetOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      aria-label="Tag People"
                    >
                      <AtSign className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" variant="bottom-minimal">
                    <SheetHeader>
                      <SheetTitle>Tag People</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <Label htmlFor="tag-input" className="sr-only">
                        Tag People
                      </Label>
                      <Input
                        id="tag-input"
                        placeholder="Search for people to tag..."
                      />
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="button"
                          onClick={() => setIsTaggingSheetOpen(false)}
                        >
                          Done
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center gap-1">
                <Sheet
                  open={isLocationSheetOpen}
                  onOpenChange={setIsLocationSheetOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant={location ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(location && "text-primary")}
                    >
                      <MapPin className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" variant="bottom-minimal">
                    <SheetHeader>
                      <SheetTitle>Add Location</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <Label htmlFor="location-input" className="sr-only">
                        Location
                      </Label>
                      <Input
                        id="location-input"
                        placeholder="Where was this photo taken?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="button"
                          onClick={() => setIsLocationSheetOpen(false)}
                        >
                          Done
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <Sheet
                  open={isRatingSheetOpen}
                  onOpenChange={setIsRatingSheetOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant={rating > 0 ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(rating > 0 && "text-accent")}
                    >
                      <Star
                        className={cn("h-5 w-5", rating > 0 && "fill-accent")}
                      />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" variant="bottom-minimal">
                    <SheetHeader>
                      <SheetTitle>Rate this Place</SheetTitle>
                    </SheetHeader>
                    <StarRating rating={rating} setRating={setRating} />
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="button"
                          onClick={() => setIsRatingSheetOpen(false)}
                        >
                          Done
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Privacy Settings"
                    >
                      <PrivacyIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPrivacy("public")}>
                      <Globe className="mr-2 h-4 w-4" />
                      Public
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrivacy("friends")}>
                      <Users className="mr-2 h-4 w-4" />
                      Friends
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-2 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-2 border rounded-lg">
                {previews.map((preview, index) => {
                  const file = files[index];
                  const isVideo = file.type.startsWith("video/");
                  return (
                    <div key={index} className="relative aspect-square">
                      {isVideo ? (
                        <video
                          src={preview}
                          className="w-full h-full object-cover rounded-md bg-muted"
                          controls={false}
                        />
                      ) : (
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                        aria-label={`Remove media ${index + 1}`}
                        title={`Remove media ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {isVideo && (
                        <Video className="absolute bottom-1 left-1 h-5 w-5 text-white drop-shadow-md" />
                      )}
                    </div>
                  );
                })}
                <div
                  className={cn(
                    "flex flex-col items-center justify-center text-center rounded-md border-2 border-dashed cursor-pointer hover:border-primary transition-colors aspect-square",
                    files.filter((f) => f.type.startsWith("image/")).length >=
                      MAX_IMAGES &&
                      files.filter((f) => f.type.startsWith("video/")).length >=
                        MAX_VIDEOS &&
                      "hidden"
                  )}
                  onClick={triggerFileSelect}
                  onKeyDown={(e) => e.key === "Enter" && triggerFileSelect()}
                  role="button"
                  tabIndex={0}
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-xs mt-1 text-muted-foreground">
                    Add Media
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </CardFooter>
        </Card>

        <label htmlFor="media-upload" className="sr-only">
          Upload image or video file
        </label>
        <input
          id="media-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*"
          aria-label="Upload image or video file"
          multiple
        />
      </form>
    </div>
  );
}
