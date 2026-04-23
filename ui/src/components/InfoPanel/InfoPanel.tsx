import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SelectedBody, Planet, Moon } from '../../types/solar';
import styles from './InfoPanel.module.css';

interface Props {
  selected: SelectedBody | null;
  detailedPlanet: Planet | null;
  loadingDetail: boolean;
  onClose: () => void;
  onSelectMoon: (moon: Moon, planet: Planet) => void;
}

function formatMass(mass: { massValue: number; massExponent: number } | null): string {
  if (!mass) return 'Unknown';
  return `${mass.massValue} × 10^${mass.massExponent} kg`;
}

function formatTemp(kelvin: number): string {
  if (!kelvin) return 'Unknown';
  return `${kelvin} K (${Math.round(kelvin - 273.15)}°C)`;
}

function formatRadius(km: number): string {
  if (!km) return 'Unknown';
  return `${km.toLocaleString()} km`;
}

function formatOrbit(days: number): string {
  if (!days) return 'Unknown';
  if (Math.abs(days) > 365) return `${(days / 365.25).toFixed(2)} years`;
  return `${Math.abs(days).toFixed(2)} days`;
}

function PlanetDetail({ planet, detailed, loadingDetail, onSelectMoon }: {
  planet: Planet;
  detailed: Planet | null;
  loadingDetail: boolean;
  onSelectMoon: (moon: Moon, planet: Planet) => void;
}) {
  const [showMoons, setShowMoons] = useState(false);
  const data = detailed ?? planet;
  const moons = data.moons;

  return (
    <>
      <div className={styles.type}>Planet</div>
      <div className={styles.grid}>
        <span className={styles.label}>Radius</span>
        <span className={styles.value}>{formatRadius(data.meanRadius)}</span>

        <span className={styles.label}>Mass</span>
        <span className={styles.value}>{formatMass(data.mass)}</span>

        <span className={styles.label}>Gravity</span>
        <span className={styles.value}>{data.gravity ? `${data.gravity} m/s²` : 'Unknown'}</span>

        <span className={styles.label}>Avg Temp</span>
        <span className={styles.value}>{formatTemp(data.avgTemp)}</span>

        <span className={styles.label}>Orbit Period</span>
        <span className={styles.value}>{formatOrbit(data.sideralOrbit)}</span>

        <span className={styles.label}>Rotation</span>
        <span className={styles.value}>{data.sideralRotation ? `${Math.abs(data.sideralRotation).toFixed(2)} h` : 'Unknown'}</span>

        <span className={styles.label}>Distance (AU)</span>
        <span className={styles.value}>{data.semimajorAxis ? `${(data.semimajorAxis / 149597870.7).toFixed(3)} AU` : 'Unknown'}</span>

        <span className={styles.label}>Moons</span>
        <span className={styles.value}>{data.moonCount}</span>

        {data.axialTilt !== undefined && (
          <>
            <span className={styles.label}>Axial Tilt</span>
            <span className={styles.value}>{data.axialTilt.toFixed(2)}°</span>
          </>
        )}

        {data.alternativeName && (
          <>
            <span className={styles.label}>Also Known As</span>
            <span className={styles.value}>{data.alternativeName}</span>
          </>
        )}

        {data.discoveredBy && (
          <>
            <span className={styles.label}>Discovered By</span>
            <span className={styles.value}>{data.discoveredBy} {data.discoveryDate ? `(${data.discoveryDate})` : ''}</span>
          </>
        )}
      </div>

      {data.moonCount > 0 && (
        <div className={styles.moonsSection}>
          <button
            className={styles.moonsToggle}
            onClick={() => setShowMoons((s) => !s)}
          >
            {loadingDetail ? 'Loading moons…' : `${showMoons ? 'Hide' : 'View'} Moons (${data.moonCount})`}
          </button>

          <AnimatePresence>
            {showMoons && moons.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.moonList}
              >
                {moons.map((moon) => (
                  <button
                    key={moon.id}
                    className={styles.moonItem}
                    onClick={() => onSelectMoon(moon, data)}
                  >
                    {moon.englishName}
                    {moon.meanRadius > 0 && <span className={styles.moonRadius}>{formatRadius(moon.meanRadius)}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

function MoonDetail({ moon, parentPlanet }: { moon: Moon; parentPlanet: Planet }) {
  return (
    <>
      <div className={styles.type}>Moon of {parentPlanet.englishName}</div>
      <div className={styles.grid}>
        <span className={styles.label}>Radius</span>
        <span className={styles.value}>{formatRadius(moon.meanRadius)}</span>

        <span className={styles.label}>Orbit Distance</span>
        <span className={styles.value}>{moon.semimajorAxis ? `${moon.semimajorAxis.toLocaleString()} km` : 'Unknown'}</span>

        <span className={styles.label}>Orbit Period</span>
        <span className={styles.value}>{moon.sideralOrbit ? formatOrbit(moon.sideralOrbit) : 'Unknown'}</span>

        {moon.discoveredBy && (
          <>
            <span className={styles.label}>Discovered By</span>
            <span className={styles.value}>{moon.discoveredBy} {moon.discoveryDate ? `(${moon.discoveryDate})` : ''}</span>
          </>
        )}
      </div>
    </>
  );
}

export function InfoPanel({ selected, detailedPlanet, loadingDetail, onClose, onSelectMoon }: Props) {
  const title = selected
    ? selected.type === 'planet'
      ? selected.planet.englishName
      : selected.moon.englishName
    : '';

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className={styles.panel}
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 180 }}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
          </div>

          <div className={styles.body}>
            {selected.type === 'planet' ? (
              <PlanetDetail
                planet={selected.planet}
                detailed={detailedPlanet}
                loadingDetail={loadingDetail}
                onSelectMoon={onSelectMoon}
              />
            ) : (
              <MoonDetail moon={selected.moon} parentPlanet={selected.parentPlanet} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
