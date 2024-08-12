const FilterSection = ({ title, options, selectedValue, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      {options.map((option, key) => (
        <div key={option + key} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={`${title}-${option}`}
            checked={selectedValue === option}
            onChange={() => onChange(option)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <label htmlFor={`${title}-${option}`} className="ml-2 text-gray-700">
            {option}
          </label>

        </div>
      ))}
    </div>
  );
};

export default FilterSection;
