# HonoX + Cloudflare Workers 動的OGP実装メモ

## 構成

ブログ本体（HonoX）とは別に、OGP画像生成専用のCloudflare Workerを立てる。
本件はMVPのみで、全要件を完成させる

```
[HonoX Blog Worker]
  └─ og:image に OGP Worker の URL を埋め込む
       ↓ SNSクローラーが直接叩く
[OGP Generator Worker]  (ogp.yourblog.com)
  └─ Satori で JSX → SVG
  └─ svg2png-wasm で SVG → PNG
  └─ PNG を返す
```

HonoX側からfetchする必要は基本なく、`og:image`のURLにOGP WorkerのURLを直接書くだけでよい。

---

## ライブラリ選定

| ライブラリ    | 用途                                 |
| ------------- | ------------------------------------ |
| satori        | JSX/仮想DOMをSVGに変換               |
| yoga-wasm-web | satoriが使うレイアウトエンジン       |
| svg2png-wasm  | SVG → PNG変換（resvgより高速・安定） |

> **resvgではなくsvg2png-wasmを使う。** resvgはサイズが大きく（非圧縮2.53MB）、無料プランの制限（圧縮後3MB）とのギリギリ勝負になる。svg2png-wasmの方が安定している。

---

## Cloudflare Workers 無料プランの制限（2025年現在）

| 項目                   | 無料プラン                 |
| ---------------------- | -------------------------- |
| Workerサイズ（圧縮後） | **3MB**（2024年以前は1MB） |
| Workerサイズ（圧縮前） | 64MB                       |
| リクエスト数           | 100,000回/日、1,000回/分   |
| メモリ                 | 128MB                      |
| CPU時間                | 10ms                       |

> CPU時間10msの制限はあるが、Satori+svg2png-wasmの画像生成はこれを超えることがある。ただしキャッシュが効けば実質問題にならない。

---

## フォント（日本語対応）

Noto Sans JPをGoogle Fontsから動的にfetchして、Cache APIにキャッシュする。

```ts
const downloadFont = async (fontName: string) => {
  return await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURI(fontName)}`,
  )
    .then((res) => res.text())
    .then(
      (css) =>
        css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)?.[1],
    )
    .then((url) => (url ? fetch(url).then((v) => v.arrayBuffer()) : undefined));
};
```

フォントは初回取得後にCache APIへ保存し、2回目以降はキャッシュから返す。

---

## キャッシュ戦略

OGP画像は3段階でキャッシュする。

### 1. フォントのキャッシュ

```ts
const cache = await caches.open("cloudflare-ogp");
const cacheKey = `http://font/${encodeURI(fontName)}`;
const cached = await cache.match(cacheKey);
// なければfetchしてctx.waitUntil(cache.put(...))で非同期保存
```

### 2. 生成済みOGP画像のキャッシュ（Cache API）

```ts
const cacheKey = new Request(url.toString());
const cachedResponse = await cache.match(cacheKey);
if (cachedResponse) return cachedResponse; // キャッシュヒット

// 生成後
ctx.waitUntil(cache.put(cacheKey, response.clone()));
```

### 3. Cloudflare CDNキャッシュ

```ts
const response = new Response(png, {
  headers: {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=31536000, immutable",
    date: new Date().toUTCString(),
  },
  cf: {
    cacheEverything: true,
    cacheTtl: 31536000, // 1年
  },
});
```

> **カスタムドメインが必須。** `workers.dev`のデフォルトドメインではCDNキャッシュが効かない。

---

## ドメイン設定

ブログが `pokohanada.com` なら、OGP WorkerにCloudflare Custom Domainとして `ogp.pokohanada.com` を割り当てる。

- CDNキャッシュが有効になる
- og:imageのURLに統一感が出る
- 同一アカウント内なので設定が簡単

HonoX側のog:image埋め込み：

```tsx
const ogImageUrl = `https://ogp.yourblog.com/?title=${encodeURIComponent(title)}`;

<meta property="og:image" content={ogImageUrl} />;
```

---

## セキュリティ

### 基本方針

OGP画像エンドポイントは「公開して叩かせるもの」なので、アクセス元を完全に制限するのは構造的に難しい。slug検証・キャッシュ・WAFレートリミットの組み合わせで対処する。

| リスク                          | 対策                          |
| ------------------------------- | ----------------------------- |
| 存在しないtitleで画像生成を乱発 | R2でslug検証                  |
| 正規slugで大量同一リクエスト    | キャッシュが効くので実害なし  |
| DDoS的な純粋な大量アクセス      | CloudflareのWAFレートリミット |

### slug検証（R2を流用）

ブログ記事をすでにR2で管理しているため、OGP WorkerにR2バインドを追加してslugの存在確認に流用する。`head()`はボディを取得せずメタデータだけ取るので軽く、R2の無料枠（Aクラス操作100万回/月）もほぼ消費しない。

```toml
# wrangler.toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "your-blog-bucket"
```

```ts
app.get("/ogp", async (c) => {
  const slug = c.req.query("slug") ?? "";

  // slugでR2にオブジェクトが存在するか確認
  const obj = await c.env.BUCKET.head(`posts/${slug}.md`);
  if (!obj) return c.text("Not Found", 404);

  // 以降画像生成...
});
```

### ミドルウェアでReferer/UAチェック（補助的）

Refererは偽装可能なので強度は高くないが、雑なアクセスをはじく補助として追加するのはアリ。

```ts
app.use("/ogp", async (c, next) => {
  const referer = c.req.header("Referer") ?? "";
  const ua = c.req.header("User-Agent") ?? "";

  const isAllowed =
    referer.startsWith("https://yourblog.com") ||
    /Twitterbot|facebookexternalhit|Slackbot|Discordbot|Googlebot/.test(ua);

  if (!isAllowed) return c.text("Forbidden", 403);

  await next();
});
```

### その他の基本対策

```ts
// titleの文字数制限
if (title.length > 100) return c.text("Bad Request", 400);
```

CloudflareダッシュボードのSecurity → WAFでレートリミットを設定しておく（無料プランでも基本的なものは使える）。

---

## ローカル開発

### 2つのWorkerを同時に起動

```bash
# ターミナル1: HonoXブログ
wrangler dev --port 5173

# ターミナル2: OGP Worker
wrangler dev --port 8787
```

### 環境変数で向き先を切り替え

`.dev.vars`（gitignore推奨）:

```
OGP_WORKER_URL=http://localhost:8787
```

`wrangler.toml`（本番）:

```toml
[vars]
OGP_WORKER_URL = "https://ogp.yourblog.com"
```

HonoX側で`c.env.OGP_WORKER_URL`として参照する。

画像の確認はブラウザで直接URLを叩けばOK。実際のSNSクローラー挙動の確認はデプロイ後に行う。

---

## 参考

- [honoのブログにogp画像を自動生成して表示する](https://scraplbuild.com/posts/2024-05-25)
- [Cloudflare Workers で OGP 画像を生成](https://next-blog.croud.jp/contents/6355543c-4148-4a93-83dd-79d4a6cdd7ff)
- [Cloudflare Workers Platform Limits](https://developers.cloudflare.com/workers/platform/limits/)
