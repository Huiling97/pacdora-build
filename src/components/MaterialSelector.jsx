import { useState } from 'react';

const MaterialSelector = () => {
  const [selectedMaterial, setSelectedMaterial] = useState('White Card Board');

  const materials = [
    {
      name: 'White Card Board',
      image:
        'https://cdn.pacdora.com/web-assets/7a8defb0-6713-4b9a-8a43-b8ce277fe7f0.jpeg',
    },
    {
      name: 'Flute',
      image: 'https://cdn.pacdora.com/ui/assets/material_flute.jpeg',
      insideName: 'Matte White',
      insideImage:
        '//cdn.pacdora.com/science/image/00e45c0b-9cf7-4d39-bdc8-82bb202909d9.png',
      side: 'https://cdn.pacdora.com/user-materials-mockup_mockup/e31c0a4c-8549-477a-99c9-363d64e3000d.png',
    },
  ];

  const handleChange = async (event) => {
    const materialName = event.target.value;
    setSelectedMaterial(materialName);

    const material = materials.find((m) => m.name === materialName);
    if (!material) return;

    try {
      await Pacdora.setMaterial({
        name: material.name,
        image: material.image,
        insideName: material.insideName,
        insideImage: material.insideImage,
        side: material.side,
        async: true,
      });
    } catch (error) {
      console.error('❌ Failed to set material:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <label htmlFor='material'>Choose material: </label>
      <select id='material' value={selectedMaterial} onChange={handleChange}>
        <option value=''>--Select a material--</option>
        {materials.map((m) => (
          <option key={m.name} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MaterialSelector;
