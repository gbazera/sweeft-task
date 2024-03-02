import { UseQueryOptions, useQuery } from '@tanstack/react-query'

const BASE_URL = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

interface Photo {
  id: string;
  urls: { small: string };
  alt_description: string;
}

interface SinglePhoto {
  id: string;
  urls: { regular: string };
  alt_description: string;
  views: { total: number };
  likes: { total: number };
  downloads: { total: number };
}

const getPopularPhotos = async (page: number): Promise<Photo[]> => {
  const response = await fetch(`${BASE_URL}/photos?page=${page}&per_page=20&order_by=popular&client_id=${ACCESS_KEY}`, {
    method: 'GET',
  });

  if(!response.ok){
    throw new Error(`HTTP Error: ${response.status}`)
  }

  const data = await response.json()
  return data
};

const getSearchPhotos = async (query: string, page: number): Promise<Photo[]> => {
  const response = await fetch(`${BASE_URL}/search/photos?query=${query}&page=${page}&per_page=20&client_id=${ACCESS_KEY}`, {
    method: 'GET',
  });

  if(!response.ok){
    throw new Error(`HTTP Error: ${response.status}`)
  }

  const data = await response.json()
  return data.results
};

export const getPhoto = async (id: string): Promise<SinglePhoto> => {
  const response = await fetch(`${BASE_URL}/photos/${id}?client_id=${ACCESS_KEY}`, {
    method: 'GET',
  });

  if(!response.ok){
    throw new Error(`HTTP Error: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export const usePopularPhotos = (page: number) => {
  const queryOptions: UseQueryOptions<Photo[], Error, Photo[]> = {
    queryKey: ['popularPhotos', page],
    queryFn: () => getPopularPhotos(page),
  }

  return useQuery(queryOptions);
};

export const useSearchPhotos = (query: string, page: number) => {
  const queryOptions: UseQueryOptions<Photo[], Error, Photo[]> = {
    queryKey: ['searchPhotos', query],
    queryFn: () => getSearchPhotos(query, page),
  }

  return useQuery(queryOptions);
};