"use client";
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SavedResponses({ responses, locale }) {
  const [openCategory, setOpenCategory] = useState(null);

  if (!responses.length) return null;

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="">
      <div>
        {responses.map((response, index) => (
          <div key={response.promptId} className="px-6 py-3 border-t">
            <button
              onClick={() => toggleCategory(response.categoryId)}
              className="w-full flex justify-between items-center text-lg font-medium text-dark"
            >
              <span>{response.categoryName}</span>
              <ChevronDownIcon 
                className={`w-5 h-5 transition-transform ${openCategory === response.categoryId ? 'rotate-180' : ''}`}
              />
            </button>
            {openCategory === response.categoryId && (
              <div className="pt-2">
                <p className="whitespace-pre-wrap">{response.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 