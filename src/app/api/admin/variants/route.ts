import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { variantId, stock } = body;

    if (!variantId || stock === undefined) {
      return NextResponse.json({ error: 'Missing variantId or stock' }, { status: 400 });
    }

    const dbFilePath = path.join(process.cwd(), 'src/data/db.json');
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    const dbData = JSON.parse(rawData);

    const variantIndex = dbData.variants.findIndex((v: any) => v.id === variantId);
    if (variantIndex > -1) {
      dbData.variants[variantIndex].stock = Math.max(0, parseInt(stock));
      fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating stock level:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
