import { NextResponse } from 'next/server';

const WRITE_PASSWORD = process.env.TTONTOK_WRITE_PASSWORD || 'vhffkvhffk2@';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== WRITE_PASSWORD) {
    return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
