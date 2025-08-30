import Pagination from "./Pagination";
import PageSizeElements from "./PageSizeElements";

interface FooterPaginationProps {
    currentPage: number
    totalPages: number
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    onPageChange: (page: number) => void
}

const FooterPagination: React.FC<FooterPaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange
}) => {
    return (
        <div className="flex flex-col md:flex-row flex-nowrap justify-between items-center space-y-2 w-full">
            <PageSizeElements
                key={"totalElementos"}
                pageSize={pageSize}
                onPageSizeChange={(size) => onPageSizeChange(size)}
            />
            <Pagination
                key={"paginacion"}
                currentPage={currentPage ?? 0}
                totalPages={totalPages ?? 0}
                onPageChange={(page) => onPageChange(page)}
            />
        </div>
    )
}

export default FooterPagination
