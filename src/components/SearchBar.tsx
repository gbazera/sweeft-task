import React, { useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    if(timeoutRef.current){
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(searchQuery)
    }, 700)
  },[searchQuery, onSearch])

  return (
    <div>
      <input className='search' type="text" value={searchQuery} onChange={handleChange} placeholder='Search for images'/>
    </div>
  );
};

export default SearchBar;