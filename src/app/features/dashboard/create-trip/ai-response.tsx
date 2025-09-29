

export default function AiResponse({ aiResponse }: { aiResponse: string }) {
    return (
        <div className="mt-8 p-4 border rounded bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">AI Generated Itinerary</h2>
            <pre className="whitespace-pre-wrap">{aiResponse}</pre>
        </div>
    );
}