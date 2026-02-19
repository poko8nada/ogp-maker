**This is a template. Fill in the [] or ``, duplicate or delete the template parts as needed.**

# [プロジェクト名] 要件定義書 (requirement.md)

## 概要 (Overview)

本プロジェクトは、[プロジェクトの目的を簡潔に説明]。

- **サービス名**
  - [サービス名] (仮)
- **目的**
  - [プロジェクトの目的と背景]
- **ターゲット**
  - [想定ユーザー、利用シーン]

---

## 技術スタック (Technology Stack)

### MVP

ライブラリ・パッケージ:
**Keep only the necessary items**

| 項目                    | ライブラリ・フレームワーク・パッケージ            |
| ----------------------- | ------------------------------------------------- |
| フロントエンド          | [Next.js / React / htmx / など]                   |
| バックエンド            | [Hono / Express / など]                           |
| ホスティング            | [Vercel / Cloudflare Workers / Cloud Run // など] |
| 認証                    | [Clerk / Auth0 / better auth / など]              |
| 状態管理                | [React Context / Zustand / nuqs / など]           |
| スタイル/コンポーネント | [Tailwind CSS / shadcn / react aria / など]       |
| ORM                     | [Drizzle ORM / Prisma / など]                     |
| データベース            | [D1 / Turso / Supabase / Neon /など]              |
| リンター/フォーマッター | [Biome / ESLint + Prettier / など]                |
| パッケージマネージャー  | pnpm                                              |
| テスト                  | Vitest                                            |
| [その他 XXX]            | [使用するものを明記]                              |

スクリプト:
**Keep only the necessary items**

- `dev`: [開発サーバー起動コマンド]
- `build`: [ビルドコマンド]
- `preview`: [ローカルプレビューコマンド]
- `deploy`: [デプロイコマンド]
- `test`: [テスト実行コマンド]
- `lint`: [Lint/フォーマット実行コマンド]
- `format`: [コードフォーマット実行コマンド]
- `typecheck`: [型チェックコマンド]
- `db:migrate`: [データベースマイグレーションコマンド（該当する場合）]
- `db:seed`: [データベースシードコマンド（該当する場合）]
- `generate`: [コード生成コマンド（該当する場合）]

### PRODUCT v1以降

**Write down only what is decided**

---

## 機能要件 (Functional Requirements)

**This is example, Write each item in full without omitting anything.**

### FR-01: 記事一覧のタグ絞り込み

- 要件: 一覧画面でタグ選択時に該当記事のみ表示する
- 詳細:
  - `tag` クエリを取得し、一覧データへ適用する
  - 選択中タグをUI表示し、解除操作で全件表示へ戻す
- 作成予定のファイル・関数・コンポーネント・型など:
  - `app/posts/page.tsx`
    - `PostsPage({ searchParams }): JSX.Element`
    - `type PostsPageProps = { searchParams: { tag?: string } }`
  - `app/posts/_lib/getPosts.ts`
    - `getPosts(filter: { tag?: string }): Promise<Post[]>`
    - `type Post = { id: string, title: string, tags: string[] }`
  - `components/TagSelector.tsx`
    - `TagSelector({ tags, selectedTag, onSelect }): JSX.Element`
    - `type TagSelectorProps = { tags: string[], selectedTag?: string, onSelect: (tag?: string) => void }`
- テスト: [なし / 単体テスト / 結合テスト / E2Eテスト]
- テスト観点(正常と異常):
  - タグ選択で該当記事のみ表示されること
  - タグ選択解除で全件表示に戻ること

### FR-XX: [機能カテゴリ名]

- 要件: [機能の概要を簡潔に説明]
- 詳細:
  - [機能の詳細な説明や仕様、例など]
- [関数/コンポーネント/型/スタイル/テスト]:
  - `[対象ファイルパス]`
    - `[関数/コンポーネント名]({ props }): JSX.Element`
    - `type [型名] = { ... }`
  - [必要に応じて複数ファイル・関数を記載]
- テスト: [なし / 単体テスト / 結合テスト / E2Eテスト]
- テスト観点(正常と異常):
  - [機能が正常に動作すること]
  - [エラーや例外が適切に処理されること]

---

## 非機能要件 (Non-Functional Requirements)

### NFR-01: パフォーマンス

- [パフォーマンス要件]
- 例: レスポンスタイム、UI更新頻度、バンドルサイズ

### NFR-02: 互換性

- [ブラウザ・デバイス対応]
- 例: Chrome latest, Firefox latest, Safari latest

### NFR-03: アクセシビリティ

- [アクセシビリティ要件]
- 例: WCAG 2.1 Level AA準拠、キーボード操作対応

### NFR-04: セキュリティ

- [セキュリティ要件]
- 例: 機密情報の管理、認証・認可

### NFR-05: ライセンスコンプライアンス

| リソース     | 用途   | ライセンス       | クレジット表記     |
| ------------ | ------ | ---------------- | ------------------ |
| [リソース名] | [用途] | [ライセンス種別] | [必要なクレジット] |
| [リソース名] | [用途] | [ライセンス種別] | [必要なクレジット] |

---

## ディレクトリ構成と作成ファイル (Directory Structure & Files)

**This is an example structure. Adjust according to your project needs.**
**Basic rule is "Collocation strategy"**

```
app/
├── dashboard/
│   ├── @modal/              # Parallel route
│   ├── @search/             # Parallel route
│   ├── page.tsx             # Server component
│   ├── loading.tsx          # Loading UI (auto-wrapped in Suspense)
│   ├── error.tsx            # Error boundary
│   ├── _components/         # Route-specific UI
│   ├── _features/           # Route-specific logic
│   ├── _hooks/              # Shared across route features
│   ├── _actions/            # Route-specific server actions
│   ├── _lib/                # Route-specific business logic
│   │   ├── userLogic.ts
│   │   └── userLogic.test.ts
│   ├── _store/              # Route-specific Zustand stores
│   │   └── dashboardStore.ts
│   └── _config/             # Route-specific config
├── posts/
│   ├── [slug]/              # Dynamic route
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── _components/
│   ├── _features/
│   ├── _hooks/
│   ├── _actions/
│   ├── _lib/
│   └── _config/
├── page.tsx                # Root page
├── loading.tsx             # Root loading
├── error.tsx               # Root error boundary
└── layout.tsx              # Root layout

components/                # Global shared UI
├── ui/                     # Atomic UI pieces (shadcn/ui, primitives)
├── layouts/                # Layout components (PageLayout, SectionLayout)
└── ...                     # Custom global components

hooks/                     # Global shared hooks
lib/                       # Global business logic
├── userActions.ts
├── userActions.test.ts
├── auth.ts
└── api.ts
store/                     # Global Zustand stores
├── userStore.ts
└── appStore.ts
utils/                     # Pure utilities only (NOT business logic)
├── format.ts              # Date formatting, string manipulation, etc.
└── types.ts               # Global types only (e.g., Result<T,E>)
public/                    # Static assets
```

---

## 画面設計 (Screen Design)

### 画面一覧 (Screen List)

| No  | 画面名   | URLパス     | 機能概要               | 備考 |
| --- | -------- | ----------- | ---------------------- | ---- |
| 001 | ホーム   | `/`         | サービスのトップページ |      |
| XXX | [画面名] | `[URLパス]` | [機能]                 |      |

### ワイヤーフレーム・モックアップ (Wireframes & Mockups)

[ワイヤーフレーム・モックアップがあれば、ここにリンクを挿入]

---

## デザインシステム (Design System)

### デザイン方針

- [デザインの基本方針やコンセプトを簡潔に説明]
- 例: シンプルで直感的なUI、ブランドカラーを活かしたデザイン、アクセシビリティを重視

### カラーパレット (Color Palette)

**カラー対応**

- カラーモード: [シングルカラー / デュアルカラー]

- デュアルカラーの場合:
  - ライトモード: [必須 / 不要]
  - ダークモード: [必須 / 不要 / オプション]
  - システム設定追従: [あり / なし]

**ライトモード** or **シングルカラー**

_プライマリカラー_

- Primary: `#000000` - [用途: メインアクション、ブランドカラー]
- Primary hover: `#000000` - [ホバー時の色]

_セカンダリカラー_

- Secondary: `#000000` - [用途: セカンダリアクション]
- Secondary hover: `#000000` - [ホバー時の色]

_背景・テキストカラー_

- Background: `#FFFFFF` - [背景色]
- Surface: `#F5F5F5` - [カード・パネル背景]
- Text primary: `#1A1A1A` - [メインテキスト]
- Text secondary: `#666666` - [サブテキスト]

_セマンティックカラー_

- Success: `#10B981` - [成功状態、完了]
- Warning: `#F59E0B` - [警告、注意]
- Error: `#EF4444` - [エラー、削除]
- Info: `#3B82F6` - [情報、ヘルプ]

**ダークモード** If applicable

_プライマリカラー_

- Primary: `#FFFFFF` - [用途: メインアクション、ブランドカラー]
- Primary hover: `#E5E5E5` - [ホバー時の色]

_セカンダリカラー_

- Secondary: `#A0A0A0` - [用途: セカンダリアクション]
- Secondary hover: `#B0B0B0` - [ホバー時の色]

_背景・テキストカラー_

- Background: `#0A0A0A` - [背景色]
- Surface: `#1A1A1A` - [カード・パネル背景]
- Text primary: `#E5E5E5` - [メインテキスト]
- Text secondary: `#A0A0A0` - [サブテキスト]

_セマンティックカラー_

- Success: `#10B981` - [成功状態、完了]
- Warning: `#F59E0B` - [警告、注意]
- Error: `#EF4444` - [エラー、削除]
- Info: `#3B82F6` - [情報、ヘルプ]

**コントラスト比**

- Text primary / Background: 4.5:1 以上（WCAG AA準拠）
- Text secondary / Background: 4.5:1 以上
- Interactive elements: 3:1 以上

**実装パターン**

- Tailwind の `dark:` バリアントを使用: `bg-white dark:bg-black`
- `next-themes` などのライブラリでテーマ切り替え実装
- システム設定追従の場合: `darkMode: 'media'` を使用

---

## 備考・参考資料 (Notes & References)

- [参考URL](https://example.com)
- [デザインモックアップ]
- [その他補足情報]
