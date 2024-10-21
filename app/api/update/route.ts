import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

import { BOOLEAN_KEYS } from '@/constants/common'
import clientPromise from '@/lib/mongoDB'

interface SaveObj {
  [key: string]: Date | boolean | number | string | null
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('expenses')

    const id = req.nextUrl.searchParams.get('id')
    if (!id) throw new Error('Missing id')

    const formData = await req.formData()
    const saveObj: SaveObj = {}

    for (const key of formData.keys()) {
      if (BOOLEAN_KEYS.includes(key)) {
        saveObj[key] = JSON.parse(formData.get(key) as string) || null
      } else if (key === 'Date') {
        saveObj[key] = new Date(formData.get(key) as string)
      } else {
        saveObj[key] = (formData.get(key) as string) || null
      }
    }
    console.log(saveObj)
    await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...saveObj,
        },
      }
    )

    return NextResponse.json(
      { message: 'Updated successfully!' },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
