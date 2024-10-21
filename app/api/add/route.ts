import { NextRequest, NextResponse } from 'next/server'

import clientPromise from '@/lib/mongoDB'
import { BOOLEAN_KEYS } from '@/constants/common'

interface SaveObj {
  [key: string]: Date | boolean | number | string | null
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('expenses')

    const formData = await req.formData()

    const fields = ['Date', 'Description', 'Amount']
    const saveObj: SaveObj = {}
    fields.forEach((field) => {
      saveObj[field] = (formData.get(field) as string) || null
    })

    BOOLEAN_KEYS.forEach((field) => {
      if (formData.has(field) && formData.get(field) != undefined)
        saveObj[field] = JSON.parse(formData.get(field) as string) || null
    })
    console.log('saveObj', saveObj)
    const addTransaction = await db.collection('transactions').insertOne({
      ...saveObj,
      Date: new Date(saveObj['Date'] as string),
    })
    console.log(addTransaction)

    return NextResponse.json({ status: 200, data: [] })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ status: 400, data: err })
  }
}
