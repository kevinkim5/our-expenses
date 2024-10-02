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

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("expenses");

    // const data = req.body;
    console.log(req.body);
    // const data = await new Promise((resolve, reject) => {
    //   const form = new Formidable();

    //   form.parse(req, (err, fields, files) => {
    //     if (err) reject({ err });
    //     resolve({ err, fields, files });
    //   });
    // });
    // const formData = await req.formData();
    // console.log(formData);

    // const name = formData.get("Name");
    // const keys = ["Date", "Description", "Amount", "Claim", "PaidBy"];
    // const saveObj = {
    //   Name: formData.get("Name"),
    //   Date: formData.get("Date"),
    // };
    const formData = await req.formData();
    const type = formData.get("type");
    const fields = ["Date", "Description", "Amount"];
    const booleanFields = ["Claim", "Settle"];
    const saveObj: SaveObj = {};
    fields.forEach((field) => {
      saveObj[field as keyof SaveObj] = formData.get(field) || null;
    });
    booleanFields.forEach((field) => {
      saveObj[field] = JSON.parse(formData.get(field)) || null;
    });
    console.log(saveObj);
    const addTransaction = await db.collection("transactions").insertOne({
      ...saveObj,
      Date: new Date(saveObj["Date"]),
      // Settle: true,
    });
    console.log(addTransaction);

    // if (type === FORM_TYPES.EXPENSE) {
    // } else {
    //   console.log(saveObj);

    //   const addSettle = await db.collection("transactions").insertOne({
    //     ...saveObj,
    //     // Settle: true,
    //   });
    //   console.log(addSettle);
    // }

    return NextResponse.json({ status: 200, data: [] });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 400, data: err });
  }
}
