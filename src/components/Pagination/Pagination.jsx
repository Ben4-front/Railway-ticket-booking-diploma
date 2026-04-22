import React from 'react';
import { useDispatch } from 'react-redux';
import { setOffset } from '../../store/slices/routesSlice';
import './Pagination.css'; // Создайте этот файл

export default function Pagination({ total, limit, currentOffset }) {
    const dispatch = useDispatch();
    const pageCount = Math.ceil(total / limit);
    const currentPage = Math.floor(currentOffset / limit) + 1;

    if (pageCount <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        const newOffset = (page - 1) * limit;
        dispatch(setOffset(newOffset));
    };

    return (
        <div className="pagination">
            {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)}>
                    &lt;
                </button>
            )}
            <span>
                {currentPage} из {pageCount}
            </span>
            {currentPage < pageCount && (
                <button onClick={() => handlePageChange(currentPage + 1)}>
                    &gt;
                </button>
            )}
        </div>
    );
}