// app/api/user/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_AUTH } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, password: true },
  });

  if (!currentUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const body = await request.json();
  const { email, password } = body;

  const updatedUser = await db.user.update({
    where: { id: currentUser.id },
    data: {
      email: email || currentUser.email,
      password: password || currentUser.password, // Assuming password is already hashed in the frontend or middleware
      updatedAt: new Date(),
    },
    select: { id: true, email: true, updatedAt: true },
  });

  return NextResponse.json({
    message: 'User details updated successfully',
    user: updatedUser,
  });
}
