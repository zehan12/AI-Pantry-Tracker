import { Poster } from "@/components/misc/Poster";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <main className="relative z-[5] h-[80vh] flex  flex-col items-center justify-center">
                <Poster />
                <div className="mb-60 z-[100] flex flex-col items-center justify-center">
                    <h1 className="max-w-7xl text-7xl font-semibold text-foreground leading-snug animate-blur-in text-center text-balance">
                        Welcome to
                        <p className="inline-block mx-4 bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.pink.300),theme(colors.sky.400),theme(colors.yellow.200),theme(colors.pink.500))] bg-[length:200%_auto] animate-gradient">
                            Pantry
                        </p>
                        Management System
                    </h1>{" "}
                    <p className="my-5 font-light text-2xl text-gray-500">
                        streamline and simplify your kitchen inventory!
                    </p>
                    <Button className="text-md rounded-full px-10">
                        <Link href={"/pantry"}>Start</Link>
                    </Button>
                </div>
            </main>
        </>
    );
}
