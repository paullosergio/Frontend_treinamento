"use client";

import Link from "next/link";

const MenuItem = ({ name, path }) => {
  return (
    <li className="my-2">
      <Link
        href={path}
        className="flex items-center px-6 py-3 text-white hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 mx-2"
      >
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </span>
      </Link>
    </li>
  );
};

export default MenuItem;
