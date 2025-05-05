import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-blue-500 mb-6 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        
        <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white text-center">
          404
        </h2>
        
        <h3 className="text-xl font-medium mb-4 text-gray-600 dark:text-gray-300 text-center">
          Page Not Found
        </h3>
        
        <div className="mb-6 text-gray-600 dark:text-gray-400 text-center">
          <p>The page you are looking for doesn't exist or has been moved.</p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/"
            className="w-full py-2 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Return to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full py-2 text-center border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
} 