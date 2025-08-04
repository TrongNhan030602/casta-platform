import React from "react";
import { Row, Col } from "react-bootstrap";

import CommonFilterBar from "@/components/common/FilterBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import ExhibitionSpaceCard from "../ExhibitionSpaceCard";

export const renderSpacesTab = ({
  filters,
  filterFields,
  onFilterChange,
  spaces,
  page,
  totalPages,
  totalItems,
  loading,
  getStatusForSpace,
  setSelectedSpace,
  onPageChange,
}) => (
  <>
    <CommonFilterBar
      filters={filters}
      onChange={onFilterChange}
      fields={filterFields}
    />
    <div className="text-muted mb-3">
      Tìm thấy <strong>{totalItems}</strong> không gian
    </div>

    {loading ? (
      <div className="text-center py-5">
        <LoadingSpinner text="Đang tải dữ liệu" />
      </div>
    ) : (
      <>
        <Row className="g-4">
          {spaces.length ? (
            spaces.map((space) => (
              <Col
                md={4}
                key={space.id}
              >
                <ExhibitionSpaceCard
                  space={space}
                  contractStatus={getStatusForSpace(space.id)}
                  onRegister={() => setSelectedSpace(space)}
                />
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">
              Không tìm thấy không gian nào.
            </p>
          )}
        </Row>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </>
    )}
  </>
);
