import { NextRequest, NextResponse } from 'next/server'

import { FIELD_TYPE_MAP } from '@/app/api/constants'
import clientPromise from '@/lib/mongoDB'

interface SaveObj {
  [key: string]: FormDataEntryValue | Date | number | null
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('expenses')

    const formData = await req.formData()

    const saveObj: SaveObj = {}
    Object.keys(FIELD_TYPE_MAP).forEach((field) => {
      const type = FIELD_TYPE_MAP[field]
      switch (type) {
        case 'boolean':
          saveObj[field] = JSON.parse(formData.get(field) as string) || null
          break
        case 'date':
          saveObj[field] = new Date(formData.get(field) as string)
          break
        case 'number':
          saveObj[field] = parseFloat(formData.get(field) as string)
          break
        default:
          saveObj[field] = formData.get(field) || null
          break
      }
    })

    console.log('saveObj', saveObj)
    const addTransaction = await db.collection('transactions').insertOne({
      ...saveObj,
    })
    console.log(addTransaction)

    return NextResponse.json({ status: 200, data: [] })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ status: 400, data: err })
  }
}
