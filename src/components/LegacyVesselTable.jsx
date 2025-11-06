import React, { useEffect, useState, useMemo } from "react";
import { fetchLegacyFiles } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Download, Search } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";
import "./LegacyVesselTable.css";

const LegacyVesselTable = () => {
  const [legacyFiles, setLegacyFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchLegacyFiles();
        if (response && response["data"]) {
          setLegacyFiles(response["data"]);
        } else {
          toast.info("No data found in response.");
          setLegacyFiles([]);
        }
      } catch (error) {
        console.error("Error fetching legacy files:", error);
        toast.error("Failed to fetch legacy files.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDownload = async (url, fileName) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${fileName}`);
    } catch (error) {
      toast.error("Failed to download file.");
    }
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(legacyFiles)) return [];
    if (!searchTerm.trim()) return legacyFiles;
    return legacyFiles.filter(
      (file) =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.filePath.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [legacyFiles, searchTerm]);

  const totalRecords = filteredData?.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData?.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="legacy-container">
      <ToastContainer position="top-right" autoClose={2000} />

      <Paper elevation={4} className="legacy-card">
        <div className="legacy-header d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-sm-0">
            <img
              src={`${process.env.PUBLIC_URL}/IWT_Icon.jpg`}
              alt="IWT Logo"
              className="iwt-logo me-2"
              style={{ width: "4rem" }}
            />
            <img
              src={`${process.env.PUBLIC_URL}/biswaBangla.png`}
              alt="Biswa Bangla Logo"
              className="iwt-logo me-2"
              style={{ width: "4rem" }}
            />
            <h1 className="m-0 fw-bold">IWT - Legacy Vessel Data</h1>
          </div>

          <div className="legacy-search mt-5 mt-sm-0">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Search by file name or path..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search style={{ color: "#2466BF" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <TableContainer
          component={Paper}
          className="mt-4 legacy-table-container"
        >
          {loading ? (
            <div className="legacy-loading">
              <CircularProgress color="primary" />
            </div>
          ) : (
            <Table stickyHeader className="legacy-table">
              <TableHead>
                <TableRow className="table-header-gradient">
                  <TableCell className="fw-bold text-white">#</TableCell>
                  <TableCell className="fw-bold text-white">
                    Folder Name
                  </TableCell>
                  <TableCell className="fw-bold text-white">
                    File Name
                  </TableCell>
                  <TableCell className="fw-bold text-white">
                    File Path
                  </TableCell>
                  <TableCell className="fw-bold text-white text-center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData?.length > 0 ? (
                  paginatedData?.map((file, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {file?.folderName === "/" ? "Root" : file?.folderName}
                      </TableCell>
                      <TableCell>{file?.fileName || "-"}</TableCell>
                      <TableCell className="truncate-path">
                        {file.filePath}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download File">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleDownload(file?.downloadUrl, file?.fileName)
                            }
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className="no-data">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {totalPages > 1 && (
          <div className="legacy-pagination">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

export default LegacyVesselTable;
