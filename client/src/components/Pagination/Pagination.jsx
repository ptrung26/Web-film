import React from "react";
import "./Pagination.scss";
function Pagination({ currentPage, pageCount, maxDisplayPages, onPageChange }) {
  if (pageCount === null || pageCount === undefined) {
    return;
  }

  pageCount = Math.min(100, pageCount);

  const halfMaxPages = Math.floor(maxDisplayPages / 2);
  let startPage = currentPage - halfMaxPages;
  let endPage = currentPage + halfMaxPages;
  if (startPage < 1) {
    startPage = 1;
  }
  if (endPage > pageCount) {
    endPage = pageCount;
  }

  const pages = [];
  if (startPage !== 1) {
    pages.push(1);
    pages.push("...");
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage !== startPage && endPage !== pageCount) {
    pages.push("...");
    pages.push(pageCount);
  }

  return (
    <ul className="pagination">
      {pages.map((page, index) => (
        <li
          key={index}
          className={`pagination__item ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </li>
      ))}
    </ul>
  );
}

export default Pagination;
