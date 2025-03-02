import { useState,useRef ,useEffect} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import './pydict.css'
import ChatSection from "./chatSection";
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

  const onFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile){
      setFile(URL.createObjectURL(uploadedFile));
      setPdfName(uploadedFile.name);

      const formData = new FormData();
      formData.append("file",uploadedFile);
      try{
        const response = await fetch ("http://localhost:8001/files/upload/",{
        "method":"POST",
        "mode":"cors",
        "body":formData
        });

        const data= await response.json();
        console.log("Upload is successfull");
      }catch(error){
        console.log("Error uploading file",error);
      }
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
        {file ? (
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
          >
                    {Array.from({ length: numPages }, (_, index) => (
            <Page key={`page_${index}`} pageNumber={index} width={width}/>
          ))}

          </Document>
        ):(
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}>
            <h2>PDF to be displayed</h2>
          </div>
        )}
      </div>

      {/* Right Panel - Chat */}
      
        <ChatSection documentId={pdfName}></ChatSection>
    </div>
  );
};

export default PdfUploader;
