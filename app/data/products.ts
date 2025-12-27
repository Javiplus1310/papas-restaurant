export const allProducts = [
    {
        id: "b1", 
        name: "Combo Hamburguesa + Papas", 
        description: "Hamburguesa clásica con papas medianas y bebida", 
        price: 2990, 
        image: "/images/8498.jpg" 
    },
    { 
        id: "b2", 
        name: "Combo Doble", 
        description: "Doble carne, queso y papas grandes", 
        price: 3990, 
        image: "/images/2151902492.jpg" 
    },
    { 
        id: "b3", 
        name: "Papas + Bebida", 
        description: "Papas fritas con salsa", 
        price: 1490, 
        image: "/images/2151985480.jpg" 
    },
    { 
        id: "b4", 
        name: "Hot Dog Especial", 
        description: "Perro caliente con toppings", 
        price: 1990, 
        image: "/images/2151910284.jpg" 
    },
];

export const featuredProducts = allProducts.slice(0, 3);
export const promoProduct = allProducts[0];