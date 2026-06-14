# Idea Detailing Decision

## 2026-06-14: アイデア詳細化テンプレートを追加する

- 項番: 1
- 内容:
  - アイデアだけをAIエージェントに渡した場合でも詳細化できるように、`docs/00_base/00_idea.md` を追加する。
  - `docs/` 配下のナンバリングは、今後の運用に合わせて都度変更してよい。
- 判断理由:
  - このテンプレートは、要件が多少決まっている場合だけでなく、アイデアだけの状態から要件整理・意思決定・実装へ進める用途にも対応する必要があるため。
  - まずは単一ファイルの `00_idea.md` として始め、運用しながらディレクトリ構成やナンバリングを調整できるようにするため。

### 対応が必要なファイル

- `docs/00_base/00_idea.md`

### 関連情報

- `docs/00_base/00_idea.md`
- `docs/00_base/01_implementation.md`
- `docs/01_pending/template_pending.md`
- `docs/02_decision/template_decision.md`
- `docs/03_review/template_review.md`
