"use client";
import { useState, useEffect } from 'react';
import TarotCards from './TarotCards';
import TarotResponse from './TarotResponse';
import SubmitForm from './SubmitForm';

export default function TarotContainer({ prompts: initialPrompts, locale }) {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [responses, setResponses] = useState([]);
  const [availablePrompts, setAvailablePrompts] = useState(initialPrompts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Update available prompts whenever responses change
  useEffect(() => {
    const usedCategories = responses.map(r => r.categoryId);
    const filteredPrompts = initialPrompts.filter(
      prompt => !usedCategories.includes(prompt.category.id)
    );
    setAvailablePrompts(filteredPrompts);
  }, [responses, initialPrompts]);

  const handleResponseSave = (response) => {
    if (!response || !response.trim()) {
      return;
    }

    const category = selectedPrompt.category.translations.find(t => t.languages_code === locale) 
      || selectedPrompt.category.translations[0];

    setResponses(prev => [...prev, {
      promptId: selectedPrompt.id,
      promptText: selectedPrompt.translations.find(t => t.languages_code === locale)?.prompt || '',
      categoryId: selectedPrompt.category.id,
      categoryName: category.name,
      response: response.trim()
    }]);
    setSelectedPrompt(null);
  };

  const handleSubmit = async ({ email, responses }) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/submit-tarot-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, responses }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit responses');
      }
      
      setIsSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setSubmitError(error.message || 'Failed to submit responses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedPrompt(null);
    setResponses([]);
    setAvailablePrompts(initialPrompts);
    setSubmitError('');
    setIsSubmitSuccess(false);
  };

  return (
    <>
      <TarotCards 
        prompts={availablePrompts} 
        locale={locale} 
        setSelectedPrompt={setSelectedPrompt}
      />
      <TarotResponse 
        activePrompt={selectedPrompt} 
        locale={locale}
        onSave={handleResponseSave}
        savedResponses={responses}
      />
      {availablePrompts.length === 0 && responses.length > 0 && (
        <SubmitForm 
          responses={responses}
          onSubmit={handleSubmit}
          error={submitError}
          isSubmitting={isSubmitting}
          isSuccess={isSubmitSuccess}
          onReset={handleReset}
        />
      )}
    </>
  );
} 