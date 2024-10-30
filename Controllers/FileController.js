const Controller = require("./Controller");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config()

class FileController extends Controller {}

const filesFilePath = path.join(__dirname, "../Data/Files.json");
const statsFilePath = path.join(__dirname, "../Data/Stats.json");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4/; // Allowed file extensions
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    const isExtNameValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeValid && isExtNameValid) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, and MP4 are allowed.'));
    }
  },
});

const upload = multer({ storage });

const writeFiles = (data) =>
  fs.writeFileSync(filesFilePath, JSON.stringify(data, null, 2));
const readFiles = () => JSON.parse(fs.readFileSync(filesFilePath));

const readStats = () => JSON.parse(fs.readFileSync(statsFilePath));
const writeStats = (data) =>
  fs.writeFileSync(statsFilePath, JSON.stringify(data, null, 2));

FileController.uploadFiles = [
    upload.array("files", 5), // Ensure field name is "files"
    async (req, res) => {
      try {  
        // Ensure tags is parsed correctly or default to an empty array
        const tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags || [];
  
        const files = readFiles();
  
        const uploadedFiles = req.files.map((file, index) => {
          const fileData = {
            id: uuidv4(),
            filename: file.filename,
            tags: tags[index] ? tags[index].split(",") : [], // Handle tags based on index
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`, // Dynamically create the URL
            uploadedAt: new Date().toISOString(),
            email: req.user.email
          };
          files.push(fileData);
          return fileData;
        });
  
        writeFiles(files);
        res.status(201).json({ 
            message: "Files uploaded successfully",         
        });
      } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Failed to upload files" });
      }
    },
  ];

  FileController.readFiles = async (req, res) => {
    try {
      const files = readFiles();  // Read the files data
      const stats = readStats();   // Read the stats data
  
      // Merge files with their corresponding stats
      const filesWithStats = files.map(file => {
        const stat = stats.find(s => s.fileId === file.id); // Assuming file.id matches stat.fileId
        return {
          ...file,
          views: stat ? stat.views : 0, // Default to 0 if no stats found
        };
      });
  
      res.json(filesWithStats); // Send the combined data
    } catch (error) {
      console.error("Error reading files:", error);
      res.status(500).json({ error: "Failed to read files" });
    }
  };
  

FileController.trackFiles = async (req, res) => {
  try {
    const { fileId } = req.body;
    const stats = readStats();
    const stat = stats.find((s) => s.fileId === fileId);

    if (stat) {
      stat.views += 1;
    } else {
      stats.push({ fileId, views: 1 });
    }
    writeStats(stats);

    res.json({ message: "View tracked", fileId, views: stat ? stat.views : 1 });
  } catch (error) {
    console.error("Error tracking views:", error);
    res.status(500).json({ error: "Failed to track view" });
  }
};

module.exports = FileController;
