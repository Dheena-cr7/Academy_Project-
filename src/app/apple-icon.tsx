import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: 'linear-gradient(135deg, #071325 0%, #0d223f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e2ba47',
          border: '6px solid #c59b27',
          fontWeight: 900,
          fontFamily: 'serif',
        }}
      >
        <span style={{ fontSize: 80, lineHeight: 1, letterSpacing: '-2px' }}>KS</span>
        <span
          style={{
            fontSize: 14,
            letterSpacing: '4px',
            color: '#ffffff',
            marginTop: 8,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: 'sans-serif',
          }}
        >
          ACADEMY
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
