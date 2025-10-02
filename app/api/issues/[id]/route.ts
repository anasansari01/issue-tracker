import { patchIssueSchema } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function PATCH(request: NextRequest, {params}: {params : {id: string}}){
  try{
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({msg: "Session not found, please Login"}, {status: 401});

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);

    if(!validation.success) return NextResponse.json(validation.error.format(), {status: 400});

    const { assignedToUserId, title, description } = body;

    if (assignedToUserId) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToUserId },
      });
      if (!user)
        return NextResponse.json(
          { error: "Invalid user." },
          { status: 400 }
        );
    }

    const {id} = await params;
    const issue = await prisma.issue.findUnique({
      where: {id: parseInt(id)},
    });

    if(!issue) return NextResponse.json({error: 'Failed to Update issue'}, {status: 404});

    const updateIssue = await prisma.issue.update({
      where: {id: issue.id},
      data:{
        title,
        description,
        assignedToUserId
      }
    });

    return NextResponse.json(updateIssue, {status: 201});

  }catch(error){
    return NextResponse.json(
      { error: "Invalid Issue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({msg: "Session not found, please Login"}, {status: 401});

    const { id } = params;

    const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
    });

    if (!issue)
      return NextResponse.json({ error: "Failed to delete issue" }, { status: 404 });

    await prisma.issue.delete({
      where: { id: issue.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid Issue" },
      { status: 500 }
    );
  }
}