import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageContentProps = {
    children?: ReactNode
    contentStyles?: string
}

const PageContent: React.FC<PageContentProps> = ({
    children,
    contentStyles = ''
}) => {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className={`min-full mx-auto px-3 py-2 space-y-4 ${contentStyles}`}
        >
            {children || <Outlet />}
        </motion.div>
    );

};

export default PageContent;