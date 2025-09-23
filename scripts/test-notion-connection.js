const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function testConnection() {
  try {
    console.log('🔍 Testing Notion API connection...');
    console.log('API Key:', process.env.NOTION_API_KEY ? '✅ Found' : '❌ Not found');

    // 사용자 정보 가져오기
    const response = await notion.users.me();
    console.log('\n✅ Successfully connected to Notion!');
    console.log('Bot info:', {
      type: response.type,
      name: response.name,
      id: response.id
    });

    // 접근 가능한 데이터베이스/페이지 검색
    console.log('\n📋 Searching for accessible pages...');
    const search = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 5
    });

    if (search.results.length > 0) {
      console.log(`\n✅ Found ${search.results.length} accessible pages:`);
      search.results.forEach((page, index) => {
        const title = page.properties?.title?.title?.[0]?.plain_text ||
                      page.properties?.Name?.title?.[0]?.plain_text ||
                      'Untitled';
        console.log(`${index + 1}. ${title}`);
        console.log(`   ID: ${page.id}`);
        console.log(`   URL: ${page.url}`);
      });
    } else {
      console.log('\n⚠️ No pages found. Please share pages with the integration.');
    }

    return true;
  } catch (error) {
    console.error('\n❌ Connection failed!');
    if (error.code === 'unauthorized') {
      console.error('Invalid API key or insufficient permissions');
    } else if (error.code === 'restricted_resource') {
      console.error('The integration needs to be added to the page/database');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// 실행
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Notion integration is ready to use!');
    console.log('You can now run: npm run notion:plan');
  } else {
    console.log('\n📌 Next steps:');
    console.log('1. Go to your Notion page');
    console.log('2. Click "..." menu → "Connections"');
    console.log('3. Add your integration');
  }
});