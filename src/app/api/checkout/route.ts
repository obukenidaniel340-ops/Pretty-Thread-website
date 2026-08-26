import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, guestEmail, guestName, shippingAddress, items, paymentMethod } = body;

    if (!shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required checkout information' }, { status: 400 });
    }

    // Double check inventory stock availability
    const productsData = db.getProducts();
    const dbData = require('@/data/db.json'); // check direct variants stock
    
    for (const item of items) {
      const variant = dbData.variants.find((v: any) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json({ error: `Product variant not found` }, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for variant ${variant.sku}. Available: ${variant.stock}` },
          { status: 400 }
        );
      }
    }

    // Calculate total order cost
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Create unique payment transaction reference (mocking Stripe)
    const paymentIntentId = 'ch_' + Math.random().toString(36).substr(2, 12);

    // Log the order and decrement stock
    const order = db.createOrder({
      userId,
      guestEmail,
      guestName,
      total,
      shippingAddress,
      paymentIntentId,
      items
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error during checkout processing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
