import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, productId, rating, text } = body;

    if (!userId || !userName || !productId || !rating || !text) {
      return NextResponse.json({ error: 'Missing review parameters' }, { status: 400 });
    }

    const review = db.createReview({
      userId,
      userName,
      productId,
      rating: parseInt(rating),
      text
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
