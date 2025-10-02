import { SessionProvider } from 'next-auth/react';
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "../../ValidationSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
  try{
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({msg: "Session not found, please Login"}, {status: 401});

    const body = await request.json();
    const validation = issueSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format, { status: 400 });

    const newIssue = await prisma.issue.create({
      data: { title: body.title, description: body.description }
    });

    return NextResponse.json(newIssue, { status: 201 });
  }catch(error){
      return NextResponse.json(
      { error: "Invalid Issue" },
      { status: 500 }
    );
  }
}