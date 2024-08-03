import {
    ClerkLoaded,
    ClerkLoading,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { Sidebar, ThemeToggle } from "../shared";
import { Loader, LogIn } from "lucide-react";
import { Button } from "../ui/button";

export const Header = () => {
    // const { isSignedIn } = useUser();
    return (
        <header className="sticky top-0 z-50 p-4 flex items-center justify-between p-s bg-background text-foreground shadow-sm border-b-[1px] border-muted-background">
            <div className="flex items-center gap-2">
                <Sidebar />
                <strong>Pantry Tracker App</strong>
            </div>
            <div className="flex justify-center items-center gap-3">
                <ThemeToggle />
                <ClerkLoading>
                    <Loader className="w-5 h-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button size={"lg"} variant={"ghost"}>
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    );
};
