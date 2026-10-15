# Darkest Dungeon 1 Curio Field Guide

기물·기벽·보스 가이드는 `index.html`을 바로 열어도 볼 수 있습니다. 출정 세팅의 이미지 분석 기능은 API 키를 노출하지 않기 위해 로컬 서버에서만 동작합니다.

## 실행

Node.js 18 이상에서 아래처럼 실행합니다.

```powershell
$env:OPENAI_API_KEY = "your-key"
# 선택: 기본값은 gpt-6-astra
$env:OPENAI_MODEL = "gpt-6-astra"
npm start
```

그 뒤 `http://127.0.0.1:4173`을 엽니다. `OPENAI_API_KEY`는 서버 프로세스 환경변수로만 읽으며, 이미지와 키를 파일이나 브라우저 저장소에 보관하지 않습니다.

## 점검

```powershell
npm run check-assets
npm run check
```

`data/verification-report.json`에는 2026-10-15 기준의 내용 검증 범위와, 확인 불가/부분 확인 모드 항목이 정리되어 있습니다.
