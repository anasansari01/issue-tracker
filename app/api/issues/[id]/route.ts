import { issueSchema } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, {params}: {params : {id: string}}){
  const body = await request.json();
  const validation = issueSchema.safeParse(body);

  if(!validation.success) return NextResponse.json(validation.error.format, {status: 400});

  const {id} = await params;
  const issue = await prisma.issue.findUnique({
    where: {id: parseInt(id)}
  });

  if(!issue) return NextResponse.json({error: 'invalid Issue'}, {status: 400});

  const updateIssue = await prisma.issue.update({
    where: {id: issue.id},
    data:{
      title: body.title,
      description: body.description
    }
  })
  return NextResponse.json(updateIssue, {status: 201});
}

export async function DELETE(request: NextRequest, {params}: {params : {id: string}}){
  const {id} = await params;
  const issue = await prisma.issue.findUnique({
    where: {id: parseInt(id)}
  });

  if(!issue) return NextResponse.json({error: 'invalid Issue'}, {status: 400});

  await prisma.issue.delete({
    where: {id: issue.id}
  })
  return NextResponse.json({});
}