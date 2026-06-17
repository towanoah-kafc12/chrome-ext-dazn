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

## 2026-06-15: プレイヤー幅はDAZNの実レイアウト幅を基準にする

- 項番: 5
- 内容:
  - ログイン後の完全な再生ページとして `sample/dazn-videopage-logon-20260615/` を参照できる状態になった。
  - サイドメニュー / 右側パネル展開時に、拡張機能の `100vw` 固定がDAZN側の縮小レイアウトを上書きし、動画の左端見切れやメニューの重なりを起こしていた。
  - 今後のプレイヤー幅計算は `window.innerWidth` ではなく、`[data-target="player-layout"]` の実測幅と周辺パネルの表示状態を基準にする。
  - `[data-target="player-layout"]` への `100vw !important` と負の margin は使わず、DAZN側の親レイアウトを尊重する。
- 判断理由:
  - DAZN側は右側パネル表示時にプレイヤーレイアウトを狭める設計になっており、拡張機能がその制御を壊さない方が見切れ・重なりを防ぎやすいため。
  - サイドメニュー展開中は動画最大化より視認性と操作性を優先するため。

## 2026-06-15: ヘッダーは画面上部へ追従固定しない

- 項番: 6
- 内容:
  - DAZNのヘッダーが画面上部に固定表示され続けないよう、拡張適用中は `[data-test-id="HEADER"]` と `header` の `position` を `static` に戻す。
  - `top` も `auto` に戻し、DAZN側の `fixed` / `sticky` 指定を打ち消す。
  - ヘッダーを `static` にした場合は表示領域を覆わないため、動画サイズ計算ではヘッダー高さを差し引かない。
- 判断理由:
  - ユーザ要望として、ヘッダーは画面上部に固定追従しない表示が望ましいため。
  - `static` 化したヘッダー高さを差し引き続けると、16:9の高さ上限から逆算されるプレイヤー幅が狭くなるため。

## 2026-06-17: サイドメニューのホバー文言はプレイヤー幅計算から除外する

- 項番: 7
- 内容:
  - サイドメニューにホバーしたときだけ表示される文字列（例: 「すべて表示する」）は、動画プレイヤーを圧迫する固定パネルとして扱わない。
  - `[data-test-id="SIDE_BAR"]` は、メニュー展開状態を示す属性や実体のあるメニュー / ダイアログ / aside がある場合だけ、プレイヤー幅計算で差し引く。
  - 単なるホバーラベルは動画にかぶってもよいものとして扱い、プレイヤーサイズを変えない。
  - `hasAnyMenu` class はホバーで高速に付け外しされる可能性があるため、プレイヤー幅を変える判定には使わない。
  - サイドバーの重なり量を `player-layout` の現在幅から測って差し引く方式も、拡張が設定した幅によって次回の測定値が変わるため使わない。
  - プレイヤー幅は、親レイアウト幅から実体のある兄弟パネル幅を差し引いた安定値だけを基準にする。
  - `[data-test-id="SIDE_BAR"]` は、ホバー文字列で幅が変わるため、兄弟要素の幅計算から常に除外する。
  - さらにDAZN側のflexレイアウト自体がホバー時のサイドバー幅でプレイヤー領域を押すため、拡張適用中は `SIDE_BAR` のレイアウト幅を初回測定値で固定し、ホバー文言は `overflow: visible` で重ね表示に寄せる。
  - `main__expand-match-day-panel-container___2r61e` のような右端固定ボタンは `position: fixed` で表示されるため、プレイヤー幅計算の兄弟要素から除外する。
  - `main__expandButtonTooltip___1J1j-` 自体はDAZN側で既に `position: fixed` なので、拡張側では直接隠したり位置変更したりしない。
- 判断理由:
  - ホバー時の一時的な文字列で動画サイズが変わると視聴体験が悪くなるため。
  - ユーザ要望として、ホバー文字列は動画に多少かぶっても許容できるため。
  - `hasAnyMenu` や重なり量の実測値を幅計算に使うと、計算結果がDOMレイアウトへ反映され、その結果が次の計算入力になるフィードバックループでチラつきが発生するため。
