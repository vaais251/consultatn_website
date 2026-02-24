"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-outline text-sm !py-2 !px-4"
        >
            Sign Out
        </button>
    );
}
