import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation for Favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'linear-gradient(135deg, #071325 0%, #0d223f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e2ba47',
          borderRadius: '20%',
          border: '1.5px solid #c59b27',
          fontWeight: 900,
          fontFamily: 'serif',
          letterSpacing: '-1px',
        }}
      >
        KS
      </div>
    ),
    {
      ...size,
    }
  );
}
