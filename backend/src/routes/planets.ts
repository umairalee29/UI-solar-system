import { Router, Request, Response } from 'express';
import { getAllPlanets, getPlanetById } from '../services/solarSystem';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const planets = await getAllPlanets();
    res.json(planets);
  } catch (err) {
    console.error('Failed to fetch planets:', err);
    res.status(502).json({ error: 'Failed to fetch planet data from upstream API' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const planet = await getPlanetById(req.params.id);
    if (!planet) {
      res.status(404).json({ error: 'Planet not found' });
      return;
    }
    res.json(planet);
  } catch (err) {
    console.error(`Failed to fetch planet ${req.params.id}:`, err);
    res.status(502).json({ error: 'Failed to fetch planet data from upstream API' });
  }
});

export default router;
