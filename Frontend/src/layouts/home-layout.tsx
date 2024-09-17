import Navbar from "@/components/navbar/navbar";


function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen">
            <Navbar />
            {children}
        </section>
    );
}

export default HomeLayout;
