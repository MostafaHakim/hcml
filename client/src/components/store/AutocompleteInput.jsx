import { useState, useEffect } from "react";

const AutocompleteInput = ({
  inputRef,
  suggestions = [],
  value = "",
  onChange,
  placeholder = "",
  className = "",
}) => {
  const [filtered, setFiltered] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (value) {
      const filteredSuggestions = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filteredSuggestions);
    } else {
      setFiltered([]);
    }
  }, [value, suggestions]);

  const handleSelect = (val) => {
    onChange({ target: { value: val } }); // simulate change
    setShowList(false);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {showList && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-y-auto">
          {filtered.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="px-3 py-1 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
