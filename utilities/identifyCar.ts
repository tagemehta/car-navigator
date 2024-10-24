// TEAM 3 - Identify Car using chatgpt api

import axios, { AxiosError } from "axios";

export default async function identifyCarFromImg(data: string, obj: any):Promise<'no_car'| 'correct' | 'incorrect' | 'error'> {
  // Implementation of the function
  const apikey = process.env.EXPO_PUBLIC_gptAPI;
  // Change the data below to modify the image input (testing purposes)
  try{
    // Axios API call to GPT API
    const response = await axios.post<GPTResponse>('https://api.openai.com/v1/chat/completions', 
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', 
            content: [
            {
              "type": "text",
              "text": "Tell me the make, color, and model of the car in this image and return the data in the format of color make model.",
            },
            {
              "type": "image_url",
              "image_url": {
                "url":  `data:image/jpeg;base64,${data}`
              },
            },
          ]}
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            "name": "car_information_verifier",
            "schema": {
              "type": "object",
              "properties": {
                "result": {
                  "description": `Return correct if the car is ${obj.make} ${obj.model} and ${obj.color}, return incorrect if the car is not ${obj.make} ${obj.model} and ${obj.color}, return no_car if there is no car in the image.`,
                  "enum": ["correct", "incorrect", "no_car"]
                }
              }

            }
          }
        },
        max_tokens: 50,
        temperature: 0.7,
      }, 
      {
      headers: {
          'Authorization': `Bearer ${apikey}`,
          'Content-Type': 'application/json',
      }
    });
    // Get the text returned by GPT and split it by spaces to get the color, make, and model
    return response.data.choices[0].message.content
  } catch (e: AxiosError | any) {
    return 'error'
  }
  // Default return if there is an error
  return 'error'
}

// Structure that represents the type of data that GPT returns
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

// interface GPTChoice {
//   message: {
//     content: string;
//     refusal: string;
//     role: string;
//   }; // The generated text
//   index: number; // Index of the choice
//   logprobs?: any; // Optional: log probabilities for the tokens
//   finish_reason: string; // Reason why the generation finished (e.g., "stop", "length")
// }

interface GPTChoice {
  message: {
    content: 'no_car' | 'correct' | 'incorrect'
  }
}