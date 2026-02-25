import { beforeEach, describe, expect, it, vi } from 'vitest'
import { err, ok } from '../utils/types'
import { renderOgpPng } from './render'

const {
  asPngMock,
  getFontMock,
  initWasmMock,
  renderMock,
  resvgConstructorMock,
  satoriMock,
  templateMock,
} = vi.hoisted(() => ({
  asPngMock: vi.fn(),
  getFontMock: vi.fn(),
  initWasmMock: vi.fn().mockResolvedValue(undefined),
  renderMock: vi.fn(),
  resvgConstructorMock: vi.fn(),
  satoriMock: vi.fn(),
  templateMock: vi.fn(),
}))

vi.mock('@resvg/resvg-wasm', () => ({
  Resvg: class MockResvg {
    constructor(svg: string) {
      resvgConstructorMock(svg)
    }

    render() {
      renderMock()
      return {
        asPng: asPngMock,
      }
    }
  },
  initWasm: initWasmMock,
}))

vi.mock('@resvg/resvg-wasm/index_bg.wasm', () => ({
  default: { wasm: true },
}))

vi.mock('satori', () => ({
  default: satoriMock,
}))

vi.mock('./font', () => ({
  getFont: getFontMock,
}))

vi.mock('./template', () => ({
  OgpTemplate: templateMock,
}))

describe('renderOgpPng', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('caches', { default: {} as Cache })
    getFontMock.mockResolvedValue(ok(new ArrayBuffer(8)))
    satoriMock.mockResolvedValue('<svg>ok</svg>')
    templateMock.mockReturnValue({ type: 'div', props: {} })
  })

  it('returns PNG bytes for valid input', async () => {
    const pngBytes = new Uint8Array([1, 2, 3])
    asPngMock.mockReturnValue(pngBytes)

    const result = await renderOgpPng({ title: 'valid title' })

    expect(result).toEqual(pngBytes)
    expect(initWasmMock).toHaveBeenCalledTimes(1)
    expect(getFontMock).toHaveBeenCalledWith(caches.default, 'Noto Sans JP')
    expect(templateMock).toHaveBeenCalledWith({ title: 'valid title' })
    expect(satoriMock).toHaveBeenCalledTimes(1)
    expect(resvgConstructorMock).toHaveBeenCalledWith('<svg>ok</svg>')
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(asPngMock).toHaveBeenCalledTimes(1)
  })

  it('throws when font fetch fails', async () => {
    getFontMock.mockResolvedValue(err('font fetch failed'))

    await expect(renderOgpPng({ title: 'valid title' })).rejects.toThrow(
      'font fetch failed',
    )
    expect(satoriMock).not.toHaveBeenCalled()
  })
})
