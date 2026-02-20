import ogpIcon from '../assets/ogp-icon.png'

function toBase64(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

const iconDataUrl = `data:image/png;base64,${toBase64(ogpIcon)}`

export function OgpTemplate({ title }: { title: string }) {
  return (
    <div
      style={{
        fontFamily: '"Noto Sans JP", "Noto Sans", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '1200px',
        height: '630px',
        backgroundColor: '#f0f0f0',
        padding: '64px',
        gap: '20px',
      }}
    >
      <img src={iconDataUrl} width={60} height={60} />
      <p style={{ fontSize: '56px', margin: 0 }}>{title}</p>
    </div>
  )
}
