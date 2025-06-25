export default function Input({ type = "text", title = "", name = "", id, value = "", onChange, className = "", placeholder = "" }) {
  const inputId = id || name;
  return (
    <div className={`${className} w-full flex flex-col`}>
      <label htmlFor={inputId} className="font-medium mb-1">
        {title}
      </label>
      {
          onChange
          ?
          <input
            type={type}
            name={name}
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full focus:outline-none px-2 py-1 bg-[#e9e9e9] shadow-md shadow-gray-300 rounded"
          />
          :
          <input
            type={type}
            name={name}
            value={value}
            id={inputId}
            placeholder={placeholder}
            className="w-full focus:outline-none px-2 py-1 bg-[#e9e9e9] shadow-md shadow-gray-300 rounded"
            readOnly
          />
      }

    </div>
  );
}
