# Implementation Policy Decision

## 2026-06-14: 実装方針テンプレートを01に追加する

- 項番: 1
- 内容:
  - `docs/00_base` を追加し、基本テンプレートとして `docs/00_base/00_idea.md` と `docs/00_base/01_implementation.md` を配置する。
  - `docs/00_base/01_implementation.md` を、使う技術や実装方針を保存する単一Markdownテンプレートとして扱う。
  - 既存の `pending`、`decision`、`review` はそれぞれ `docs/01_pending`、`docs/02_decision`、`docs/03_review` に変更する。
- 判断理由:
  - アイデア詳細化後、実装前に採用技術、設計方針、スコープ、テスト方針をある程度確定させておくことで、AIエージェントが実装時に同じ前提を参照しやすくするため。
  - pending / decision だけでは、技術選定や実装方針のような「実装前提」を一覧しづらいため。

### 対応が必要なファイル

- `docs/00_base/00_idea.md`
- `docs/00_base/01_implementation.md`
- `docs/01_pending/template_pending.md`
- `docs/02_decision/template_decision.md`
- `docs/03_review/template_review.md`
- `CLAUDE.md`
- `AGENTS.md`

### 関連情報

- `docs/00_base/00_idea.md`

## 2026-06-14: 初期MVPは素のManifest V3で実装する

- 項番: 2
- 内容:
  - DAZN UI改善Chrome拡張の初期MVPは、ビルドなしの素のManifest V3として実装する。
  - 初期MVPでは `app/manifest.json`、`app/content.js`、`app/content.css` を中心に構成する。
  - Vite / TypeScript / React / ポップアップUI / Chrome Web Store公開対応は初期スコープから外す。
  - DAZNログイン後DOMは未確認のため、まず `video` 要素起点の汎用実装で進める。
- 判断理由:
  - 今回の最優先目的は、DAZNの動画プレイヤーをウィンドウ横幅いっぱいに近づけることであり、初期検証にはcontent scriptとCSSで十分なため。
  - ビルド環境を入れないことで、初心者でもChromeに読み込んで挙動を確認しやすいため。
  - DAZNの実DOMに合わせた精密調整は、MVPを実機確認した後に行う方が手戻りが少ないため。

### 対応が必要なファイル

- `docs/00_base/00_idea.md`
- `docs/00_base/01_implementation.md`
- `docs/00_base/02_task_breakdown.md`
- `docs/00_base/03_verification.md`
- `app/manifest.json`
- `app/content.js`
- `app/content.css`

## 2026-06-15: プレイヤー拡大は表示可能な縦幅を上限にする

- 項番: 3
- 内容:
  - 初回MVPはユーザ実機確認で、プレイヤーがウィンドウ横幅いっぱいまで広がることを確認済み。
  - ただし要件を修正し、動画プレイヤーの縦幅はヘッダーを除いた実際に表示できる領域の縦幅を上限にする。
  - ウィンドウが横に広がっても、上記の縦幅上限を超える場合はそれ以上プレイヤーを拡大しない。
  - `sample/dazn-videopage-20260615/` のDAZN再生ページを参考に、`data-test-id="HEADER"`、`data-test-id="PLAYER_ROOT"`、`data-test-id="VIDEO_CONTENT_CONTAINER"`、`data-target="playerContainer"` を考慮する。
- 判断理由:
  - 横幅だけを最大化すると、横長ウィンドウで動画が縦方向に大きくなりすぎ、表示可能領域を超える可能性があるため。
  - DAZN現行DOMのヘッダーとプレイヤーコンテナを利用することで、汎用実装より安定してサイズ制御できるため。

## 2026-06-15: コア機能の実装完了

- 項番: 4
- 内容:
  - ユーザがChrome拡張を読み込み、DAZN動画ページで目視確認した。
  - プレイヤーの横幅拡大、高さ上限、中央寄せについて、軽く見た範囲で動作に問題がないことを確認した。
  - DAZN UI改善Chrome拡張のコア機能は実装完了として扱う。
- 判断理由:
  - ユーザが実際のDAZN再生ページで確認し、コア要件を満たしていると判断したため。
