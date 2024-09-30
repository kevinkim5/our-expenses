import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongoDB";
import { FORM_TYPES } from "@/constants/common";

interface SaveObj {
  Date?: Date;
  Amount?: number;
  Description?: string;
  Claim?: boolean;
  Settle?: boolean;
}

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("expenses");

  const allTransactions = await db
    .collection("transactions")
    .find({
      // sort: { Date: 1 },
      // Claim: true,
    })
    .sort({ Date: -1 })
    .toArray();
  return NextResponse.json({ status: 200, data: allTransactions });
}
