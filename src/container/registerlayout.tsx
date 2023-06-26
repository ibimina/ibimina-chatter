import { HeroAside } from "@/components";


function RegistrationLayout({ children }: { children: React.ReactNode }) {
    return (<>
        <main className={` min-h-screen flex items-center justify-center lg:flex lg:flex-row`}>
            <HeroAside />
            <section className={`basis-full px-6 md:basis-4/5 bg-white grid justify-center items-center`}>
                <h1 className={`font-bold absolute top-3 sm:top-6 md:top-10 md:left-8 left-4 text-4xl mb-4 md:mb-14 lg:hidden font-serif text-transparent bg-clip-text bg-gradient-to-br  from-purple-600 to-blue-500 `}>InkSpire</h1>
                {children}
            </section>
        </main>

    </>);
}

export default RegistrationLayout;