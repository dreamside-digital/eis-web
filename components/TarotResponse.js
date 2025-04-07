"use client";
import { useState } from 'react';
import SavedResponses from './SavedResponses';

export default function TarotResponse({ activePrompt, locale, onSave, savedResponses }) {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  // Only return null if there's no active prompt AND no saved responses
  if (!activePrompt && !savedResponses?.length) return null;

  const translation = activePrompt?.translations.find(t => t.languages_code === locale) || activePrompt?.translations[0];
  const promptText = translation?.prompt || '';
  const category = activePrompt?.category.translations.find(t => t.languages_code === locale) || activePrompt?.category.translations[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!response.trim()) {
      setError('Please write a response before saving');
      return;
    }

    onSave(response.trim());
    setResponse('');
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-white shadow-lg">
      {activePrompt ? (
        <div className="p-6">
          <h3 className="text-xl font-medium mb-4">{category.name}</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
                setError('');
              }}
              className={`w-full h-32 p-4 border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-lavendar`}
              placeholder={promptText}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex justify-end mt-4">
              <button type="submit" className="px-6 py-2 btn">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <SavedResponses responses={savedResponses} locale={locale} />
    </div>
  );
} 