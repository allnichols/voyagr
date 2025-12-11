
interface LoadingOverlayProps {
  isVisible?:boolean;
  isLoading?:boolean;
  error: boolean;
  onRetry: () => void;
  onCancel: () => void;
  currentAttempt: number;
  maxAttempts: number;
}

export default function LoadingOverlay({
  isVisible = true,
  isLoading = false,
  error,
  onRetry,
  onCancel,
  currentAttempt,
  maxAttempts,
}: LoadingOverlayProps) {

  if(!isVisible) {
    return null;
  }

  return (
   <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-white h-full rounded-lg p-6 max-w-md w-full mx-4">
        {isLoading && (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-2">Creating Your Trip</h3>
            <p className="text-gray-600 mb-4">
              {currentAttempt > 1 
                ? `Retrying... (Attempt ${currentAttempt} of ${maxAttempts + 1})`
                : "We're planning something amazing for you!"
              }
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentAttempt / (maxAttempts + 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// : error ? (
//           <div className="text-center">
//             <div className="mb-4">
//               <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
//                 <span className="text-red-500 text-xl">✕</span>
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Trip Creation Failed</h3>
//             <p className="text-gray-600 mb-4">
//               We couldn't create your trip after {maxAttempts + 1} attempts. Please check your connection and try again.
//             </p>
//             <div className="flex space-x-3">
//               <button 
//                 onClick={onRetry}
//                 className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Try Again
//               </button>
//               <button 
//                 onClick={onCancel}
//                 className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : null}