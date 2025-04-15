"use server"

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProfilePreview(profile) {
  try {
    const { introduction, artistic_practice, current_projects } = profile;

    const prompt = `
      As an art gallery curator, write a compelling one or two sentence summary that captures the essence of this artist's work and practice.
      Write in a sophisticated yet accessible tone. The summary should be concise and engaging.

      Base the summary on these details about the artist:
      ${introduction ? `Artist's Introduction: ${introduction}\n` : ''}
      ${artistic_practice ? `Artistic Practice: ${artistic_practice}\n` : ''}
      ${current_projects ? `Current Projects: ${current_projects}\n` : ''}

      Guidelines:
      - Keep it to 1 sentence maximum, no more than 200 characters
      - Use elegant, curator-style language
      - Focus on the most distinctive aspects of their work
      - Avoid clichés and overly academic jargon
      - Make it engaging for a general audience
      - Don't mention specific projects unless they're particularly significant
      - Don't use the artist's name
      - Don't enclose the output in quotation marks
      - Write it in sentence case
    `;

    const completion = await openai.responses.create({
      model: "gpt-3.5-turbo",
      instructions: "You are an experienced art curator writing engaging headlines for artist profiles.",
      input: prompt,
      temperature: 0.5
    });

    const headline = completion?.output_text
    return headline;

  } catch (error) {
    console.error('Error generating profile headline:', error);
    return null;
  }
}