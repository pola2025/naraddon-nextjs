const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputImage = path.join(__dirname, '../public/images/Logo_old.png');
  const publicDir = path.join(__dirname, '../public');

  try {
    // favicon.ico (32x32)
    await sharp(inputImage)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✅ favicon-32x32.png 생성');

    // favicon-16x16.png
    await sharp(inputImage)
      .resize(16, 16)
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✅ favicon-16x16.png 생성');

    // apple-touch-icon.png (180x180)
    await sharp(inputImage)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png 생성');

    // android-chrome-192x192.png
    await sharp(inputImage)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
    console.log('✅ android-chrome-192x192.png 생성');

    // android-chrome-512x512.png
    await sharp(inputImage)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
    console.log('✅ android-chrome-512x512.png 생성');

    console.log('\n✨ 모든 파비콘이 성공적으로 생성되었습니다!');
    console.log('📌 주의: favicon.ico는 수동으로 변환해야 합니다.');
    console.log('   온라인 변환기: https://favicon.io/favicon-converter/');

  } catch (error) {
    console.error('❌ 파비콘 생성 중 오류 발생:', error);
  }
}

generateFavicons();