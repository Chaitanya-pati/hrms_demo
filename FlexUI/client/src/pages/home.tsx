import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirect to the vanilla HTML/CSS/JS HRMS application
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading HRMS Application...</p>
      </div>
    </div>
  );
}
