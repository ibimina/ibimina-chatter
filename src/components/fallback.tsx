
function FallbackRender({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Something went wrong:</h1>
                    <pre className="text-red-500">{error.message}</pre>         
                    <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={resetErrorBoundary}>Try again</button>
                </div>
            </div>
        </>

    );
}
export default FallbackRender;