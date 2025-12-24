import { Link } from "wouter";

export function Footer() {
    return (
        <footer className="bg-accent text-accent-foreground py-16 px-4 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-3xl font-display font-bold tracking-tighter">
                        Frippy<span className="text-primary italic">Froppy</span><span className="text-primary text-4xl leading-none">.</span>
                    </div>
                    <p className="text-accent-foreground/60 text-sm max-w-xs leading-relaxed">
                        Curated vintage fashion for the modern soul. Sustainable, stylish, and pre-loved.
                    </p>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <h4 className="font-bold text-lg mb-2">Quick Links</h4>
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link>
                    <Link href="/cart" className="hover:text-primary transition-colors">Your Cart</Link>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <h4 className="font-bold text-lg mb-2">Admin</h4>
                    <Link href="/admin" className="hover:text-primary transition-colors">Manage Store</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-accent-foreground/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-accent-foreground/50 text-xs">
                    © 2025 Frippy Froppy. by IBM. All rights reserved.
                </p>
                <div className="flex gap-6 text-xs text-accent-foreground/40">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
