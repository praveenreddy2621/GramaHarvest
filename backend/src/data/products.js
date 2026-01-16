const products = [
    {
        id: 1,
        name: "Pure Buffalo Ghee",
        category: "Dairy",
        price: 800,
        unit: "1000ml",
        image: "/images/branded-ghee-jar-latest.png",
        description: "Traditional Bilona method buffalo ghee. Rich, granular, and aromatic.",
        features: ["100% Organic", "Bilona Method", "Glass Jar"],
        season: "All Year",
        isSeasonal: false
    },
    {
        id: 2,
        name: "Sona Masoori Rice",
        category: "Staples",
        price: 1200,
        unit: "25kg",
        image: "/images/rice-bag.png",
        description: "Aged for 12 months. Fluffy, aromatic, and perfect for daily meals.",
        features: ["Aged 12 Months", "Pesticide Free", "Direct from Farm"],
        season: "All Year",
        isSeasonal: false
    },
    {
        id: 3,
        name: "Guntur Chilli (Whole)",
        category: "Spices",
        price: 400,
        unit: "1kg",
        image: "/images/chilli-pack.jpg",
        description: "Hand-picked, sun-dried Guntur chillies. High pungency and rich red color.",
        features: ["Sun Dried", "Hand Picked", "High Heat"],
        season: "All Year",
        isSeasonal: false
    },
    {
        id: 4,
        name: "Guntur Chilli Powder",
        category: "Spices",
        price: 450,
        unit: "1kg",
        image: "/images/chilli-powder.jpg",
        description: "Ground from premium Guntur chillies. No added colors or preservatives.",
        features: ["Stone Ground", "No Color Added", "Spicy"],
        season: "All Year",
        isSeasonal: false
    },
    {
        id: 5,
        name: "Turmeric Powder",
        category: "Spices",
        price: 300,
        unit: "500g",
        image: "/images/logo.jpg", // Placeholder
        description: "High curcumin turmeric powder. Sourced from organic farms.",
        features: ["High Curcumin", "Antiseptic", "Natural Color"],
        season: "All Year",
        isSeasonal: false
    },
    {
        id: 6,
        name: "Banganapalli Mangoes",
        category: "Fruits",
        price: 800,
        unit: "1 Dozen",
        image: "/images/logo.jpg", // Placeholder
        description: "Sweet, juicy, and carbide-free. The king of fruits from our orchards.",
        features: ["Carbide Free", "Tree Ripened", "Sweetest"],
        season: "Summer",
        isSeasonal: true,
        available: true // Assuming it's season for demo
    }
];

module.exports = products;
