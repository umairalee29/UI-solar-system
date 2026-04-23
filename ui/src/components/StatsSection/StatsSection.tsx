import type { Planet, Moon } from '../../types/solar';
import styles from './StatsSection.module.css';

interface Props {
  planet: Planet | null;
  loadingDetail: boolean;
  onSelectMoon: (moon: Moon, planet: Planet) => void;
}

function formatMass(mass: { massValue: number; massExponent: number } | null) {
  if (!mass) return '—';
  return `${mass.massValue} × 10^${mass.massExponent} kg`;
}

function formatTemp(k: number) {
  if (!k) return '—';
  return `${k} K  /  ${Math.round(k - 273.15)} °C`;
}

function formatOrbit(days: number) {
  if (!days) return '—';
  return Math.abs(days) > 365
    ? `${(days / 365.25).toFixed(2)} years`
    : `${Math.abs(days).toFixed(2)} days`;
}

function formatAU(km: number) {
  if (!km) return '—';
  return `${(km / 149597870.7).toFixed(3)} AU`;
}

interface StatRowProps { label: string; value: string }
function StatRow({ label, value }: StatRowProps) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

export function StatsSection({ planet, loadingDetail, onSelectMoon }: Props) {
  if (!planet) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{planet.englishName}</h2>
        {planet.alternativeName && (
          <p className={styles.aka}>Also known as: {planet.alternativeName}</p>
        )}

        <div className={styles.grid}>
          <StatRow label="Equatorial Radius" value={planet.equaRadius ? `${planet.equaRadius.toLocaleString()} km` : '—'} />
          <StatRow label="Mass"             value={formatMass(planet.mass)} />
          <StatRow label="Gravity"          value={planet.gravity ? `${planet.gravity} m/s²` : '—'} />
          <StatRow label="Avg Temperature"  value={formatTemp(planet.avgTemp)} />
          <StatRow label="Orbital Period"   value={formatOrbit(planet.sideralOrbit)} />
          <StatRow label="Rotation Period"  value={planet.sideralRotation ? `${Math.abs(planet.sideralRotation).toFixed(2)} h` : '—'} />
          <StatRow label="Axial Tilt"       value={planet.axialTilt !== undefined ? `${planet.axialTilt.toFixed(2)}°` : '—'} />
          <StatRow label="Distance from Sun" value={formatAU(planet.semimajorAxis)} />
          <StatRow label="Eccentricity"     value={planet.eccentricity?.toFixed(5) ?? '—'} />
          <StatRow label="Density"          value={planet.density ? `${planet.density.toLocaleString()} kg/m³` : '—'} />
          <StatRow label="Escape Velocity"  value={planet.escape ? `${(planet.escape / 1000).toFixed(2)} km/s` : '—'} />
          <StatRow label="Known Moons"      value={String(planet.moonCount || 0)} />
        </div>

        {planet.moonCount > 0 && (
          <div className={styles.moonsBlock}>
            <h3 className={styles.moonsHeading}>
              Moons
              {loadingDetail && <span className={styles.loading}> — loading…</span>}
            </h3>
            {planet.moons.length > 0 ? (
              <div className={styles.moonPills}>
                {planet.moons.map((moon) => (
                  <button
                    key={moon.id}
                    className={styles.moonPill}
                    onClick={() => onSelectMoon(moon, planet)}
                    title={`Fly to ${moon.englishName}`}
                  >
                    {moon.englishName}
                    {moon.meanRadius > 0 && (
                      <span className={styles.moonRadius}>{moon.meanRadius.toLocaleString()} km</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              !loadingDetail && (
                <p className={styles.noMoons}>
                  This planet has {planet.moonCount} known moon{planet.moonCount !== 1 ? 's' : ''}.
                  Detailed moon data will load when available.
                </p>
              )
            )}
          </div>
        )}

        {planet.discoveredBy && (
          <p className={styles.discovery}>
            Discovered by {planet.discoveredBy}
            {planet.discoveryDate ? ` in ${planet.discoveryDate}` : ''}
          </p>
        )}
      </div>
    </section>
  );
}
