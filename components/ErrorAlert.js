"use client";
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ErrorAlert({ errors, setErrors }) {
  if (!errors?.length) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto max-w-screen-md px-4">
        <div className="bg-orange shadow-xl">
          <div className="flex items-start justify-between p-4">
            <div className="flex-1 flex flex-col gap-1">
              {errors.map((error, index) => (
                <p key={index} className="text-white font-medium mb-0">
                  {error.message}
                </p>
              ))}
            </div>
            <button
              onClick={() => setErrors(null)}
              className="ml-4 text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 