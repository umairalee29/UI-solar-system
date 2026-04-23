import axios from 'axios';
import type { Planet } from '../types/solar';

const client = axios.create({ baseURL: '/api' });

export async function getPlanets(): Promise<Planet[]> {
  const { data } = await client.get<Planet[]>('/planets');
  return data;
}

export async function getPlanetById(id: string): Promise<Planet> {
  const { data } = await client.get<Planet>(`/planets/${id}`);
  return data;
}
