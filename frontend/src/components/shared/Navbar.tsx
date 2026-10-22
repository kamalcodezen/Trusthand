
"use client";

import Link from "next/link";
import {
    ArrowRight,
    Hammer,
    Menu,
    Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";


const mainLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Trust & Safety", href: "/#trust-safety" },
    { label: "Pricing Guide", href: "/pricing-guide" },
];


function Brand() {
    return (
        <Link
            href="/"
            className="flex shrink-0 items-center gap-[7px]"
            aria-label="TrustHand Home"
        >
            <span className="relative grid size-[26px] shrink-0 place-items-center rounded-[8px] bg-[#184C3B] text-white">
                <Wrench
                    aria-hidden="true"
                    size={13}
                    strokeWidth={2.4}
                    className="absolute -rotate-45"
                />

                <Hammer
                    aria-hidden="true"
                    size={13}
                    strokeWidth={2.4}
                    className="absolute rotate-45"
                />
            </span>

            <span className="flex flex-col leading-none">
                <span className="text-[12px] font-extrabold tracking-[-0.45px] text-[#1B2A23]">
                    TrustHand
                </span>

                <span className="mt-[4px] whitespace-nowrap text-[7px] font-medium tracking-[-0.12px] text-[#5C6D63]">
                    Dhaka Neighbourhood Trades
                </span>
            </span>
        </Link>
    );
}


export default function Navbar() {
    return (
        <header className="relative z-50 w-full border-b border-[#E6E7E3] bg-[#FAF9F5] font-['Manrope']">
            <div className="mx-auto flex h-[56px] max-w-[1440px] items-center justify-between px-5 min-[800px]:px-[5.6%]">

                <Brand />


                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-[18px] min-[800px]:flex"
                >
                    {mainLinks.map((link, index) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`whitespace-nowrap text-[9px] font-semibold transition-colors duration-200 hover:text-[#184C3B] ${index === 0
                                    ? "text-[#184C3B]"
                                    : "text-[#526159]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}


                    <Link
                        href="/become-a-professional"
                        className="whitespace-nowrap text-[9px] font-bold text-[#184C3B] transition-opacity duration-200 hover:opacity-70"
                    >
                        Become a Professional
                    </Link>


                    <span
                        aria-hidden="true"
                        className="h-[12px] w-px bg-[#D5DAD4]"
                    />


                    <Link
                        href="/sign-in"
                        className="whitespace-nowrap text-[9px] font-semibold text-[#526159] transition-colors duration-200 hover:text-[#184C3B]"
                    >
                        Sign In
                    </Link>


                    <Link
                        href="/find-a-worker"
                        className="inline-flex h-[27px] shrink-0 items-center justify-center gap-[5px] rounded-full bg-[#184C3B] px-[13px] text-[9px] font-bold text-white shadow-none transition-colors duration-200 hover:bg-[#103C2F]"
                    >
                        Find a Worker
                        <ArrowRight size={11} strokeWidth={1.8} />
                    </Link>

                </nav>


                <Sheet>
                    <SheetTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open navigation menu"
                                className="text-[#184C3B] min-[800px]:hidden"
                            >
                                <Menu className="size-5" />
                            </Button>
                        }
                    />

                    <SheetContent
                        side="right"
                        className="w-[300px] border-[#E6E7E3] bg-[#FAF9F5] p-6 font-['Manrope']"
                    >
                        <SheetHeader className="p-0 text-left">
                            <SheetTitle className="text-[#1B2A23]">
                                TrustHand
                            </SheetTitle>
                        </SheetHeader>

                        <nav
                            aria-label="Mobile navigation"
                            className="mt-8 flex flex-col gap-5"
                        >
                            {[
                                ...mainLinks,
                                {
                                    label: "Become a Professional",
                                    href: "/become-a-professional",
                                },
                                {
                                    label: "Sign In",
                                    href: "/sign-in",
                                },
                            ].map((link) => (
                                <SheetClose
                                    key={link.label}
                                    render={
                                        <Link
                                            href={link.href}
                                            className="text-sm font-semibold text-[#1B2A23] transition-colors hover:text-[#184C3B]"
                                        >
                                            {link.label}
                                        </Link>
                                    }
                                />
                            ))}


                            <SheetClose
                                render={
                                    <Button
                                        render={
                                            <Link href="/find-a-worker">
                                                Find a Worker
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        }
                                        className="mt-2 w-full rounded-full bg-[#184C3B] text-white hover:bg-[#103C2F]"
                                    />
                                }
                            />
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
