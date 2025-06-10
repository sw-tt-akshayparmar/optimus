export const PRODUCTS = [
  {
    productId: 1001,
    name: "Camera",
    price: "$299",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", // DSLR camera
    description: "A high-quality digital camera.",
    shortDescription: "24MP DSLR with 18-55mm lens.",
    specifications: [
      { name: "Resolution", value: "24MP", icon: "🖼️", description: "Crystal clear 24 megapixel sensor for sharp images." },
      { name: "Lens", value: "18-55mm", icon: "📷", description: "Versatile zoom lens for wide and portrait shots." },
      { name: "Battery Life", value: "400 shots", icon: "🔋", description: "Long-lasting battery for extended shooting." },
      { name: "Weight", value: "450g", icon: "⚖️", description: "Lightweight and portable design." }
    ],
    otherInfo: "2-year warranty included. Free shipping on orders over $100.",
    availablePayments: ["Credit Card", "PayPal", "UPI", "Cash on Delivery"]
  },
  {
    productId: 1002,
    name: "Tripod",
    price: "$49",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // Tripod
    description: "A sturdy tripod for cameras.",
    shortDescription: "Aluminum, 160cm max height.",
    specifications: [
      { name: "Material", value: "Aluminum", icon: "🦾", description: "Durable and lightweight aluminum construction." },
      { name: "Max Height", value: "160cm", icon: "📏", description: "Extendable up to 160cm for flexible shooting angles." },
      { name: "Weight", value: "1.2kg", icon: "⚖️", description: "Easy to carry for outdoor shoots." },
      { name: "Load Capacity", value: "5kg", icon: "🏋️", description: "Supports cameras and equipment up to 5kg." }
    ],
    otherInfo: "1-year warranty. 7-day replacement policy.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1003,
    name: "Smartphone",
    price: "$699",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80", // Smartphone
    description: "Latest generation smartphone with stunning display.",
    shortDescription: "6.5\" OLED, 48MP camera.",
    specifications: [
      { name: "Display", value: "6.5\" OLED", icon: "📱", description: "Vivid OLED display for immersive viewing." },
      { name: "Camera", value: "48MP", icon: "📸", description: "High-resolution triple camera system." },
      { name: "Battery", value: "4500mAh", icon: "🔋", description: "All-day battery life." },
      { name: "Storage", value: "128GB", icon: "💾", description: "Plenty of space for apps and media." }
    ],
    otherInfo: "Unlocked. Supports all major carriers.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1004,
    name: "Laptop",
    price: "$1099",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", // Laptop
    description: "Powerful laptop for work and play.",
    shortDescription: "Intel i7, 16GB RAM, 512GB SSD.",
    specifications: [
      { name: "Processor", value: "Intel i7", icon: "🧠", description: "Fast and efficient 10th Gen processor." },
      { name: "RAM", value: "16GB", icon: "🧮", description: "Multitask with ease." },
      { name: "Storage", value: "512GB SSD", icon: "💾", description: "Fast boot and load times." },
      { name: "Display", value: "15.6\" FHD", icon: "💻", description: "Crisp and clear full HD display." }
    ],
    otherInfo: "Includes Windows 11. 1-year onsite warranty.",
    availablePayments: ["Credit Card", "PayPal"]
  },
  {
    productId: 1005,
    name: "Wireless Headphones",
    price: "$129",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80", // Headphones
    description: "Noise-cancelling wireless headphones.",
    shortDescription: "30 hours battery, Bluetooth 5.2.",
    specifications: [
      { name: "Battery Life", value: "30 hours", icon: "🔋", description: "Long-lasting battery for all-day use." },
      { name: "Noise Cancellation", value: "Active", icon: "🔇", description: "Block out unwanted noise." },
      { name: "Weight", value: "250g", icon: "🎧", description: "Lightweight and comfortable." },
      { name: "Bluetooth", value: "5.2", icon: "📶", description: "Stable and fast wireless connection." }
    ],
    otherInfo: "Comes with carrying case and charging cable.",
    availablePayments: ["Credit Card", "PayPal", "UPI", "Cash on Delivery"]
  },
  {
    productId: 1006,
    name: "Smartwatch",
    price: "$199",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80", // Smartwatch
    description: "Fitness-focused smartwatch with heart rate monitor.",
    shortDescription: "1.4\" AMOLED, 7 days battery.",
    specifications: [
      { name: "Display", value: "1.4\" AMOLED", icon: "⌚", description: "Bright and clear touch display." },
      { name: "Battery Life", value: "7 days", icon: "🔋", description: "Track your health all week." },
      { name: "Water Resistance", value: "5ATM", icon: "💧", description: "Swim-proof design." },
      { name: "Sensors", value: "HR, SpO2, GPS", icon: "🩺", description: "Comprehensive health tracking." }
    ],
    otherInfo: "Compatible with Android and iOS.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1007,
    name: "Bluetooth Speaker",
    price: "$59",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Bluetooth speaker
    description: "Portable Bluetooth speaker with deep bass.",
    shortDescription: "12 hours battery, IPX7 waterproof.",
    specifications: [
      { name: "Battery Life", value: "12 hours", icon: "🔋", description: "Enjoy music all day." },
      { name: "Waterproof", value: "IPX7", icon: "💦", description: "Safe for poolside or beach." },
      { name: "Weight", value: "500g", icon: "🔊", description: "Easy to carry anywhere." },
      { name: "Bluetooth", value: "5.0", icon: "📶", description: "Quick and stable pairing." }
    ],
    otherInfo: "Available in 3 colors.",
    availablePayments: ["Credit Card", "PayPal", "Cash on Delivery"]
  },
  {
    productId: 1008,
    name: "Gaming Mouse",
    price: "$39",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", // Gaming mouse
    description: "High-precision gaming mouse with RGB lighting.",
    shortDescription: "16000 DPI, 8 programmable buttons.",
    specifications: [
      { name: "DPI", value: "16000", icon: "🖱️", description: "Adjustable DPI for every game." },
      { name: "Buttons", value: "8", icon: "🔘", description: "Programmable for custom actions." },
      { name: "Weight", value: "90g", icon: "⚖️", description: "Lightweight for fast movement." },
      { name: "Lighting", value: "RGB", icon: "💡", description: "Customizable lighting effects." }
    ],
    otherInfo: "2-year warranty. Works with Windows and Mac.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1009,
    name: "Mechanical Keyboard",
    price: "$89",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80", // Mechanical keyboard
    description: "RGB mechanical keyboard with blue switches.",
    shortDescription: "Blue switches, USB-C connectivity.",
    specifications: [
      { name: "Switch Type", value: "Blue", icon: "⌨️", description: "Tactile and clicky feedback." },
      { name: "Backlight", value: "RGB", icon: "💡", description: "Customizable lighting." },
      { name: "Keys", value: "104", icon: "🔢", description: "Full-size layout." },
      { name: "Connectivity", value: "USB-C", icon: "🔌", description: "Modern and fast connection." }
    ],
    otherInfo: "Detachable wrist rest included.",
    availablePayments: ["Credit Card", "PayPal"]
  },
  {
    productId: 1010,
    name: "4K Monitor",
    price: "$399",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", // Monitor
    description: "Ultra HD 27-inch monitor for professionals.",
    shortDescription: "3840x2160 resolution, 60Hz refresh rate.",
    specifications: [
      { name: "Resolution", value: "3840x2160", icon: "🖥️", description: "Crisp 4K visuals." },
      { name: "Refresh Rate", value: "60Hz", icon: "🔄", description: "Smooth display for work and play." },
      { name: "Panel", value: "IPS", icon: "📐", description: "Wide viewing angles and color accuracy." },
      { name: "Ports", value: "HDMI, DP, USB-C", icon: "🔌", description: "Versatile connectivity." }
    ],
    otherInfo: "3-year warranty. Height adjustable stand.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1011,
    name: "External SSD",
    price: "$149",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", // SSD
    description: "Fast and portable external SSD drive.",
    shortDescription: "1TB capacity, 1050MB/s speed.",
    specifications: [
      { name: "Capacity", value: "1TB", icon: "💾", description: "Store all your files securely." },
      { name: "Speed", value: "1050MB/s", icon: "⚡", description: "Super-fast data transfer." },
      { name: "Interface", value: "USB-C", icon: "🔌", description: "Modern and universal." },
      { name: "Weight", value: "60g", icon: "⚖️", description: "Ultra-portable design." }
    ],
    otherInfo: "Shock resistant. 3-year warranty.",
    availablePayments: ["Credit Card", "PayPal", "UPI", "Cash on Delivery"]
  },
  {
    productId: 1012,
    name: "Fitness Tracker",
    price: "$59",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", // Fitness tracker
    description: "Track your steps, sleep, and heart rate.",
    shortDescription: "10 days battery, 5ATM water resistant.",
    specifications: [
      { name: "Battery Life", value: "10 days", icon: "🔋", description: "Long battery for less charging." },
      { name: "Water Resistance", value: "5ATM", icon: "💧", description: "Wear it in the pool or shower." },
      { name: "Sensors", value: "HR, SpO2", icon: "🩺", description: "Track your health metrics." },
      { name: "Display", value: "0.96\" OLED", icon: "📺", description: "Clear and bright display." }
    ],
    otherInfo: "Works with Android and iOS.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1013,
    name: "Drone",
    price: "$499",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", // Drone
    description: "4K camera drone with GPS and obstacle avoidance.",
    shortDescription: "4K camera, 30 min flight time.",
    specifications: [
      { name: "Camera", value: "4K", icon: "📷", description: "Capture stunning aerial footage." },
      { name: "Flight Time", value: "30 min", icon: "🕒", description: "Long flights on a single charge." },
      { name: "Range", value: "5km", icon: "📡", description: "Fly far and wide." },
      { name: "Weight", value: "800g", icon: "⚖️", description: "Lightweight for easy transport." }
    ],
    otherInfo: "Includes carrying case and extra propellers.",
    availablePayments: ["Credit Card", "PayPal"]
  },
  {
    productId: 1014,
    name: "Action Camera",
    price: "$199",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80", // Action camera
    description: "Waterproof action camera for adventures.",
    shortDescription: "4K resolution, 30m waterproof.",
    specifications: [
      { name: "Resolution", value: "4K", icon: "🎥", description: "Record your adventures in 4K." },
      { name: "Waterproof", value: "30m", icon: "💦", description: "Take it underwater." },
      { name: "Battery Life", value: "2 hours", icon: "🔋", description: "Capture more on a single charge." },
      { name: "Weight", value: "120g", icon: "⚖️", description: "Compact and lightweight." }
    ],
    otherInfo: "Mounting accessories included.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1015,
    name: "E-Book Reader",
    price: "$129",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=400&q=80", // E-book reader
    description: "Read your favorite books anywhere.",
    shortDescription: "6\" E-Ink display, 8GB storage.",
    specifications: [
      { name: "Display", value: "6\" E-Ink", icon: "📖", description: "Easy on the eyes, even in sunlight." },
      { name: "Storage", value: "8GB", icon: "💾", description: "Store thousands of books." },
      { name: "Battery Life", value: "4 weeks", icon: "🔋", description: "Read for weeks on a single charge." },
      { name: "Weight", value: "180g", icon: "⚖️", description: "Lightweight and portable." }
    ],
    otherInfo: "Wi-Fi enabled. Adjustable backlight.",
    availablePayments: ["Credit Card", "PayPal", "UPI", "Cash on Delivery"]
  },
  {
    productId: 1016,
    name: "Wireless Charger",
    price: "$29",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", // Wireless charger
    description: "Fast wireless charger for smartphones.",
    shortDescription: "15W output, Qi compatible.",
    specifications: [
      { name: "Output", value: "15W", icon: "⚡", description: "Fast charging for compatible devices." },
      { name: "Compatibility", value: "Qi", icon: "🔄", description: "Works with all Qi-enabled phones." },
      { name: "Cable", value: "USB-C", icon: "🔌", description: "Modern and reversible." },
      { name: "Weight", value: "80g", icon: "⚖️", description: "Compact and easy to carry." }
    ],
    otherInfo: "LED indicator. Overcharge protection.",
    availablePayments: ["Credit Card", "PayPal"]
  },
  {
    productId: 1017,
    name: "Smart Home Hub",
    price: "$79",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", // Smart home hub
    description: "Control all your smart devices from one place.",
    shortDescription: "Works with Alexa, Google Assistant.",
    specifications: [
      { name: "Voice Assistant", value: "Yes", icon: "🗣️", description: "Works with Alexa and Google Assistant." },
      { name: "Connectivity", value: "Wi-Fi, Zigbee", icon: "📶", description: "Connects to a wide range of devices." },
      { name: "Display", value: "4\" LCD", icon: "🖥️", description: "Touchscreen for easy control." },
      { name: "Weight", value: "300g", icon: "⚖️", description: "Compact and stylish." }
    ],
    otherInfo: "Easy setup. Parental controls included.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  },
  {
    productId: 1018,
    name: "Electric Toothbrush",
    price: "$59",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", // Toothbrush
    description: "Smart electric toothbrush with app connectivity.",
    shortDescription: "2 weeks battery, 5 cleaning modes.",
    specifications: [
      { name: "Battery Life", value: "2 weeks", icon: "🔋", description: "Long-lasting battery." },
      { name: "Modes", value: "5", icon: "⚙️", description: "Multiple cleaning modes." },
      { name: "Timer", value: "2 min", icon: "⏲️", description: "Built-in timer for optimal brushing." },
      { name: "Weight", value: "120g", icon: "⚖️", description: "Lightweight and ergonomic." }
    ],
    otherInfo: "Includes 2 brush heads. Travel case included.",
    availablePayments: ["Credit Card", "PayPal", "UPI", "Cash on Delivery"]
  },
  {
    productId: 1019,
    name: "Coffee Maker",
    price: "$89",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", // Coffee maker
    description: "Automatic coffee maker with programmable timer.",
    shortDescription: "1.5L capacity, 900W power.",
    specifications: [
      { name: "Capacity", value: "1.5L", icon: "☕", description: "Brew up to 12 cups at once." },
      { name: "Power", value: "900W", icon: "⚡", description: "Fast brewing." },
      { name: "Timer", value: "Yes", icon: "⏰", description: "Wake up to fresh coffee." },
      { name: "Weight", value: "2kg", icon: "⚖️", description: "Sturdy and stable." }
    ],
    otherInfo: "Removable filter. Easy to clean.",
    availablePayments: ["Credit Card", "PayPal"]
  },
  {
    productId: 1020,
    name: "Air Purifier",
    price: "$159",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Air purifier
    description: "HEPA air purifier for clean indoor air.",
    shortDescription: "400 sq.ft. coverage, ultra-quiet.",
    specifications: [
      { name: "Coverage", value: "400 sq.ft.", icon: "🏠", description: "Ideal for bedrooms and offices." },
      { name: "Filter", value: "HEPA", icon: "🧹", description: "Removes 99.97% of particles." },
      { name: "Noise Level", value: "22dB", icon: "🔇", description: "Ultra-quiet operation." },
      { name: "Weight", value: "3kg", icon: "⚖️", description: "Portable and easy to move." }
    ],
    otherInfo: "Filter replacement indicator. 2-year warranty.",
    availablePayments: ["Credit Card", "PayPal", "UPI"]
  }
];