import React from "react";

export default function CardComponent({ children }: { children: React.ReactNode }) {
    return <div className="px-5 py-4 rounded-md bg-white">{children}</div>;
}
