import {
  openEnterpriseDocument,
  downloadEnterpriseDocument,
} from "@/services/enterprise/enterpriseService";
import { FiFileText, FiDownload } from "react-icons/fi";
import Button from "@/components/common/Button";

const DocumentSection = ({ documents = [], enterpriseId }) => {
  const handleOpen = (doc) => {
    const filename = doc.path.split("/").pop();
    if (filename) openEnterpriseDocument(enterpriseId, filename);
  };

  const handleDownload = (doc) => {
    const filename = doc.path.split("/").pop();
    if (filename) {
      downloadEnterpriseDocument(enterpriseId, filename, doc.original_name);
    }
  };
  const truncateFilename = (name, max = 30) => {
    if (name.length <= max) return name;
    const ext = name.includes(".") ? "." + name.split(".").pop() : "";
    return name.slice(0, max - ext.length - 3) + "..." + ext;
  };

  return (
    <section className="enterprise-detail__section enterprise-documents">
      {documents.length ? (
        <ul className="enterprise-documents__list">
          {documents.map((doc, idx) => (
            <li
              key={idx}
              className="enterprise-documents__item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button
                type="button"
                className="enterprise-documents__button"
                onClick={() => handleOpen(doc)}
              >
                <span className="doc-name">
                  {truncateFilename(doc.original_name)}
                </span>
              </button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(doc)}
                title="Tải xuống tài liệu"
              >
                <FiDownload />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="enterprise-documents__empty">Không có</p>
      )}
    </section>
  );
};

export default DocumentSection;
