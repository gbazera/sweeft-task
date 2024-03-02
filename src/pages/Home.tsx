import React, { useEffect, useRef, useState } from 'react'
import { usePopularPhotos, useSearchPhotos } from '../api/unsplash'

import SearchBar from '../components/SearchBar'
import PhotoGrid from '../components/PhotoGrid'

interface Photo {
  id: string;
  urls: { small: string };
  alt_description: string;
}

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [popularPage, setPopularPage] = useState(1)
  const [searchedPage, setSearchedPage] = useState(1)
  const [photos, setPhotos] = useState<Photo[]>([])
  const hasMorePopular = useRef(true)
  const hasMoreSearched = useRef(true)
  const { isLoading: isLoadingPopular, data: popularData } = usePopularPhotos(popularPage)
  const { isLoading: isLoadingSearched, data: searchedData, refetch: refetchSearched } = useSearchPhotos(searchQuery, searchedPage)
  const [searchHistory, setSearchHistory] = useState(()=>{
    const history = localStorage.getItem('searchHistory')
    return history ? JSON.parse(history) : []
  })

  const getSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(()=>{
    setIsSearching(searchQuery.trim().length > 0)

    if(searchQuery.trim()){
      const updatedHistory = [searchQuery, ...searchHistory]
      setSearchHistory(updatedHistory)
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
    }
  }, [searchQuery, searchHistory])

  function deduplicatePhotos(photos: Photo[], newData: Photo[]) {
    const photoIds = new Set(photos.map(photo => photo.id));
    return [...photos, ...newData.filter(photo => !photoIds.has(photo.id))];
  }

  useEffect(() => {
    setPhotos([])
    setSearchedPage(1)
    setPopularPage(1)
  }, [searchQuery, isSearching])

  useEffect(() => {
    if(isSearching && searchedData){
      setPhotos(prev => deduplicatePhotos(prev, searchedData))
      hasMoreSearched.current = searchedData.length > 0
    }
    if(!isSearching && popularData) {
      setPhotos(prev => deduplicatePhotos(prev, popularData))
      hasMorePopular.current = popularData.length > 0
    }
  }, [isSearching, popularData, searchedData])

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY + 10 >= document.body.offsetHeight
  
      if(isAtBottom){
        if(isSearching && hasMoreSearched.current){
          setSearchedPage(prevPage => prevPage + 1)
          refetchSearched()
        }else if(!isSearching && hasMorePopular.current){
          setPopularPage(prevPage => prevPage + 1)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSearching, refetchSearched])

  return (
    <main>
      <SearchBar onSearch={getSearchQuery} />
      <PhotoGrid photos={photos} />
      {isLoadingPopular && <p>Loading...</p>}
      {isLoadingSearched && <p>Loading...</p>}
    </main>
  )
}

export default Home