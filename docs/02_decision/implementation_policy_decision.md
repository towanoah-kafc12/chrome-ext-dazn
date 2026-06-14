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
