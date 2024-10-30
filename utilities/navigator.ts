// TEAM 3 - Identify Car using chatgpt api

import axios, { AxiosError } from "axios";

export default async function navigateToCar(data: string, obj: any):Promise<'no_car'| 'Left' | 'Center' | 'Right' | 'error'> {
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
              "text": `There should be a car with the following make, model and color in the image given: ${obj.make} ${obj.model} and ${obj.color}. If there isn't, return "no_car". Otherwise, tell me the location of the car in the image in one word as defined by the following. "Left" if the car is in the left of the image. "Right" if the car is in the right of the image. "Center" if the car is in the center of the image.`,
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
                  "description": `"no_car" if a car with make ${obj.make} model ${obj.model} and color ${obj.color} is not in the image,"Left" if the car is in the left of the image, "Right" if the car is in the right of the image, "Center" if the car is in the center of the image.`,
                  "enum": ["no_car", "Left", "Right", "Center"]
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
    console.log(JSON.parse(response.data.choices[0].message['content'])['result'])
    return JSON.parse(response.data.choices[0].message['content'])['result'] || 'error'
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
    content: string;
  }
}