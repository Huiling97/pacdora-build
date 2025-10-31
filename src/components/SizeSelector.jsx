import { useState } from 'react';

const SizeSelector = () => {
  const [selectedSize, setSelectedSize] = useState('315x202x62');

  const sizes = [
    { label: '315x202x62', width: 202, height: 62, length: 315 },
    { label: '100x100x100', width: 100, height: 100, length: 100 },
    { label: '200x150x120', width: 200, height: 150, length: 120 },
    { label: '300x200x150', width: 300, height: 200, length: 150 },
  ];

  const handleSizeChange = async (event) => {
    const sizeLabel = event.target.value;
    setSelectedSize(sizeLabel);

    const size = sizes.find((s) => s.label === sizeLabel);
    if (!size) return;

    try {
      await Pacdora.setSize({
        width: size.width,
        height: size.height,
        length: size.length,
        type: 'id',
        async: true,
      });
      console.log(`📏 Size set to ${sizeLabel}`);
    } catch (error) {
      console.error('❌ Failed to set size:', error);
    }
  };

  return (
    <div>
      <label htmlFor='size'>Choose size: </label>
      <select id='size' value={selectedSize} onChange={handleSizeChange}>
        <option value=''>--Select a size--</option>
        {sizes.map((s) => (
          <option key={s.label} value={s.label}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeSelector;
