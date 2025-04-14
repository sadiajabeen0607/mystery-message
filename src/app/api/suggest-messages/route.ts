// app/api/suggest-messages/route.ts
export async function POST() {
  const localMessages = [
   "You're stronger than you think 💪",
    "Hope you're having a great day!",
    "Don't forget to smile 😊",
    "Keep pushing forward 🚀",
    "You're doing amazing 💖",
    "Stay focused and never give up!",
    "You got this!",
    "Every day is a fresh start 🌱",
    "Believe in yourself ✨",
    "Progress, not perfection!",
    "Shine bright like the star you are 🌟",
    "Mistakes are proof you’re trying.",
    "Be kind to yourself 💛",
    "One step at a time 👣",
    "Good things take time ⏳",
    "You’re not alone 🤝",
    "Celebrate small wins 🎉",
    "Keep your head up 🌤",
    "Your potential is endless ✨",
    "Today is your day!",
    "Push past the limits 🚧",
    "Courage is in you 🦁",
    "Hustle in silence, shine loud 🔥",
    "Dream big, work hard 💼💭"
  ];

  const shuffle = (arr: string[]) => arr.sort(() => 0.5 - Math.random());

  try {
    const res = await fetch("https://zenquotes.io/api/random");
    const data = await res.json();
    const quote = data?.[0]?.q;

    const selected = shuffle(localMessages).slice(0, 2); // Pick 2 from local
    const combined = [quote || "Stay positive always!", ...selected];

    return new Response(combined.join("||"));
  } catch {
    // If ZenQuotes fails, fallback to 3 local
    const fallback = shuffle(localMessages).slice(0, 3);
    return new Response(fallback.join("||"));
  }
}
