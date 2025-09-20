import { NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import TtontokPost from '@/models/TtontokPost';

const WRITE_PASSWORD = process.env.TTONTOK_WRITE_PASSWORD || 'vhffkvhffk2@';\nconst DEFAULT_NICKNAME = process.env.TTONTOK_DEFAULT_NICKNAME || process.env.NEXT_PUBLIC_TTONTOK_DEFAULT_NICKNAME || '나라똔 관리자';

export async function GET() {
  await connectDB();

  const posts = await TtontokPost.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    posts: posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString() ?? null,
      updatedAt: post.updatedAt?.toISOString() ?? null,
    })),
  });
}

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const {
    password,
    category,
    title,
    content,
    nickname,
    isAnonymous = false,
    businessType = '',
    region = '',
    yearsInBusiness = null,
  } = body ?? {};

  if (!password || password !== WRITE_PASSWORD) {
    return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  if (!category || typeof category !== 'string') {
    return NextResponse.json({ message: '카테고리를 선택해주세요.' }, { status: 400 });
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ message: '제목을 입력해주세요.' }, { status: 400 });
  }

  if (!content || typeof content !== 'string' || content.trim().length < 30) {
    return NextResponse.json({ message: '본문은 최소 30자 이상 입력해주세요.' }, { status: 400 });
  }

  const rawNickname = typeof nickname === 'string' ? nickname : '';
  const resolvedNickname = (isAnonymous ? '익명' : rawNickname || DEFAULT_NICKNAME).trim();

  const post = await TtontokPost.create({
    category,
    title: title.trim(),
    content: content.trim(),
    nickname: resolvedNickname,
    isAnonymous,
    businessType: isAnonymous ? '' : businessType?.trim() ?? '',
    region: isAnonymous ? '' : region?.trim() ?? '',
    yearsInBusiness: isAnonymous ? null : yearsInBusiness ?? null,
  });

  return NextResponse.json(
    {
      post: {
        ...post.toObject(),
        _id: post._id.toString(),
        createdAt: post.createdAt?.toISOString() ?? null,
        updatedAt: post.updatedAt?.toISOString() ?? null,
      },
    },
    { status: 201 }
  );
}

