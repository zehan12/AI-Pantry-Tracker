import React from "react";
import { Button } from "../ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handleClick = (page: number) => {
        console.log(page,"clicked",totalPages)
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center mt-4 gap-5">
            <Button
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
            >
                Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
                <Button
                    key={index}
                    onClick={() => handleClick(index + 1)}
                    className={`px-4 py-2 border ${
                        currentPage === index + 1
                            ? "bg-background text-foreground"
                            : "bg-gray-200 text-gray-600"
                    }`}
                >
                    {index + 1}
                </Button>
            ))}
            <Button
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
