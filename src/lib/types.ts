// src/lib/types.ts

// Defines the structure of the form data that will be sent to the API
export interface PostGenerationRequest {
  context: string;
  idea: string;
  audience: string;
  tone: 'formal' | 'casual' | 'inspirational' | 'informational'; // Using specific string literals for tone
  cta: string;
}

// Defines the structure of a successful response from the API
export interface PostGenerationSuccessResponse {
  post: string;
}

// Defines the structure of an error response from the API
export interface PostGenerationErrorResponse {
  error: string;
}