import React from "react";

export default function CardComponent({ children }: { children: React.ReactNode }) {
    return <div className="p-5 rounded-md bg-white mb-5">{children}</div>;
}
