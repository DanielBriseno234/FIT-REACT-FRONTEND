import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    containerStyles?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    action,
    containerStyles = "",
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 ${containerStyles}`}
        >
            <div className="block md:flex md:justify-between md:items-center">
                <div className="w-full mb-4 md:mb-0 md:flex-3/4">
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    {description && (
                        <p className="text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                {action && (
                    <div className="w-full flex justify-end  md:flex-1/4">
                        {action}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PageHeader;
