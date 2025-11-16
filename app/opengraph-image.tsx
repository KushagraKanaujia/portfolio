import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kushagra Kanaujia - ML and Systems Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
          fontFamily: 'system-ui',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0,
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Kushagra Kanaujia
          </h1>

          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            ML and Systems Engineer
          </p>

          <p
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Building intelligent, reliable software | UC Santa Barbara '26
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginTop: '48px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                2M+
              </span>
              <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Requests/mo
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                99.9%
              </span>
              <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Uptime
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                10M+
              </span>
              <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Images Processed
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
