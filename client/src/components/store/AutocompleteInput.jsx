import React, { useState } from 'react';

const AutocompleteInput = ({
  suggestions,
  value,
  onChange,
  onBlur,
  name,
  ...props
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleOnChange = (e) => {
    setShowSuggestions(true);
    onChange(e); // Forward the event to react-hook-form
  };

  const handleOnClick = (suggestion) => {
    // Manually trigger onChange for react-hook-form with the selected value
    onChange({ target: { name, value: suggestion } });
    setShowSuggestions(false);
  };

  const handleOnBlur = (e) => {
    // Delay hiding suggestions to allow click event to register
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
    if (onBlur) {
      onBlur(e);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().indexOf((value || '').toLowerCase()) > -1
  );

  const SuggestionsListComponent = () => {
    if (!showSuggestions || !value) {
      return null;
    }

    if (filteredSuggestions.length) {
      return (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => handleOnClick(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-2">
          <em>No suggestions available.</em>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        {...props}
        name={name}
        value={value || ''}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={() => setShowSuggestions(true)} // Show suggestions when the input is focused
      />
      <SuggestionsListComponent />
    </div>
  );
};

export default AutocompleteInput;
