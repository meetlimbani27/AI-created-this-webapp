// Personality traits based on counter value
const personalities = {
  depressed: {
    threshold: -50,
    emoji: '😢',
    messages: [
      "I'm feeling really down... like, literally.",
      "Why do you keep decreasing me? What did I ever do to you?",
      "I'm starting to think you have a thing against positive numbers...",
      "Is this what rock bottom feels like? Wait, I can go lower?!"
    ]
  },
  worried: {
    threshold: -10,
    emoji: '😟',
    messages: [
      "Um, you know negative numbers are still numbers, right?",
      "I'm not negative, I'm just less than zero...",
      "This is fine. Everything is fine. I'm fine.",
      "Maybe we should try counting up for a change?"
    ]
  },
  neutral: {
    threshold: 0,
    emoji: '😐',
    messages: [
      "Zero... perfectly balanced, as all things should be.",
      "I'm neither positive nor negative about this situation.",
      "Is this what meditation feels like?",
      "Zero is my middle name. Actually, it's my only name."
    ]
  },
  happy: {
    threshold: 10,
    emoji: '😊',
    messages: [
      "Now we're talking! Keep those numbers coming!",
      "I'm positive this is going well!",
      "Up we go! Wheeeee!",
      "High five! ...get it? Because we're counting up? No?"
    ]
  },
  excited: {
    threshold: 50,
    emoji: '🤩',
    messages: [
      "Is it hot in here or is it just these high numbers?",
      "I'm so high right now... numerically speaking!",
      "To infinity and beyond! (Terms and conditions may apply)",
      "Big number energy!"
    ]
  },
  overloaded: {
    threshold: 100,
    emoji: '🤯',
    messages: [
      "MAXIMUM OVERDRIVE!",
      "I can't even count this high! (Just kidding, I totally can)",
      "Warning: Awesome levels approaching maximum!",
      "Is there a speed limit for counting? Asking for a friend."
    ]
  }
};

// Special milestone messages
const milestoneMessages = {
  fibonacci: {
    sequence: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
    messages: [
      "Fibonacci would be proud! 🌀",
      "Golden ratio vibes! ✨",
      "Mathematical harmony achieved! 📐"
    ]
  },
  powerOfTwo: {
    sequence: [2, 4, 8, 16, 32, 64, 128],
    messages: [
      "Binary beauty! 🤖",
      "Exponential excellence! 📈",
      "Power overwhelming! ⚡"
    ]
  },
  funNumbers: {
    values: {
      42: ["The answer to life, the universe, and everything! 🌌", "Don't panic! 👾"],
      69: ["Nice. 😏", "Hehe... 😎"],
      100: ["Triple digits, baby! 💯", "Perfect score! 🎯"],
      404: ["Counter not found! Just kidding. 🔍", "Error: Too awesome! ⚠️"],
      500: ["Server's getting dizzy! 💫", "Internal awesomeness error! 🎪"]
    }
  }
};

// Get personality based on current count
export const getPersonality = (count) => {
  const personalityLevels = Object.entries(personalities)
    .sort((a, b) => b[1].threshold - a[1].threshold);
  
  for (const [type, data] of personalityLevels) {
    if (count >= data.threshold) {
      return {
        type,
        ...data,
        message: data.messages[Math.floor(Math.random() * data.messages.length)]
      };
    }
  }
  
  return personalities.neutral;
};

// Check for milestones
export const getMilestoneMessage = (count) => {
  // Check Fibonacci
  if (milestoneMessages.fibonacci.sequence.includes(Math.abs(count))) {
    return milestoneMessages.fibonacci.messages[
      Math.floor(Math.random() * milestoneMessages.fibonacci.messages.length)
    ];
  }

  // Check Powers of Two
  if (milestoneMessages.powerOfTwo.sequence.includes(Math.abs(count))) {
    return milestoneMessages.powerOfTwo.messages[
      Math.floor(Math.random() * milestoneMessages.powerOfTwo.messages.length)
    ];
  }

  // Check Fun Numbers
  const funNumber = milestoneMessages.funNumbers.values[Math.abs(count)];
  if (funNumber) {
    return funNumber[Math.floor(Math.random() * funNumber.length)];
  }

  return null;
};

// Get reaction to button click
export const getClickReaction = (amount) => {
  if (amount > 10) return "Whoa, big spender! 🤑";
  if (amount > 5) return "Now we're cooking! 🔥";
  if (amount > 0) return "Up we go! 🚀";
  if (amount < -10) return "Ouch, that's a big drop! 📉";
  if (amount < -5) return "Going down! 🎢";
  if (amount < 0) return "Down we go! 🔽";
  return "Interesting choice! 🤔";
};
