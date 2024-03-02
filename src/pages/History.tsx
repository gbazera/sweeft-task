import React, { useEffect, useRef, useState } from 'react';

import { useSearchPhotos } from '../api/unsplash'

import PhotoGrid from '../components/PhotoGrid'

interface Photo {
  id: string;
  urls: { small: string };
  alt_description: string;
}

const History: React.FC = () => {
  const [searchHistory, setSearchHistory] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchedPage, setSearchedPage] = useState(1)
  const [photos, setPhotos] = useState<Photo[]>([])
  const hasMoreSearched = useRef(true)
  const { isLoading: isLoadingSearched, data: searchedData, refetch: refetchSearched } = useSearchPhotos(searchQuery, searchedPage)

  useEffect(()=>{
    const storedHistory = localStorage.getItem('searchHistory')
    if(storedHistory){
      setSearchHistory(JSON.parse(storedHistory))
    }
  }, [])

  useEffect(()=>{
    setIsSearching(searchQuery !== '')
  }, [searchQuery])

  function deduplicatePhotos(photos: Photo[], newData: Photo[]) {
    const photoIds = new Set(photos.map(photo => photo.id));
    return [...photos, ...newData.filter(photo => !photoIds.has(photo.id))];
  }

  useEffect(() => {
    setPhotos([])
    setSearchedPage(1)
  }, [searchQuery, isSearching])

  useEffect(() => {
    if(isSearching && searchedData){
      setPhotos(prev => deduplicatePhotos(prev, searchedData))
      hasMoreSearched.current = searchedData.length > 0
    }
  }, [isSearching, searchedData])

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY + 10 >= document.body.offsetHeight
  
      if(isAtBottom){
        if(isSearching && hasMoreSearched.current){
          setSearchedPage(prevPage => prevPage + 1)
          refetchSearched()
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSearching, refetchSearched])

  return (
    <main>
      <div className="container">
        <ul>
          <p className='heading'>Search History</p>
          {searchHistory.map((query, index) => (
            <li key={index} onClick={()=>{setSearchQuery(query)}}>{query}</li>
          ))}
        </ul>
        <div>
          <p className="heading">{searchQuery}</p>
        <PhotoGrid photos={photos} />
          </div>
        {isLoadingSearched && <p>Loading...</p>}
      </div>
    </main>
  );
};

export default History;