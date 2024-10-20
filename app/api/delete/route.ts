import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongoDB'

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('expenses')

    const id = req.nextUrl.searchParams.get('id')
    if (!id) throw new Error('Missing id')

    const res = await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isSoftDelete: true,
        },
      }
    )

    return NextResponse.json({ error: 'Delete success!' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
