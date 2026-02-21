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
        backgroundColor: '#efefef',
        padding: '50px 48px',
        boxSizing: 'border-box',
      }}
    >
    <div style={{ padding: '76px 40px 32px', backgroundColor: '#ffffff', display: 'flex', borderRadius: '24px', boxShadow: '0 18px 30px rgba(0, 0, 0, 0.1)', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <p style={{ fontSize: '60px', margin: '0', textAlign: 'center' }}>{title}</p>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', margin: '0'}}>
            <p style={{fontSize: '46px', margin:'0'}}>PokoHanada</p>
            <img src={iconDataUrl} width={80} height={80} />
          </div>
        </div>
      </div>
    </div>
  )
}
