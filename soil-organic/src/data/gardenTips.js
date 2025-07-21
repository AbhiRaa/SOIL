import hangingGarden from '../images/hangingGarden.webp';
import amongstFlowers from '../images/amongstFlowers.webp';
import trellis from '../images/trellis.webp';
import vegetableGarden from '../images/vegetableGarden.webp';

/**
 * Enhanced gardening tips data with structured content, difficulty levels, and timing information
 * SOURCE: https://www.homesandgardens.com/ideas/small-vegetable-garden-ideas
 */

function initTips(){
    // Clear existing tips to ensure we use the updated structure
    localStorage.removeItem("tips");

    const gardeningTips = [
  {
    id: 1,
    icon: "🪴",
    title: "Maximize Vertical Space with Hanging Baskets",
    subtitle: "Perfect for small spaces and apartment living",
    difficulty: "Beginner",
    timeToComplete: "1-2 hours",
    bestFor: ["Lettuce", "Cherry Tomatoes", "Herbs", "Strawberries"],
    content: "Transform your vertical space into a productive garden! Hanging baskets aren't just for flowers - they're perfect for growing vegetables too. This space-saving solution works brilliantly with cut-and-come-again lettuce, rocket, and spinach, plus they're excellent for cherry tomatoes and herbs.",
    benefits: [
      "No ground space required",
      "Protection from ground pests",
      "Easy harvesting at eye level",
      "Perfect for apartments and small patios"
    ],
    tips: [
      "Use coconut fiber liners for better drainage",
      "Choose trailing varieties for best visual impact",
      "Water more frequently as baskets dry out faster"
    ],
    image: hangingGarden,
  },
  {
    id: 2,
    icon: "🌿",
    title: "Create Vertical Gardens with Trellises",
    subtitle: "Smart space-saving for climbing vegetables",
    difficulty: "Intermediate", 
    timeToComplete: "2-4 hours",
    bestFor: ["Peas", "Beans", "Cucumbers", "Squash"],
    content: "Make the most of your vertical surfaces by training vegetables to grow upward! Trellis systems are perfect for small courtyards and compact gardens. Add herbs as companion plants for a complete mini ecosystem that provides everything for a homegrown meal.",
    benefits: [
      "Maximizes growing space efficiency",
      "Improved air circulation reduces disease",
      "Easier harvesting and maintenance",
      "Creates attractive garden features"
    ],
    tips: [
      "Install trellises before planting to avoid root damage",
      "Choose strong materials that can support full-grown plants",
      "Train plants weekly for best growth patterns"
    ],
    image: trellis
  },
  {
    id: 3,
    icon: "🏗️",
    title: "Build Productive Raised Garden Beds",
    subtitle: "The foundation of successful small-space gardening",
    difficulty: "Intermediate",
    timeToComplete: "4-8 hours",
    bestFor: ["Root Vegetables", "Leafy Greens", "Herbs", "Compact Fruits"],
    content: "Raised beds are the gold standard for small vegetable gardens! Use wood, brick, or sleepers to frame your growing space. Fill with quality soil and plan your layout for maximum productivity. Create beautiful patterns while practicing crop rotation for healthy soil.",
    benefits: [
      "Better soil drainage and quality control",
      "Easier access and maintenance",
      "Higher yields in smaller spaces",
      "Better pest and weed management"
    ],
    tips: [
      "Make beds no wider than 4 feet for easy reach",
      "Add compost annually for soil health",
      "Plan crop rotation to prevent soil depletion"
    ],
    image: vegetableGarden
  },
  {
    id: 4,
    icon: "🌺",
    title: "Integrate Vegetables Among Flowers",
    subtitle: "Create beautiful and productive companion gardens",
    difficulty: "Beginner",
    timeToComplete: "2-3 hours",
    bestFor: ["Colorful Vegetables", "Herbs", "Edible Flowers", "Compact Varieties"],
    content: "Embrace the traditional cottage garden approach! Mix edibles seamlessly among your flower beds for a beautiful, productive landscape. This technique maximizes every inch while creating stunning visual combinations of colors, textures, and heights.",
    benefits: [
      "Attracts beneficial pollinators",
      "Natural pest control through diversity",
      "Beautiful and functional landscape",
      "Makes efficient use of existing garden space"
    ],
    tips: [
      "Choose vegetables with ornamental value like rainbow chard",
      "Plant herbs near pathways for easy access",
      "Consider bloom times for continuous color"
    ],
    image: amongstFlowers
  },
];
localStorage.setItem("tips", JSON.stringify(gardeningTips));
}
function getTips() {
    const products = localStorage.getItem("tips");
  
    return JSON.parse(products);
  }
export {initTips,getTips};