import { useState,useRef ,useEffect} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import './pydict.css'
// Correct PDF worker path
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [chatResponse, setChatResponse] = useState("Start asking insights about the PDF");
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const [uploadedFiles,setUploadedFiles] = useState([]);
  const [activeFile,setActiveFile] = useState();

    // Create a reference for the file input
    const fileInputRef = useRef(null);

    // Trigger file input when the button is clicked
    const handleButtonClick = () => {
      fileInputRef.current.click();
    };


  // Adjust page width dynamically
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile){
      setFile(URL.createObjectURL(uploadedFile));
      setPdfName(uploadedFile.name);
    }
    const files = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleChatRequest = () => {
    setChatResponse("Looking for insights...");
  };

  return (
    <div className="pdf-uploader">
    {/* ChatGPT-Style Sidebar */}
    <div className="file-list">
    <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={onFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-button">
          Upload File
        </label>

        {/* File List Display */}
        {uploadedFiles.length > 0 ? (
          <ul className="file-list-items">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className={`file-item ${activeFile === index ? "active" : ""}`}
                onClick={() => setActiveFile(index)}
              >
                {file.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="file-item">No files uploaded</p>
        )}

    </div>


      {/* Center Panel - Full PDF View */}
      <div className="pdf-display">
        {file && (
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
          >
                    {Array.from({ length: numPages }, (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width}/>
          ))}

          </Document>
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className="chat-section">
        <h3 className="text-lg font-bold">Chat</h3>
        <p className="chat-response">{chatResponse}</p>
        <button onClick={handleChatRequest} className="submit-btn">
          Get Insights
        </button>
      </div>
    </div>
  );
};

export default PdfUploader;
