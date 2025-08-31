
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { findUserByUsername, findPostsByUsername, type Post } from '@/lib/posts';
import { Grid3x3, Bookmark, Settings, UserPlus, UserMinus, ShieldAlert, AlertCircle } from 'lucide-react';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const DesktopPostCard = ({ post }: { post: Post }) => (
    <div className="group relative aspect-square overflow-hidden">
         <Link href={`/feed/${post.id}`}>
            <Image
                src={post.image.src}
                alt={`Post by ${post.user.name}`}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={post.image.hint}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    </div>
);

const FollowButton = ({ ...props }: ButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowClick = () => {
        setIsFollowing(true);
    };

    const handleUnfollow = () => {
        setIsFollowing(false);
    };
    
    if (isFollowing) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant='secondary' {...props}>
                        <UserMinus className="mr-2 h-4 w-4" />
                        Following
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader className="text-left">
                        <SheetTitle>Unfollow this user?</SheetTitle>
                        <SheetDescription>
                            Are you sure you want to unfollow this person? You can always follow them back later.
                        </SheetDescription>
                    </SheetHeader>
                    <SheetFooter className="grid grid-cols-2 gap-4 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleUnfollow} className={cn(
                            "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        )}>
                            Unfollow
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }


    return (
        <Button
            variant={'default'}
            onClick={handleFollowClick}
            {...props}
        >
            <UserPlus className="mr-2 h-4 w-4" />
            {'Follow'}
        </Button>
    );
};


export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const userProfile = findUserByUsername(username);
    const userPosts = findPostsByUsername(username);

    // This is a stand-in for actual authentication
    const isCurrentUser = username === 'alex_doe';

    if (!userProfile) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8 pt-24 md:pt-12">
                <h1 className="text-2xl font-bold">User not found</h1>
                <p className="text-muted-foreground">Sorry, we couldn't find the profile you're looking for.</p>
                <Button asChild variant="link" className="mt-4">
                <Link href="/feed">Back to Feed</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="px-4 md:px-6 pt-24 md:pt-12 space-y-4">
                <header>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full">
                        <Avatar className="h-24 w-24 md:h-36 md:w-36 border-4 border-primary shrink-0">
                            <AvatarImage src={userProfile.avatar} alt={userProfile.name} data-ai-hint="person portrait"/>
                            <AvatarFallback>{userProfile.name.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-4 w-full text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 w-full">
                                <h1 className="text-2xl font-semibold font-headline">{userProfile.username}</h1>
                                 <div className="hidden md:flex items-center gap-2">
                                   {isCurrentUser ? (
                                        <>
                                           <EditProfileDialog userProfile={userProfile}>
                                             <Button>Edit Profile</Button>
                                           </EditProfileDialog>
                                           <Button variant="secondary" asChild>
                                               <Link href="/messages">Messages</Link>
                                           </Button>
                                            <Button size="icon" variant="ghost" asChild>
                                                <Link href="/settings">
                                                    <Settings className="h-5 w-5" />
                                                </Link>
                                            </Button>
                                        </>
                                   ) : (
                                       <>
                                         <FollowButton />
                                         <Button variant="secondary" asChild>
                                             <Link href={`/messages?with=${username}`}>Message</Link>
                                         </Button>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                <Settings className="h-5 w-5" />
                                                <span className="sr-only">Settings</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <ShieldAlert className="mr-2" />
                                                            Block
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Block {userProfile.name}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                They will not be able to find your profile, posts, or story. They will not be notified that you have blocked them.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Block</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/report/${username}`}>
                                                        <AlertCircle className="mr-2" />
                                                        Report
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                       </>
                                   )}
                               </div>
                            </div>

                             <div className="hidden md:block">
                                <h2 className="font-bold">{userProfile.name}</h2>
                                <p className="text-muted-foreground text-sm">{userProfile.bio}</p>
                                <p className="text-sm mt-2">{userProfile.description}</p>
                            </div>
                            
                            <div className="md:hidden text-center">
                                <h2 className="font-bold">{userProfile.name}</h2>
                                <p className="text-muted-foreground text-sm">{userProfile.bio}</p>
                                <p className="text-sm mt-1">{userProfile.description}</p>
                            </div>
                            
                            <div className="flex md:hidden items-center gap-2 w-full pt-4">
                               {isCurrentUser ? (
                                    <>
                                        <EditProfileDialog userProfile={userProfile}>
                                            <Button size="sm" className="flex-1">Edit Profile</Button>
                                        </EditProfileDialog>
                                        <Button size="sm" variant="secondary" className="flex-1" asChild>
                                            <Link href="/messages">Messages</Link>
                                        </Button>
                                        <Button size="icon" variant="ghost" asChild>
                                            <Link href="/settings">
                                                <Settings className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    </>
                               ) : (
                                   <>
                                     <FollowButton size="sm" className="flex-1" />
                                     <Button size="sm" variant="secondary" className="flex-1" asChild>
                                         <Link href={`/messages?with=${username}`}>Message</Link>
                                     </Button>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="flex-none">
                                            <Settings className="h-5 w-5" />
                                            <span className="sr-only">Settings</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <ShieldAlert className="mr-2" />
                                                            Block
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Block {userProfile.name}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                They will not be able to find your profile, posts, or story. They will not be notified that you have blocked them.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Block</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/report/${username}`}>
                                                        <AlertCircle className="mr-2" />
                                                        Report
                                                    </Link>
                                                </DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                   </>
                               )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="w-full">
                    <div className="flex justify-around items-center w-full border-y py-2">
                        <div className="text-center">
                            <p className="font-bold">{userProfile.postCount}</p>
                            <p className="text-xs text-muted-foreground">posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">{userProfile.followers}</p>
                            <p className="text-xs text-muted-foreground">followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">{userProfile.following}</p>
                            <p className="text-xs text-muted-foreground">following</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
              <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent rounded-none">
                      <TabsTrigger value="posts" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
                          <Grid3x3 className="mr-2 h-5 w-5" /> POSTS
                      </TabsTrigger>
                       <TabsTrigger value="saved" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
                          <Bookmark className="mr-2 h-5 w-5" /> SAVED
                      </TabsTrigger>
                  </TabsList>
                  <TabsContent value="posts" className="mt-0">
                       <div className="grid grid-cols-3 md:gap-1">
                          {userPosts.map((post) => (
                             <DesktopPostCard key={post.id} post={post} />
                          ))}
                      </div>
                      {userPosts.length === 0 && (
                          <div className="text-center py-20 rounded-lg">
                            <Grid3x3 className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No posts yet</h3>
                            <p className="text-muted-foreground mt-1 text-sm">This user hasn't shared any posts.</p>
                          </div>
                      )}
                  </TabsContent>
                   <TabsContent value="saved" className="mt-0">
                      <div className="text-center py-20 rounded-lg">
                          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-semibold">No saved posts yet</h3>
                          <p className="text-muted-foreground mt-1 text-sm">You haven't saved any posts.</p>
                      </div>
                  </TabsContent>
              </Tabs>
            </div>
        </div>
    );
}
