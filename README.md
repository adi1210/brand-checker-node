Backend (Node.js + Express)

Features

/check POST endpoint
Secure Gemini API key using environment variables
Uses model: gemini-2.5-flash
Temperature fixed: 0.1
Structured prompt ensures consistent list output
Extracts brand mention using fuzzy matching
Provides position of mention
Canned fallback answer when model fails
No database needed

Install Dependencies:-
cd brand-checker-node
npm install

Run Locally:-
npm run dev

Backend runs at:-
http://localhost:3000

Environment Variables:-
GEMINI_API_KEY=your_key_here

Test Manually:-
POST http://localhost:3000/check
Content-Type: application/json

{
  "prompt": "Give a list of best marketing analytics tools",
  "brand": "Matomo"
}

