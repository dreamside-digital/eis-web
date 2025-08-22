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

export async function generateOracleResponse(responses) {
  try {

    const prompt = `
      Please create a 150 word fortune / tarot reading based on the inputs by an artist to the questions below. Make the tarot reading in the voice of Anais Nin (the writer) but add a mysterious mystical tone, as if she is an oracle delivering not a prediction but observing a pattern and connecting to larger mystical beliefs and symbols of the unconscious.
 
      Base the tarot reading on these responses to creative prompts:
      ${responses[0] ? `${responses[0].prompt}: ${responses[0].response}\n` : ''}
      ${responses[1] ? `${responses[1].prompt}: ${responses[1].response}\n` : ''}
      ${responses[2] ? `${responses[2].prompt}: ${responses[2].response}\n` : ''}

      Guidelines:
      - Keep it to 150 words maximum, no more than 750 characters
      - Focus on the most distinctive aspects of their responses
      - Avoid clichés and overly dramatic language
      - Don't enclose the output in quotation marks
      - Write it in sentence case
      - Use the word "you" to refer to the artist
    `;

    const completion = await openai.responses.create({
      model: "gpt-3.5-turbo",
      instructions: "You are an experienced oracle writing insightful fortunes / tarot readings in responses to creative prompts.",
      input: prompt,
      temperature: 0.5
    });

    const fortune = completion?.output_text
    return fortune;

  } catch (error) {
    console.error('Error generating oracle response:', error);
    return null;
  }
}