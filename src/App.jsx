import { useEffect } from 'react';
import { exportPacdoraProject, pollExportStatus } from './pacdoraExport';

let count = 0;

const App = () => {
  useEffect(() => {
    const loadPacdora = async () => {
      try {
        await window.Pacdora.init({
          appId: 'fc233def563c15bc',
          isDelay: true,
          quotation: true,
        });

        await window.Pacdora.createScene({
          modelId: '150010',
          templateId: '50180489',
          containerId: 'pacdora-container',
          isShowLoading: true,
          isCreatePreview: true,
          advancedSetting: {
            width: 200,
            height: 200,
            length: 200,
            thickness: 0.4,
            materialId: 44,
            materialImage:
              'https://cdn.pacdora.com/science/image/94e8078a-9931-42cd-97ed-57883bd88085.png',
            materialName: 'White card board',
            sizeType: 2,
          },
          packagingColors: ['#ff0000', '#00ff00', '#0000ff', '#893829'],
        });

        // Add a small delay to ensure scene is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Force UI render
        if (!count) {
          loadPacdora();
          count++;
        }
      } catch (err) {
        console.error('Pacdora error:', err);
      }
    };

    loadPacdora();
  }, []);

  const handleExport = async () => {
    try {
      const taskId = await exportPacdoraProject('pdf', [50180489]);
      alert(`Export started! Task ID: ${taskId}`);

      const result = await pollExportStatus('pdf', taskId);
      console.log('res', result);
      if (result) {
        alert(`Export finished! File URL: ${result.filePath}`);
      }
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pacdora 3D Example</h1>

      <div id='pacdora-container'>
        <div data-pacdora-ui='3d-preview'></div>
        <div
          data-pacdora-ui='3d'
          data-show-slider='true'
          data-slider-position='bottom'
        ></div>

        <div
          data-pacdora-ui='dieline'
          style={{
            width: '775px',
            height: '300px',
            border: '1px solid #ccc',
            marginTop: '20px',
          }}
        ></div>
      </div>

      <div
        data-save-screenshot='true'
        data-screenshot-width='800'
        data-pacdora-id='design-btn'
        data-pacdora-ui='design-btn'
        style={{
          margin: '20px 0',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer',
          display: 'inline-block',
        }}
      >
        Design Online
      </div>

      <button
        onClick={handleExport}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '8px',
        }}
      >
        Export Project
      </button>

      <div data-quotation-ui='select' data-quotation-form></div>
    </div>
  );
};

export default App;
