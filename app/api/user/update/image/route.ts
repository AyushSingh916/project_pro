// app/api/user/update/route.ts
import { NextRequest, NextResponse} from 'next/server';
import { NEXT_AUTH } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const {username, url} = await request.json();

  const response = await db.user.update ( {
    where: {
        username: username
    }, data : {
        imageUrl: url
    }
  })

  return NextResponse.json(response, {status: 201});
}
