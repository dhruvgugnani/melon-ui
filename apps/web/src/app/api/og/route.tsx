import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'MelonUI';

    const category = searchParams.has('category')
      ? searchParams.get('category')
      : 'Premium UI Components';

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
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 92, 113, 0.15) 0%, rgba(5, 5, 5, 1) 80%)',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Subtle Grid Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.5,
            }}
          />

          {/* Glowing Orb */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,92,113,0.3) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(60px)',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              padding: '40px',
              textAlign: 'center',
            }}
          >
            {/* Category / Eyebrow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                padding: '8px 24px',
                background: 'rgba(26, 26, 26, 0.5)',
                border: '1px solid rgba(255, 92, 113, 0.2)',
                borderRadius: '100px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#7fff5e',
                  boxShadow: '0 0 10px #7fff5e',
                }}
              />
              <span
                style={{
                  color: '#e5e5e5',
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                }}
              >
                {category}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: title && title.length > 30 ? '80px' : '100px',
                fontWeight: 900,
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: '0 0 40px 0',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '1000px',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              {title}
            </h1>

            {/* Branding Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: 'auto',
                position: 'absolute',
                bottom: '60px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#f4f4f4',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                }}
              >
                Melon
              </span>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#ff5c71',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                }}
              >
                UI
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`${e.message}`);
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
