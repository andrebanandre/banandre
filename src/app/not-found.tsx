import { NotFoundContent } from "./_components/not-found-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Banandre",
  description: "You've slipped on a bad link. This page does not exist.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
