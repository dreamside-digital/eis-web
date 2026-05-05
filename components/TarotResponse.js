"use client";
import { useState, useRef, useEffect } from 'react';
import SavedResponses from './SavedResponses';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

export default function TarotResponse({ activePrompt, locale, onSave, savedResponses }) {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setResponse('');
    setError('');
  }, [activePrompt?.id]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
      const base = baseTextRef.current;
      setResponse(base ? `${base} ${transcript}` : transcript);
      setError('');
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    baseTextRef.current = response;
    recognition.start();
    setIsListening(true);
  };

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
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white shadow-lg">
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
            <div className="flex justify-between items-center mt-4">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  <MicrophoneIcon className="w-5 h-5" />
                </button>
              )}
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