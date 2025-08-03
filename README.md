# LinkedIn Post Enhancer

![Next.js](https://img.shields.io/badge/built%20with-Next.js-000000?style=for-the-badge&logo=nextdotjs)![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

A simple web application that uses AI to help you draft, refine, and optimize engaging posts for LinkedIn. Provide context, an idea, and target parameters, and let the AI generate a polished, ready-to-paste draft.

---

## Features

-   **Context-Aware Generation:** Provide your company or project overview for tailored content.
-   **Idea-Driven:** Input a specific post idea to get a focused draft.
-   **Audience & Tone Targeting:** Refine the post's language by selecting a target audience and tone of voice.
-   **Instant, Editable Drafts:** Generate posts in seconds and edit them directly in the app.
-   **Clean Output:** The AI is strictly instructed to provide plain text output without any conversational filler or Markdown formatting.
-   **Copy to Clipboard:** Easily copy your final post with a single click.
-   **Responsive Design:** Fully usable on both desktop and mobile devices.

---

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
-   **AI Integration:** [Google Gemini API](https://ai.google.dev/)
-   **Deployment:** [Vercel](https://vercel.com/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
-   `npm` or your package manager of choice
-   A **Google AI API Key**. You can get one from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bahyali/llm-tutorial-linkedin-post-enhancer.git
    cd linkedin-post-enhancer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a new file named `.env.local` in the root of the project and add your Google AI API key.

    ```
    # .env.local
    AI_PROVIDER_API_KEY="your_google_api_key_here"
    ```
    > **Important:** The `.env.local` file is listed in `.gitignore` and should never be committed to version control.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

---

## How It Works

The application follows a simple client-server data flow within the Next.js framework:

1.  **Frontend (`enhancer-app.tsx`):** The user fills out the form in a React Client Component. This component manages the state of all inputs.
2.  **API Request:** On submission, the frontend sends a `POST` request to the application's internal API endpoint (`/api/generate`) with the form data in the request body.
3.  **Backend API Route (`route.ts`):** The server-side API route receives the request. It securely accesses the `AI_PROVIDER_API_KEY` from environment variables.
4.  **AI Service (`ai.ts`):** The API route calls a helper function that constructs a detailed prompt from the user's data and sends it to the Google Gemini API.
5.  **Response:** The AI service returns the generated plain text post. The API route sends this back to the frontend as a JSON response.
6.  **Display:** The frontend component receives the response and displays the generated post in the output text area, ready for editing and copying.

---

## Project Structure

The project uses the Next.js App Router with a `src/` directory.

```
linkedin-post-enhancer/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts   # The backend API endpoint
│   │   ├── layout.tsx              # Root layout
│   │   ├── loading.tsx             # Loading UI for the page
│   │   └── page.tsx                # The main page component
│   │
│   ├── components/
│   │   ├── ui/                     # Shadcn/ui components
│   │   └── enhancer-app.tsx        # The main interactive application component
│   │
│   └── lib/
│       ├── ai.ts                   # Logic for building prompts and calling the AI API
│       └── types.ts                # TypeScript type definitions
│
├── .env.local                      # Stores the secret API key
├── package.json
└── README.md
```
