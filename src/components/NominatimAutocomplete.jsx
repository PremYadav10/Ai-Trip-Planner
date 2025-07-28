// NominatimAutocomplete.jsx
import React, { useState } from 'react';

const NominatimAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
  const value = e.target.value;
  setQuery(value);

  if (value.length < 3) {
    setResults([]);
    return;
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        value
      )}&format=json&addressdetails=1&limit=5&accept-language=en`
    );
    const data = await res.json();
    setResults(data);
  } catch (error) {
    console.error('Error fetching place data:', error);
    setResults([]);
  }
};


  const handleSelect = (place) => {
    setQuery(place.display_name);
    onSelect(place);
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Enter destination..."
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded mt-1 shadow">
          {results.map((place) => (
            <li
              key={place.place_id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NominatimAutocomplete;
