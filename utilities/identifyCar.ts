// TEAM 3 - Identify Car using chatgpt api

import axios from "axios";

export default async function identifyCarFromImg(img: any):Promise<{ make: string; color: string; model: string; }> {
  // Implementation of the function
  const apikey = process.env.EXPO_PUBLIC_gptAPI;
  try{
    const response = await axios.post<GPTResponse>('https://api.openai.com/v1/chat/completions', 
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: "What is the capital of France?" }],
        max_tokens: 50,
        temperature: 0.7,
      }, 
      {
      headers: {
          'Authorization': `Bearer ${apikey}`,
          'Content-Type': 'application/json',
      }
    });
    console.log(response.data.choices[0].message.content)
  } catch (e) {
  }
  return {color: "red", make: "toyota", model: "highlander"}
}

interface GPTResponse {
  id: string; // Unique identifier for the request
  object: string; // Type of object returned (e.g., "text_completion")
  created: number; // Timestamp of creation
  model: string; // The model used for the request
  choices: GPTChoice[]; // Array of generated choices
  usage: { // Information about token usage
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
  };
}

interface GPTChoice {
  message: {
    content: string;
    refusal: string;
    role: string;
  }; // The generated text
  index: number; // Index of the choice
  logprobs?: any; // Optional: log probabilities for the tokens
  finish_reason: string; // Reason why the generation finished (e.g., "stop", "length")
}