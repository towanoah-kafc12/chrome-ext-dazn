# Task Breakdown and Verification Decision

## 2026-06-14: タスク分解と検証テンプレートを追加する

- 項番: 1
- 内容:
  - 実装方針を作業単位へ落とし込むため、`docs/00_base/02_task_breakdown.md` を追加する。
  - 実装後に成功条件、タスク完了条件、テスト、手動確認、未確認事項を記録するため、`docs/00_base/03_verification.md` を追加する。
  - `AGENTS.md` と `CLAUDE.md` に、追加した2つのテンプレートの役割と作業時の確認対象を追記する。
- 判断理由:
  - 個人開発レベルのAI駆動開発では、実装前にタスク単位・実装順序・完了条件を明確にすることで、AIエージェントが一度に大きく変更しすぎるリスクを下げられるため。
  - 実装後の検証観点をテンプレート化することで、「実装した」と「目的を満たして動作確認できた」を分けて判断できるようにするため。

### 対応が必要なファイル

- `docs/00_base/02_task_breakdown.md`
- `docs/00_base/03_verification.md`
- `AGENTS.md`
- `CLAUDE.md`

### 関連情報

- `docs/00_base/00_idea.md`
- `docs/00_base/01_implementation.md`
- `docs/01_pending/template_pending.md`
- `docs/02_decision/template_decision.md`
- `docs/03_review/template_review.md`
