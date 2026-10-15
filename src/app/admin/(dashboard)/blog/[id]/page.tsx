"use client";

import { useParams } from "next/navigation";
import BlogPostEditor from "@/components/admin/BlogPostEditor";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  return <BlogPostEditor postId={params.id} />;
}
