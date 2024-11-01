import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

import { FIELD_TYPE_MAP } from '@/app/api/constants'
import clientPromise from '@/lib/mongoDB'

interface SaveObj {
  [key: string]: FormDataEntryValue | Date | number | null
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
      const type = FIELD_TYPE_MAP[key]
      switch (type) {
        case 'boolean':
          saveObj[key] = JSON.parse(formData.get(key) as string) || null
          break
        case 'date':
          saveObj[key] = new Date(formData.get(key) as string)
          break
        case 'number':
          saveObj[key] = parseFloat(formData.get(key) as string)
          break
        default:
          saveObj[key] = formData.get(key) || null
          break
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
