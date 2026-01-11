import * as FileSystem from 'expo-file-system/legacy';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

/**
 * Analyzes an image using OpenAI's Vision API to extract text and describe content
 * @param {string} imageUri - The URI of the image to analyze
 * @param {string} prompt - Custom prompt for the AI (optional)
 * @returns {Promise<string>} - The extracted text/description from the image
 */
export const analyzeImageWithVision = async (
  imageUri,
  prompt = 'Please extract and describe all text content from this image. If there is no text, describe what you see in the image.'
) => {
  try {
    // Read the image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Call OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // or 'gpt-4-turbo' or 'gpt-4o-mini' for faster/cheaper
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};
