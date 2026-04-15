export default function FixedBrokerageBadge() {
  return (
    <img
      src="/assets/logos/RLSIR_Horz_white.png"
      alt="Russ Lyon Sotheby's International Realty"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        pointerEvents: 'none',
        width: '110px',
        height: 'auto',
        opacity: 0.55,
      }}
    />
  )
}
