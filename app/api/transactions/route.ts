import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongoDB";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("expenses");

  const allTransactions = await db
    .collection("transactions")
    .find({})
    .sort({ Date: -1 })
    .toArray();
  return NextResponse.json({ status: 200, data: allTransactions });
}
