const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default || require('png-to-ico');

async function fixFavicon() {
  const inputImage = path.join(__dirname, '../public/images/Logo_old.png');
  const publicDir = path.join(__dirname, '../public');

  try {
    // 1. 정사각형 256x256 PNG 생성
    const squarePng = path.join(publicDir, 'favicon-square.png');
    await sharp(inputImage)
      .resize(256, 256)
      .toFile(squarePng);
    console.log('✅ 정사각형 PNG 생성');

    // 2. ICO 파일 생성
    const buffer = await pngToIco(fs.readFileSync(squarePng));
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);
    console.log('✅ favicon.ico 생성');

    // 3. 정리
    fs.unlinkSync(squarePng);
    console.log('✅ 임시 파일 정리');

    console.log('\n✨ favicon.ico가 나라똔 로고로 교체되었습니다!');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

fixFavicon();