import { ThemeToggle } from "../common";

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 p-4 flex items-center justify-between p-s bg-background text-foreground shadow-sm dark:shadow-transparent dark:border-b-2 dark:border-b-gray-800 dark:bg-dark-800">
            <div className="flex items-center gap-2">
                <strong>Pantry Tracker App</strong>
            </div>
            <ThemeToggle />
        </header>
    );
};
