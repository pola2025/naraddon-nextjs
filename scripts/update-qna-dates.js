import mongoose from 'mongoose';
import BusinessVoiceQuestion from '../src/models/BusinessVoiceQuestion.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// 2024년 7월~9월 사이의 랜덤 날짜 생성 함수
function getRandomDate() {
  const start = new Date('2024-07-01');
  const end = new Date('2024-09-30');
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// 답변 날짜 생성 (질문 날짜 이후 ~ 9월 30일 사이)
function getAnswerDate(questionDate) {
  const end = new Date('2024-09-30');
  const randomTime = questionDate.getTime() + Math.random() * (end.getTime() - questionDate.getTime());
  return new Date(randomTime);
}

async function updateQnADates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 모든 묻고 답하기 게시글 가져오기
    const questions = await BusinessVoiceQuestion.find({});
    console.log(`${questions.length}개의 묻고 답하기 게시글을 찾았습니다.`);

    // 각 게시글의 날짜 업데이트
    for (const question of questions) {
      const questionDate = getRandomDate();

      // 답변이 있으면 답변 날짜도 업데이트
      if (question.answer) {
        const answerDate = getAnswerDate(questionDate);
        question.answeredAt = answerDate;
      }

      question.createdAt = questionDate;
      question.updatedAt = questionDate;

      await question.save();
    }

    console.log('묻고 답하기 날짜 업데이트 완료');

    await mongoose.connection.close();
    console.log('데이터베이스 연결 종료');
  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }
}

updateQnADates();