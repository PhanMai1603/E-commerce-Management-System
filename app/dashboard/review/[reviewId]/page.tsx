/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReviewDetail, replyReview } from "@/app/api/review";
import { ReviewDataResponse } from "@/interface/review";
import { toast } from "react-toastify";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ReviewDetailPage() {
  const params = useParams();
  const rawReviewId = Array.isArray(params.reviewId)
    ? params.reviewId[0]
    : params.reviewId;

  const [reviewId, setReviewId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [review, setReview] = useState<ReviewDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId") || "");
      setAccessToken(localStorage.getItem("accessToken") || "");
    }
    setReviewId(rawReviewId ?? null);
  }, [rawReviewId]);

  const fetchReview = async () => {
    if (!reviewId || !userId || !accessToken) return;
    setLoading(true);
    try {
      const data = await getReviewDetail(reviewId, userId, accessToken);
      setReview(data);
    } catch (error) {
      toast.error("Unable to load review details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [reviewId, userId, accessToken]);

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.warning("Please enter feedback.");
      return;
    }
    if (!reviewId || !userId || !accessToken) return;

    setSubmitting(true);
    try {
      await replyReview(reviewId, userId, accessToken, replyContent.trim());
      toast.success("Reply sent successfully!");
      setReplyContent("");
      fetchReview();
    } catch (error) {
      // handled in replyReview
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Detail Review</h1>
      {review && (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border shadow hover:scale-105 transition-transform">
                <Image
                  src={review.user.avatar}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="font-semibold text-lg">{review.user.name}</div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(Math.max(0, Math.floor(Number(review.star) || 0)))].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatDateTime(review.createdAt)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="ml-[56px] space-y-5">
              <p className="text-base leading-relaxed">{review.content}</p>

              {review.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Review Image ${i + 1}`}
                      className="w-32 h-24 object-cover rounded-lg border shadow-sm"
                    />
                  ))}
                </div>
              )}

              {review.reply ? (
                <div className="bg-gray-50 border-l-4 p-4 rounded-md">
                  <div className="flex items-start">
                    <Image
                      src={review.reply.user.avatar}
                      alt={review.reply.user.name}
                      width={40}
                      height={40}
                      className="rounded-full border shadow hover:scale-105 transition-transform"
                    />
                    <div className="ml-3">
                      <div className="text-sm text-muted-foreground">{review.reply.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(review.reply.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-base">{review.reply.content}</div>
                </div>
              ) : (
                <div>
                  <Textarea
                    placeholder="Enter feedback from administrator..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <Button className="mt-2" onClick={handleReply} disabled={submitting}>
                    {submitting ? "SENDING..." : "SEND"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-6">
        <Button onClick={() => router.push("/dashboard/review")}>Back</Button>
      </div>
    </div>
  );
}
