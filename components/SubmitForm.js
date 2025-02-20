"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DOMPurify from "isomorphic-dompurify";

export default function SubmitForm({ responses, onSubmit, error, isSubmitting, isSuccess, onReset }) {
  const t = useTranslations('shared_messages');
  const [email, setEmail] = useState('');   
  const [validationError, setValidationError] = useState('');
  const submitDescription = DOMPurify.sanitize(t.raw('tarot_submit_description'), { USE_PROFILES: { html: true } })
  const thankyouDescription = DOMPurify.sanitize(t.raw('tarot_thank_you_description'), { USE_PROFILES: { html: true } })

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, responses });
  };

  if (isSuccess) {
    return (
      <div className="mt-8 py-4 w-full max-w-2xl text-center">
        <h3 className="text-lg font-medium mb-2">{t('tarot_thank_you_title')}</h3>
        <div className="text-dark text-lg mb-6" dangerouslySetInnerHTML={{ __html: thankyouDescription }} />
        <button 
          onClick={onReset}
          className="py-2 px-4 btn"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 py-4 w-full max-w-2xl text-center">
      <h3 className="text-xl font-medium mb-2">{t('tarot_submit_title')}</h3>
      <div className="text-dark text-lg mb-6" dangerouslySetInnerHTML={{ __html: submitDescription }} />
      <h3 className="text-sm mb-6">{t('tarot_disclaimer')}</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setValidationError('');
          }}
          placeholder="Enter your email"
          className={`w-full p-3 border ${validationError ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-lavendar`}
          disabled={isSubmitting}
        />
        {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
        <button 
          type="submit"
          className="py-2 px-4 btn mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('tarot_submit_sending') : t('tarot_submit_send')}
        </button>
      </form>
    </div>
  );
} 