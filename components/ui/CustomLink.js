import React from "react";
import Link from "next/link";

const CustomLink = React.forwardRef(({ to, ...props }, ref) => {
    return (
        <Link href={to}>
            <a ref={ref} {...props} />;
        </Link>
    );
});

export default CustomLink;
