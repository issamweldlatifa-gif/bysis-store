// ============================================================
// Seed script — populates the products table from the original
// demo data. Run with:  npm run seed
// Idempotent: clears products first so it can be re-run safely.
// ============================================================
import { db, initDb } from './db.js';

initDb();

const products = [
  { id:1, brand:"Nike", name:"Air Force 1 '07", price:120, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop&q=80"],
    rating:4.5, reviews:128, desc:"Un classique intemporel. La Nike Air Force 1 '07 associe le style basketball d'origine à des détails épurés pour un look frais et polyvalent.",
    colors:["#1a1a1a","#ffffff","#8B4513"], sizes:["38","39","40","41","42","43","44","45"], badge:"Meilleure vente" },
  { id:2, brand:"Bysis Collection", name:"Robe midi fluide", price:39.95, oldPrice:null, discount:null, category:"Vêtements",
    image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&q=80"],
    rating:4.2, reviews:86, desc:"Robe midi fluide en viscose. Coupe décontractée avec col en V et manches 3/4. Parfaite pour l'été.",
    colors:["#ff6b6b","#4ecdc4","#1a1a1a"], sizes:["XS","S","M","L","XL"], badge:null },
  { id:3, brand:"Lancaster", name:"Sac bandoulière", price:89, oldPrice:120, discount:26, category:"Accessoires",
    image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400&h=500&fit=crop&q=80"],
    rating:4.7, reviews:45, desc:"Sac bandoulière en cuir véritable. Fermeture éclair et poche intérieure. Bandoulière ajustable.",
    colors:["#8B4513","#1a1a1a","#D2691E"], sizes:["TU"], badge:"-26%" },
  { id:4, brand:"Ray-Ban", name:"Aviator Classic", price:145, oldPrice:null, discount:null, category:"Accessoires",
    image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1511499767150-a4883?w=400&h=500&fit=crop&q=80"],
    rating:4.8, reviews:210, desc:"Lunettes de soleil iconiques Aviator. Monture métallique dorée et verres verts G-15.",
    colors:["#D4AF37","#C0C0C0","#1a1a1a"], sizes:["55","58","62"], badge:null },
  { id:5, brand:"Lacoste", name:"Polo classique", price:95, oldPrice:null, discount:null, category:"Hauts",
    image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop&q=80"],
    rating:4.3, reviews:156, desc:"Polo Lacoste en petit piqué de coton. Coupe regular fit. Crocodile brodé sur la poitrine.",
    colors:["#ffffff","#1a1a1a","#0066cc","#cc0000"], sizes:["S","M","L","XL","XXL"], badge:null },
  { id:6, brand:"Adidas", name:"Samba OG", price:100, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1584735175314-3a2ce3cdb9eb?w=400&h=500&fit=crop&q=80"],
    rating:4.6, reviews:342, desc:"Baskets Samba OG avec empiècements en cuir suédé. Semelle en gomme. Un classique Adidas.",
    colors:["#1a1a1a","#ffffff","#0066cc"], sizes:["38","39","40","41","42","43","44","45"], badge:"Tendance" },
  { id:7, brand:"Levi's", name:"501 Original Fit", price:110, oldPrice:null, discount:null, category:"Vêtements",
    image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop&q=80"],
    rating:4.4, reviews:189, desc:"Jean 501 Original Fit. Taille haute, coupe droite. Denim 100% coton.",
    colors:["#4a6fa5","#2c3e50","#1a1a1a"], sizes:["28","29","30","31","32","33","34","36"], badge:null },
  { id:8, brand:"The North Face", name:"1996 Retro Nuptse", price:320, oldPrice:400, discount:20, category:"Vêtements",
    image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80"],
    rating:4.9, reviews:78, desc:"Doudoune iconique 1996 Retro Nuptse. Rembourrage en duvet d'oie. Coupe boxy.",
    colors:["#1a1a1a","#cc0000","#0066cc"], sizes:["S","M","L","XL"], badge:"-20%" },
  { id:9, brand:"Casio", name:"G-Shock GA-2100", price:99, oldPrice:null, discount:null, category:"Accessoires",
    image:"https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=500&fit=crop&q=80"],
    rating:4.7, reviews:95, desc:"Montre G-Shock GA-2100 avec boîtier en carbone. Étanche 200m. Design minimaliste.",
    colors:["#1a1a1a","#ffffff","#0066cc"], sizes:["TU"], badge:null },
  { id:10, brand:"Nike", name:"Air Max Dn", price:159.99, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop&q=80","https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&q=80"],
    rating:4.3, reviews:67, desc:"Nike Air Max Dn avec technologie Dynamic Air. Amorti réactif et design futuriste.",
    colors:["#1a1a1a","#ffffff","#cc00cc"], sizes:["38","39","40","41","42","43","44","45"], badge:"Nouveau" },
  { id:11, brand:"Adidas", name:"Gazelle Indoor", price:120, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80"],
    rating:4.5, reviews:112, desc:"Baskets Gazelle Indoor avec semelle transparente. Daim premium et 3 bandes dorées.",
    colors:["#1a1a1a","#0066cc","#cc0000"], sizes:["38","39","40","41","42","43","44"], badge:"Nouveau" },
  { id:12, brand:"Puma", name:"Palermo Leather", price:90, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&q=80"],
    rating:4.1, reviews:54, desc:"Baskets Palermo en cuir avec semelle en gomme. Style football rétro.",
    colors:["#1a1a1a","#ffffff","#006600"], sizes:["38","39","40","41","42","43","44","45"], badge:"Nouveau" },
  { id:13, brand:"Mango", name:"Robe lin mélangé", price:49.99, oldPrice:null, discount:null, category:"Vêtements",
    image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80"],
    rating:4.0, reviews:34, desc:"Robe en lin mélangé. Coupe droite avec col rond. Parfaite pour les journées d'été.",
    colors:["#f5f5dc","#1a1a1a","#87CEEB"], sizes:["XS","S","M","L"], badge:"Nouveau" },
  { id:14, brand:"New Balance", name:"550 White", price:130, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop&q=80"],
    rating:4.6, reviews:203, desc:"New Balance 550. Style basketball des années 80 avec cuir premium et semelle robuste.",
    colors:["#ffffff","#1a1a1a","#0066cc"], sizes:["38","39","40","41","42","43","44"], badge:"Tendance" },
  { id:15, brand:"Puma", name:"Suede Classic", price:85, oldPrice:100, discount:15, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop&q=80"],
    rating:4.2, reviews:167, desc:"Puma Suede Classic. Daim premium avec semelle en gomme. Un classique intemporel.",
    colors:["#1a1a1a","#cc0000","#0066cc"], sizes:["38","39","40","41","42","43","44","45"], badge:"-15%" },
  { id:16, brand:"Uniqlo", name:"T-shirt AIRism", price:14.90, oldPrice:null, discount:null, category:"Hauts",
    image:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop&q=80"],
    rating:4.4, reviews:445, desc:"T-shirt AIRism en matière technique respirante. Séchage rapide et anti-odeurs.",
    colors:["#ffffff","#1a1a1a","#808080","#0066cc"], sizes:["XS","S","M","L","XL","XXL"], badge:"Meilleure vente" },
  { id:17, brand:"Converse", name:"Chuck 70 Hi", price:95, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1617137968427-85924c800a5a?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1617137968427-85924c800a5a?w=400&h=500&fit=crop&q=80"],
    rating:4.5, reviews:298, desc:"Converse Chuck 70 Hi. Toile premium avec semelle en caoutchouc. Patch classique.",
    colors:["#1a1a1a","#ffffff","#cc0000"], sizes:["36","37","38","39","40","41","42","43","44"], badge:null },
  { id:18, brand:"Nike", name:"Air Jordan 1 Mid", price:129.99, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=80"],
    rating:4.8, reviews:512, desc:"Air Jordan 1 Mid. Cuir premium avec logo Wings et Swoosh. Un must-have.",
    colors:["#cc0000","#1a1a1a","#0066cc"], sizes:["38","39","40","41","42","43","44","45"], badge:"Tendance" },
  { id:19, brand:"Carhartt", name:"Veste Detroit", price:180, oldPrice:null, discount:null, category:"Vêtements",
    image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80"],
    rating:4.7, reviews:89, desc:"Veste Detroit en canvas robuste. Doublure en blanket. Poches multiples.",
    colors:["#8B7355","#1a1a1a","#0066cc"], sizes:["S","M","L","XL","XXL"], badge:null },
  { id:20, brand:"Lacoste", name:"Serve Slide", price:38, oldPrice:null, discount:null, category:"Chaussures",
    image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop&q=80",
    images:["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop&q=80"],
    rating:4.0, reviews:67, desc:"Claquettes Serve Slide avec logo crocodile. Semelle confortable.",
    colors:["#1a1a1a","#ffffff","#0066cc"], sizes:["38","39","40","41","42","43","44","45"], badge:null }
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO products
    (id, brand, name, price, old_price, discount, category, image, images, rating, reviews, description, colors, sizes, badge)
  VALUES
    (@id, @brand, @name, @price, @oldPrice, @discount, @category, @image, @images, @rating, @reviews, @desc, @colors, @sizes, @badge)
`);

const clearProducts = db.prepare('DELETE FROM products');
const resetSeq = db.prepare("DELETE FROM sqlite_sequence WHERE name='products'");

const tx = db.transaction(() => {
  clearProducts.run();
  resetSeq.run();
  for (const p of products) {
    insert.run({
      ...p,
      images: JSON.stringify(p.images),
      colors: JSON.stringify(p.colors),
      sizes: JSON.stringify(p.sizes),
      oldPrice: p.oldPrice,
      discount: p.discount,
      badge: p.badge,
      desc: p.desc,
    });
  }
});
tx();
console.log(`[seed] ${products.length} products inserted.`);
