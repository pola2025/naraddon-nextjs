const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Notion API 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 마크다운을 Notion 블록으로 변환하는 함수
function markdownToNotionBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 제목 처리
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(2) }
          }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(3) }
          }]
        }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(4) }
          }]
        }
      });
    }
    // 리스트 처리
    else if (line.startsWith('- ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(2) }
          }]
        }
      });
    }
    // 코드 블록 처리
    else if (line.startsWith('```')) {
      let codeContent = '';
      let language = line.substring(3);
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeContent += lines[i] + '\n';
        i++;
      }
      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{
            type: 'text',
            text: { content: codeContent.trim() }
          }],
          language: language === 'tsx' ? 'typescript' : (language || 'plain text')
        }
      });
    }
    // 일반 텍스트
    else if (line.trim()) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: line }
          }]
        }
      });
    }
  }

  return blocks;
}

// 파일 업로드 함수
async function uploadToNotion(filePath, parentPageId) {
  try {
    // 파일 읽기
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.md');

    // Notion 블록으로 변환
    const blocks = markdownToNotionBlocks(content);

    // 페이지 생성
    const response = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId || process.env.NOTION_PAGE_ID
      },
      properties: {
        title: {
          title: [{
            text: {
              content: fileName
            }
          }]
        }
      },
      children: blocks.slice(0, 100) // Notion API는 한 번에 100개 블록만 허용
    });

    // 100개 이상의 블록이 있으면 추가로 삽입
    if (blocks.length > 100) {
      for (let i = 100; i < blocks.length; i += 100) {
        await notion.blocks.children.append({
          block_id: response.id,
          children: blocks.slice(i, i + 100)
        });
      }
    }

    console.log('✅ Successfully uploaded to Notion!');
    console.log('📄 Page URL:', response.url);
    return response;

  } catch (error) {
    console.error('❌ Error uploading to Notion:', error);
    throw error;
  }
}

// CLI 인터페이스
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node upload-to-notion.js <file-path> [parent-page-id]');
    console.log('Example: node upload-to-notion.js docs/admin-architecture-plan.md');
    process.exit(1);
  }

  const filePath = args[0];
  const parentPageId = args[1];

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  if (!process.env.NOTION_API_KEY) {
    console.error('NOTION_API_KEY is not set in .env.local');
    console.log('Please add: NOTION_API_KEY=your_api_key to .env.local');
    process.exit(1);
  }

  await uploadToNotion(filePath, parentPageId);
}

// 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { uploadToNotion, markdownToNotionBlocks };