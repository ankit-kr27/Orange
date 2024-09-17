import React from "react";
import { Spinner } from "@nextui-org/react"; // Assuming you're using NextUI Spinner

interface LoadingOverlayProps {
    loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 z-50 pointer-events-auto">
            <Spinner size="lg" className="z-50" />
        </div>
    );
};

export default LoadingOverlay;
