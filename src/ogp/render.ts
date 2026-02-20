import { Resvg, initWasm } from '@resvg/resvg-wasm'
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'
import satori from 'satori'
import { isErr } from '../utils/types'
import { getFont } from './font'
import { OgpTemplate } from './template'

type RenderOgpInput = { title: string }
let wasmInitialized: Promise<void> | null = null

function ensureResvgWasm(): Promise<void> {
  if (!wasmInitialized) {
    wasmInitialized = initWasm(resvgWasm)
  }
  return wasmInitialized
}

export async function renderOgpPng({ title }: RenderOgpInput): Promise<Uint8Array> {
  await ensureResvgWasm()
  const fontResult = await getFont(caches.default, 'Noto Sans JP')

  if (isErr(fontResult)) {
    throw new Error(fontResult.error)
  }

  const font = fontResult.value
  const template = OgpTemplate({ title })

  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Noto Sans JP',
        data: font,
        weight: 400,
        style: 'normal',
      },
    ],
  })

  const resvg = new Resvg(svg)
  return resvg.render().asPng()
}
