import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow"
            >
                {children}
            </motion.main>
            <Footer />
        </div>
    );
}
