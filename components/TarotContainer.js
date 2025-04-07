"use client";
import { useState, useEffect } from 'react';
import TarotCards from './TarotCards';
import TarotResponse from './TarotResponse';
import SubmitForm from './SubmitForm';
import { useTranslations } from 'next-intl';
import DOMPurify from "isomorphic-dompurify";

export default function TarotContainer({ 
  prompts: initialPrompts, 
  locale, 
  profileFlow = false,
  onResponsesChange
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [responses, setResponses] = useState([]);
  const [availablePrompts, setAvailablePrompts] = useState(initialPrompts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const t = useTranslations('profile_form');
  const cleanTarotSectionCompleted = DOMPurify.sanitize(t.raw('tarot_section_completed'), { USE_PROFILES: { html: true } })

  // Update available prompts whenever responses change
  useEffect(() => {
    const usedCategories = responses.map(r => r.categoryId);
    const filteredPrompts = initialPrompts.filter(
      prompt => !usedCategories.includes(prompt.category.id)
    );
    setAvailablePrompts(filteredPrompts);
  }, [responses, initialPrompts]);

  // Add effect to notify parent of responses changes
  useEffect(() => {
    if (onResponsesChange) {
      onResponsesChange(responses);
    }
  }, [responses, onResponsesChange]);

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
      {availablePrompts.length === 0 && responses.length > 0 && !profileFlow &&(
        <SubmitForm 
          responses={responses}
          onSubmit={handleSubmit}
          error={submitError}
          isSubmitting={isSubmitting}
          isSuccess={isSubmitSuccess}
          onReset={handleReset}
        />
      )}

      {availablePrompts.length === 0 && responses.length > 0 && profileFlow && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-center my-4 text-lg" dangerouslySetInnerHTML={{ __html: cleanTarotSectionCompleted }} />
        </div>
      )}
    </>
  );
} 