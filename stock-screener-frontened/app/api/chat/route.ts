import { NextRequest, NextResponse } from "next/server"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import prisma from "@/lib/prisma"
// @ts-ignore
import serviceAccount from "C:/Users/adars/Downloads/FinSight/config/finsight-7b199-firebase-adminsdk-fbsvc-f186993171.json"

// ✅ Initialize Firebase Admin once
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ reply: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decodedToken = await getAuth().verifyIdToken(token)
    const firebaseUid = decodedToken.uid

  const user = await prisma.user.findFirst({
  where: { firebaseId: firebaseUid },
})


    if (!user) {
      return NextResponse.json({ reply: "User not found in DB" }, { status: 404 })
    }

    const { message } = await req.json()

    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        message,
        sender: "user",
      },
    })

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ reply: "Missing API key." }, { status: 500 })
    }

    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    })

    const data = await completion.json()
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that."

    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        message: reply,
        sender: "bot",
      },
    })

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("Server Error:", err)
    return NextResponse.json({ reply: "Internal server error." }, { status: 500 })
  }
}
