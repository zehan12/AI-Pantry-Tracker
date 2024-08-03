"use client";
import { useOnClickOutside } from "@/hooks";
import { FC, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link"; // Import Link for internal navigation
import {
    Github,
    Home,
    Link2Icon,
    Linkedin,
    Menu,
    User,
    User2,
} from "lucide-react"; // Import Home and Menu icons

export const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = (state: boolean) => setOpen(state);

    return (
        <>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="custom-btn"
            >
                <Menu className="text-[1.2rem]" />
            </button>
            <AnimatePresence mode="wait" initial={false}>
                {open && <Panel setOpen={handleOpen} />}
            </AnimatePresence>
        </>
    );
};

interface Panel {
    setOpen: (state: boolean) => void;
}

const Panel: FC<Panel> = ({ setOpen }) => {
    const ref = useRef<HTMLDivElement>(null); // Specify the ref type
    useOnClickOutside(ref, () => setOpen(false));

    return (
        <motion.div
            {...framer_background}
            className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-muted-background backdrop-blur-sm"
        >
            <motion.div
                ref={ref}
                {...framer_modal}
                className="h-full w-full max-w-[20rem] flex-col flex justify-between dark:border-gray-800 dark:border-r-2"
            >
                <div>
                    <div className="flex items-center justify-between p-5 bg-background">
                        <h2 className="font-bold">Menu</h2>
                        <button
                            className="custom-btn"
                            onClick={() => setOpen(false)}
                        >
                            <AiOutlineRollback />
                        </button>
                    </div>

                    <ul>
                        {socials_data.map((item) => {
                            const { Icon, title, url } = item;
                            return (
                                <li key={title}>
                                    {url.startsWith("http") ? (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-5 text-sm font-bold transition-colors text-muted-foreground hover:text-foreground bg-background"
                                        >
                                            {title}
                                            <Icon />
                                        </a>
                                    ) : (
                                        <Link
                                            href={url}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center justify-between p-5 text-sm font-bold transition-colors text-muted-foreground hover:text-foreground bg-background"
                                        >
                                            {title}
                                            <Icon />
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-5 text-sm font-bold text-center">
                    <p>Pantry Tracker App</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

import { SiLinkedin, SiTwitter } from "react-icons/si";

export const socials_data = [
    {
        title: "Home",
        url: "/",
        Icon: Home,
    },
    {
        title: "Pantry",
        url: "/pantry",
        Icon: Home,
    },
    {
        title: "Inventory",
        url: "/inventory",
        Icon: Home,
    },
    {
        title: "Recipe Generation",
        url: "/recipe",
        Icon: Home,
    },
    {
        title: "Source Code",
        url: "https://github.com/zehan12/",
        Icon: Github,
    },
    {
        title: "My Portfolio",
        url: "http://yazdun.com/",
        Icon: User2,
    },
    {
        title: "LinkedIn",
        url: "https://www.linkedin.com/",
        Icon: Linkedin,
    },
];

export const framer_background = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { delay: 0.2 } },
    transition: { duration: 0.3 },
};

export const framer_modal = {
    initial: { x: "-100%" },
    animate: { x: 0, transition: { delay: 0.1, duration: 0.2 } },
    exit: { x: "-100%" },
    transition: { duration: 0.2 },
};
