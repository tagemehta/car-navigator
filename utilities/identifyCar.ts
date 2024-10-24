// TEAM 3 - Identify Car using chatgpt api

import axios from "axios";

export default async function identifyCarFromImg(data: string):Promise<{ make: string; color: string; model: string; }> {
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
    const values = response.data.choices[0].message.content.split(" ")
    const information = {color: values[0], make: values[1], model: values[2]}
    // Return info to console (debug feature) and return information for other software
    console.log(information)
    return information
  } catch (e) {
    // Print any errors
    console.log(e)
  }
  // Default return if there is an error
  console.log("Do you have the right API key?")
  return {color: "Undef", make: "Undef", model: "Undef"}
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