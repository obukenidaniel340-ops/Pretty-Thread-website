const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash a password for default admin & customer
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('customer123', 10);

  // Clean DB (optional, but good for seeds)
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@prettythreads.com',
      name: 'Pretty Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@prettythreads.com',
      name: 'Chioma Bello',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  // Seed Products
  const productsData = [
    {
      name: "Modern Isi Agu Bomber Jacket",
      slug: "modern-isi-agu-bomber-jacket",
      description: "A striking fusion of Igbo cultural heritage and modern streetwear. Made with high-quality velvet Isi Agu fabric, custom hardware, and ribbed trim. Perfect for adding a confident, elevated casual touch to any outfit.",
      price: 189.0,
      category: "Outerwear",
      images: "Igbo attire - Isi agu 🇳🇬.jpg",
      variants: [
        { size: "S", color: "Crimson Red", stock: 15 },
        { size: "M", color: "Crimson Red", stock: 22 },
        { size: "L", color: "Crimson Red", stock: 18 },
        { size: "XL", color: "Crimson Red", stock: 10 },
      ]
    },
    {
      name: "Royal Aso Ebi Dinner Gown",
      slug: "royal-aso-ebi-dinner-gown",
      description: "Make an unforgettable statement in this luxury Aso Ebi gown. Featuring asymmetric details, hand-beaded lace motifs, and a structured silhouette that celebrates premium craftsmanship and timeless beauty.",
      price: 349.0,
      category: "Dresses",
      images: "Aso Ebi.jpg",
      variants: [
        { size: "S", color: "Royal Blue", stock: 8 },
        { size: "M", color: "Royal Blue", stock: 12 },
        { size: "L", color: "Royal Blue", stock: 6 },
      ]
    },
    {
      name: "Sleek Terracotta Kaftan Dress",
      slug: "sleek-terracotta-kaftan-dress",
      description: "An effortlessly stylish Kaftan dress, styled by Loveth King. Designed with clean architectural lines, a flattering drape, and a modern terracotta shade that perfectly reflects the warmth and confidence of the Pretty Threads aesthetic.",
      price: 145.0,
      category: "Casuals",
      images: "Loveth king styling - Nigeria 🇳🇬.jpg",
      variants: [
        { size: "S", color: "Terracotta", stock: 25 },
        { size: "M", color: "Terracotta", stock: 30 },
        { size: "L", color: "Terracotta", stock: 20 },
      ]
    },
    {
      name: "Premium Tailored Wrap Dress",
      slug: "premium-tailored-wrap-dress",
      description: "A signature piece from the Prudential Atelier. Meticulously tailored to accentuate and flatter, featuring adjustable wrap closures, lightweight breathable linen blend, and premium finish.",
      price: 175.0,
      category: "Dresses",
      images: "Prudential Atelier - Nigeria 🇳🇬.jpg",
      variants: [
        { size: "S", color: "Cream", stock: 12 },
        { size: "M", color: "Cream", stock: 18 },
        { size: "L", color: "Cream", stock: 15 },
      ]
    },
    {
      name: "Contemporary Streetwear Kimono",
      slug: "contemporary-streetwear-kimono",
      description: "A versatile layering statement featuring structured pockets, wide sleeves, and premium cotton canvas. Equal parts traditional drape and modern industrial elements.",
      price: 120.0,
      category: "Outerwear",
      images: "Nigerian fashion brands_ Sign me tf up!__I looove….jpg",
      variants: [
        { size: "S", color: "Sage Green", stock: 15 },
        { size: "M", color: "Sage Green", stock: 20 },
        { size: "L", color: "Sage Green", stock: 15 },
        { size: "XL", color: "Sage Green", stock: 8 },
      ]
    },
    {
      name: "Embellished Aso Oke Set",
      slug: "embellished-aso-oke-set",
      description: "A luxury two-piece set crafted from traditional hand-woven Aso Oke. Styled with modern structural crop top and a fitted wrap skirt with intricate geometric motifs.",
      price: 295.0,
      category: "Co-ords",
      images: "Nigerian Traditional Attire - Aso Oke.jpg",
      variants: [
        { size: "S", color: "Gold/Charcoal", stock: 5 },
        { size: "M", color: "Gold/Charcoal", stock: 8 },
        { size: "L", color: "Gold/Charcoal", stock: 4 },
      ]
    },
    {
      name: "Luxe Boubou Agbada Gown",
      slug: "luxe-boubou-agbada-gown",
      description: "An elegant kaftan combining the majestic drape of an Agbada with the softness of silk. Features subtle gold embroidery around the neckline, perfect for high-society outings and relaxed luxury.",
      price: 210.0,
      category: "Dresses",
      images: "111604897012345916.jpg",
      variants: [
        { size: "S", color: "Dusty Rose", stock: 10 },
        { size: "M", color: "Dusty Rose", stock: 15 },
        { size: "L", color: "Dusty Rose", stock: 10 },
      ]
    },
    {
      name: "Classic Aso Oke Trench Coat",
      slug: "classic-aso-oke-trench-coat",
      description: "A masterpiece reinterpreting traditional Aso Oke fabrics into a modern double-breasted trench silhouette. Featuring custom epaulets, belted waist, and deep utility pockets.",
      price: 260.0,
      category: "Outerwear",
      images: "26880929021915841.jpg",
      variants: [
        { size: "S", color: "Bronze", stock: 6 },
        { size: "M", color: "Bronze", stock: 10 },
        { size: "L", color: "Bronze", stock: 8 },
      ]
    },
    {
      name: "Eroyn Asymmetric Kaftan",
      slug: "eroyn-asymmetric-kaftan",
      description: "An architectural garment highlighting experimental draping by Nyore Eroyn. Flowing crepe fabric with asymmetric hemlines, side slit, and modern utility detailing.",
      price: 165.0,
      category: "Casuals",
      images: "985231164423618.jpg",
      variants: [
        { size: "S", color: "Charcoal", stock: 14 },
        { size: "M", color: "Charcoal", stock: 20 },
        { size: "L", color: "Charcoal", stock: 12 },
      ]
    },
    {
      name: "Eccentric Drape Jumpsuit",
      slug: "eccentric-drape-jumpsuit",
      description: "Bold, artistic, and completely unique. A wrap jumpsuit featuring asymmetric overlapping panels, wide legs, and side-tie sash, crafted from textured premium cotton.",
      price: 195.0,
      category: "Casuals",
      images: "Eccentric Woman by Nyore Eroyn - Nigeria.jpg",
      variants: [
        { size: "S", color: "Mustard Gold", stock: 8 },
        { size: "M", color: "Mustard Gold", stock: 12 },
        { size: "L", color: "Mustard Gold", stock: 8 },
      ]
    },
    {
      name: "Ageless Boubou Kaftan",
      slug: "ageless-boubou-kaftan",
      description: "Comfort meets high style. A flowing kaftan dress in high-contrast print, handmade with premium breathable fabric, designed for warm summer breezes or elevated lounging.",
      price: 135.0,
      category: "Casuals",
      images: "Women's Nigerian Traditional Asooke Agbada Boubou Kaftan - Etsy Canada.jpg",
      variants: [
        { size: "S", color: "Monochrome Print", stock: 18 },
        { size: "M", color: "Monochrome Print", stock: 25 },
        { size: "L", color: "Monochrome Print", stock: 20 },
      ]
    }
  ];

  for (const item of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        category: item.category,
        images: item.images,
      }
    });

    for (const variant of item.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          size: variant.size,
          color: variant.color,
          sku: `${item.slug.substring(0, 8).toUpperCase()}-${variant.color.substring(0, 3).toUpperCase()}-${variant.size}`,
          stock: variant.stock,
        }
      });
    }

    // Add a default review for each product
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: createdProduct.id,
        rating: 5,
        text: `Incredible piece! The details are stunning, and it fits perfectly. Extremely high quality.`,
        verified: true,
      }
    });
  }

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
