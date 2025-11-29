/**
 * Trivia Questions Database
 * Large pool of questions for variety in games
 */

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  category: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const TRIVIA_QUESTIONS_POOL: TriviaQuestion[] = [
  // Geography
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy",
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "easy",
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "medium",
  },
  {
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "medium",
  },
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium",
  },
  {
    question: "Which mountain is the highest in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "easy",
  },
  {
    question: "What is the capital of Brazil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium",
  },
  {
    question: "Which country has the most time zones?",
    options: ["Russia", "United States", "China", "France"],
    correctAnswer: 0,
    category: "Geography",
    difficulty: "hard",
  },

  // Science
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium",
  },
  {
    question: "What is the speed of light in vacuum?",
    options: [
      "300,000 km/s",
      "150,000 km/s",
      "450,000 km/s",
      "600,000 km/s",
    ],
    correctAnswer: 0,
    category: "Science",
    difficulty: "hard",
  },
  {
    question: "How many bones are in an adult human body?",
    options: ["196", "206", "216", "226"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "medium",
  },
  {
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium",
  },
  {
    question: "What is the smallest unit of matter?",
    options: ["Molecule", "Atom", "Electron", "Proton"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "easy",
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium",
  },

  // History
  {
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    category: "History",
    difficulty: "easy",
  },
  {
    question: "Who was the first person to walk on the moon?",
    options: [
      "Buzz Aldrin",
      "Neil Armstrong",
      "Michael Collins",
      "John Glenn",
    ],
    correctAnswer: 1,
    category: "History",
    difficulty: "easy",
  },
  {
    question: "In which year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1993"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctAnswer: 2,
    category: "History",
    difficulty: "easy",
  },
  {
    question: "Which empire was ruled by Julius Caesar?",
    options: ["Greek", "Roman", "Byzantine", "Ottoman"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium",
  },
  {
    question: "In which year did the Titanic sink?",
    options: ["1910", "1912", "1914", "1916"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium",
  },

  // Math
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    category: "Math",
    difficulty: "easy",
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
    category: "Math",
    difficulty: "easy",
  },
  {
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
    category: "Math",
    difficulty: "easy",
  },
  {
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    category: "Math",
    difficulty: "medium",
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 2,
    category: "Math",
    difficulty: "easy",
  },
  {
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correctAnswer: 1,
    category: "Math",
    difficulty: "easy",
  },

  // Literature
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "easy",
  },
  {
    question: "In which book would you find the character Atticus Finch?",
    options: [
      "The Great Gatsby",
      "To Kill a Mockingbird",
      "1984",
      "The Catcher in the Rye",
    ],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "medium",
  },
  {
    question: "Who wrote '1984'?",
    options: [
      "George Orwell",
      "Aldous Huxley",
      "Ray Bradbury",
      "H.G. Wells",
    ],
    correctAnswer: 0,
    category: "Literature",
    difficulty: "medium",
  },
  {
    question: "What is the first book in the Harry Potter series?",
    options: [
      "Harry Potter and the Chamber of Secrets",
      "Harry Potter and the Philosopher's Stone",
      "Harry Potter and the Prisoner of Azkaban",
      "Harry Potter and the Goblet of Fire",
    ],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "easy",
  },

  // Technology
  {
    question: "Which programming language is known for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "easy",
  },
  {
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "High-Level Text Markup Language",
      "Hyperlink and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: 0,
    category: "Technology",
    difficulty: "easy",
  },
  {
    question: "What year was the first iPhone released?",
    options: ["2005", "2006", "2007", "2008"],
    correctAnswer: 2,
    category: "Technology",
    difficulty: "medium",
  },
  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Processing Unit",
      "Central Program Unit",
      "Computer Program Unit",
    ],
    correctAnswer: 0,
    category: "Technology",
    difficulty: "easy",
  },
  {
    question: "Which company created the Android operating system?",
    options: ["Apple", "Microsoft", "Google", "Samsung"],
    correctAnswer: 2,
    category: "Technology",
    difficulty: "medium",
  },

  // Sports
  {
    question: "How many players are on a basketball team on the court?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    category: "Sports",
    difficulty: "easy",
  },
  {
    question: "Which sport is played at Wimbledon?",
    options: ["Golf", "Tennis", "Cricket", "Rugby"],
    correctAnswer: 1,
    category: "Sports",
    difficulty: "easy",
  },
  {
    question: "In which sport would you perform a slam dunk?",
    options: ["Football", "Basketball", "Volleyball", "Tennis"],
    correctAnswer: 1,
    category: "Sports",
    difficulty: "easy",
  },
  {
    question: "How many rings are in the Olympic symbol?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    category: "Sports",
    difficulty: "easy",
  },

  // Entertainment
  {
    question: "Which movie won the Academy Award for Best Picture in 2020?",
    options: ["Joker", "Parasite", "1917", "Once Upon a Time in Hollywood"],
    correctAnswer: 1,
    category: "Entertainment",
    difficulty: "medium",
  },
  {
    question: "Who directed the movie 'Inception'?",
    options: [
      "Christopher Nolan",
      "Steven Spielberg",
      "Martin Scorsese",
      "Quentin Tarantino",
    ],
    correctAnswer: 0,
    category: "Entertainment",
    difficulty: "medium",
  },
  {
    question: "Which band sang 'Bohemian Rhapsody'?",
    options: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"],
    correctAnswer: 1,
    category: "Entertainment",
    difficulty: "easy",
  },
  {
    question: "In which year was the first Star Wars movie released?",
    options: ["1975", "1977", "1979", "1981"],
    correctAnswer: 1,
    category: "Entertainment",
    difficulty: "medium",
  },

  // General Knowledge
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    category: "General",
    difficulty: "easy",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    category: "General",
    difficulty: "easy",
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Cucumber", "Pepper"],
    correctAnswer: 1,
    category: "General",
    difficulty: "easy",
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Leopard", "Cheetah"],
    correctAnswer: 1,
    category: "General",
    difficulty: "easy",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correctAnswer: 1,
    category: "General",
    difficulty: "easy",
  },
];




