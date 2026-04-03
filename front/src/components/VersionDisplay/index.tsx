export default function VersionDisplay() {
  const appVersion = process.env.NEXT_PUBLIC_VERSION || 'dev';
  const displayText = appVersion === 'dev' ? 'dev' : `${appVersion}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '15px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: appVersion === 'dev' ? '#d35400' : '#999',
        fontWeight: appVersion === 'dev' ? 'bold' : 'normal',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '3px 8px',
        borderRadius: '5px',
        border: '1px solid #eee',
        zIndex: 9999
      }}
    >
      {displayText}
    </div>
  );
}
