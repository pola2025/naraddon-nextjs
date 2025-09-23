# VSCode-Notion 연동 가이드

## 방법 1: VSCode Extension 설치

### Notion Sync Extension 설치
1. VSCode 열기
2. Extensions (Ctrl+Shift+X)
3. "Notion Sync" 검색
4. Install 클릭

### 설정 방법
1. Notion Integration 생성
   - https://www.notion.so/my-integrations
   - "New integration" 클릭
   - Integration 이름 설정
   - Secret Key 복사

2. VSCode 설정
   - Ctrl+Shift+P → "Notion: Set API Key"
   - Secret Key 입력
   - Database ID 설정

## 방법 2: CLI 도구 사용

### notion-cli 설치
```bash
npm install -g @notionhq/client notion-to-md
```

### 업로드 스크립트
```javascript
// scripts/upload-to-notion.js
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function uploadMarkdownToNotion(filePath, pageId) {
  const content = fs.readFileSync(filePath, 'utf8');

  // 마크다운을 Notion 블록으로 변환
  const blocks = convertMarkdownToNotionBlocks(content);

  await notion.pages.create({
    parent: { database_id: pageId },
    properties: {
      title: {
        title: [{
          text: {
            content: path.basename(filePath, '.md')
          }
        }]
      }
    },
    children: blocks
  });
}
```

## 방법 3: 자동화 스크립트

### package.json에 추가
```json
{
  "scripts": {
    "notion:upload": "node scripts/upload-to-notion.js",
    "notion:sync": "node scripts/sync-with-notion.js"
  }
}
```

### 환경 변수 설정 (.env.local)
```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

## 방법 4: GitHub Actions 연동

### .github/workflows/notion-sync.yml
```yaml
name: Sync to Notion
on:
  push:
    paths:
      - 'docs/**/*.md'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Sync to Notion
        uses: notion-tools/notion-sync@v1
        with:
          notion-key: ${{ secrets.NOTION_API_KEY }}
          database-id: ${{ secrets.NOTION_DATABASE_ID }}
          files: docs/**/*.md
```

## 현재 프로젝트에 적용

1. Extension 설치 후 API Key 설정
2. 또는 다음 명령어로 직접 업로드:

```bash
# 파일 내용을 클립보드에 복사 (Windows)
type docs\admin-architecture-plan.md | clip

# 파일 내용을 클립보드에 복사 (Mac)
cat docs/admin-architecture-plan.md | pbcopy
```

그 후 Notion에서 Ctrl+V로 붙여넣기

## 추천 워크플로우

1. VSCode에서 마크다운 작성
2. Notion Sync Extension으로 실시간 동기화
3. 또는 Git commit 시 자동 업로드

---

*참고: Notion API는 Rate Limit이 있으므로 대량 업로드 시 주의*