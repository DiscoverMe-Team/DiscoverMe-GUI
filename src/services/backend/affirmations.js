// services/affirmations.js

export const affirmations = [
    "You are stronger than you think.",
    "Today is a fresh start for new beginnings.",
    "You are worthy of love and respect.",
    "Challenges are opportunities to grow.",
    "You have the power to create change.",
    "You are capable of achieving great things.",
    "Every step you take is progress.",
    "Your potential is limitless.",
    "You deserve happiness and joy.",
    "Success is a journey, not a destination."
];

export const getRandomAffirmation = () => {
    const index = Math.floor(Math.random() * affirmations.length);
    return affirmations[index];
};


