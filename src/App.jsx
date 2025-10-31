import { useEffect, useState } from 'react';
import { exportPacdoraProject, pollExportStatus } from './pacdoraExport';
import MaterialSelector from './components/materialSelector';
import SizeSelector from './components/sizeSelector';

let count = 0;

const App = () => {
  const [pacdoraLoaded, setPacdoraLoaded] = useState(false);
  const [screenshotLink, setScreenshotLink] = useState('');

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

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setPacdoraLoaded(true);

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

  const handleScreenshot = async () => {
    if (!window.Pacdora) return alert('Pacdora not ready yet.');
    setScreenshotLink('');

    try {
      const data = await Pacdora.getBoxInfo();
      console.log('data', data);
      if (data.screenshot) {
        setScreenshotLink(`https:${data.screenshot}`);
      } else {
        console.warn('No screenshot data returned.');
      }
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  const handleOpenScreenshot = () => {
    if (!screenshotLink) {
      alert('Please capture a screenshot first.');
      return;
    }
    window.open(screenshotLink, '_blank');
  };

  const handleExport = async () => {
    try {
      const taskId = await exportPacdoraProject('pdf', [50180489]);
      alert(`Export started! Task ID: ${taskId}`);

      const result = await pollExportStatus('pdf', taskId);
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
          marginTop: '10px',
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

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleScreenshot} disabled={!pacdoraLoaded}>
          Capture Screenshot
        </button>

        <button
          onClick={handleOpenScreenshot}
          disabled={!screenshotLink}
          style={{ marginLeft: '10px' }}
        >
          Open Screenshot
        </button>
      </div>

      <hr style={{ margin: '30px 0' }} />

      <MaterialSelector />
      <SizeSelector />
    </div>
  );
};

export default App;
