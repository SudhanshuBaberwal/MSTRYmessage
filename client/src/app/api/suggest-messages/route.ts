import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 60,
    temperature: 0.9,
    messages: [
      {
        role: "user",
        content: "Create three open-ended anonymous questions separated by ||",
      },
    ],
  });

  return Response.json({
    text: completion.choices[0].message.content,
  });
}
