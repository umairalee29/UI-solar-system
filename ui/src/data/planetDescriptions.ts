export interface PlanetDescription {
  tagline: string;
  description: string;
  glowColor: string;   // atmospheric glow tint
}

export const PLANET_DESCRIPTIONS: Record<string, PlanetDescription> = {
  mercure: {
    tagline: 'The Swift Messenger',
    description:
      'The smallest planet in our Solar System races around the Sun in just 88 days. Its surface is a scorched, cratered world with extreme temperature swings — from 430 °C at noon to −180 °C at midnight.',
    glowColor: '#c0a080',
  },
  venus: {
    tagline: 'Earth\'s Toxic Twin',
    description:
      'Shrouded in thick clouds of sulfuric acid, Venus is the hottest planet in the Solar System despite being second from the Sun. Its crushing atmosphere and volcanic plains make it the most hostile world we know.',
    glowColor: '#e8c860',
  },
  terre: {
    tagline: 'Our Living World',
    description:
      'The third planet from the Sun is a vibrant world filled with life. It boasts diverse ecosystems, vast oceans, and abundant water — making it the only planet in our Solar System known to support life.',
    glowColor: '#4a90d9',
  },
  mars: {
    tagline: 'The Red Planet',
    description:
      'Mars is a cold desert world with the tallest volcano and deepest canyon in the Solar System. Evidence of ancient rivers and polar ice caps suggests it once held the conditions necessary for life.',
    glowColor: '#c84820',
  },
  jupiter: {
    tagline: 'King of the Planets',
    description:
      'More than twice as massive as all other planets combined, Jupiter is a swirling giant of gas. Its Great Red Spot — a storm larger than Earth — has raged for over 350 years.',
    glowColor: '#c89050',
  },
  saturne: {
    tagline: 'The Ringed Wonder',
    description:
      'Saturn\'s iconic rings — made of ice and rock — stretch 282,000 km but are less than 1 km thick. The least dense planet in the Solar System, Saturn would float if placed in a large enough ocean.',
    glowColor: '#e0c880',
  },
  uranus: {
    tagline: 'The Tilted Ice Giant',
    description:
      'Uranus rotates on its side with an axial tilt of nearly 98 degrees, likely the result of a massive ancient collision. Its blue-green hue comes from methane in its atmosphere absorbing red light.',
    glowColor: '#70d8e0',
  },
  neptune: {
    tagline: 'The Windswept Frontier',
    description:
      'The furthest planet from the Sun, Neptune has the strongest winds in the Solar System — reaching 2,100 km/h. Its largest moon Triton orbits backwards and is slowly spiralling inward.',
    glowColor: '#2050e8',
  },
};
