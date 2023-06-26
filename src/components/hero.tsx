function HeroAside() {
    return (<aside
        className={`hidden bg-hero-pattern bg-no-repeat bg-cover lg:w-full lg:block lg:h-screen lg:basis-3/5 `}
    >
        <div className='ml-10 mt-16 max-w-sm'>
            <h1 className={`font-bold text-3xl mb-4 font-serif text-white`}>InkSpire</h1>
            <p className='text-white font-serif font-bold text-xl'>
                A platform for writers to share their ideas and stories with the world.{' '}
            </p>
        </div>
    </aside> );
}

export default HeroAside;