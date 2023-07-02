import FeedLayout from "@/container/feedslayout";


function Custom404() {
    return (<>


        <FeedLayout>
            <main className={`w-full flex items-center  h-full`}>
                <div>
                    <h2 className="block text-4xl font-medium mb-5">
                        Page not found
                    </h2>
                    <p className="text-gray-400 text-base">Sorry, the page you are looking for does not exist or has been moved.</p>
                </div>


            </main>

        </FeedLayout>
    </>);
}

export default Custom404;