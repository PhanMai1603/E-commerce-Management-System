/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReviewDetail, replyReview } from "@/app/api/review";
import { uploadReviewImage } from "@/app/api/upload"; // Đảm bảo import đúng
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

  // State cho ảnh phản hồi
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImageUrl, setReplyImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
      toast.error("Không thể tải đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId, userId, accessToken]);

  // Hàm upload ảnh phản hồi
  const handleUploadImage = async () => {
    if (!replyImage) {
      toast.warning("Vui lòng chọn ảnh để upload.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadReviewImage(replyImage, userId, accessToken);
      setReplyImageUrl(url);
      toast.success("Upload ảnh thành công!");
    } catch {
      // lỗi đã được toast ở API
    } finally {
      setUploading(false);
    }
  };

  // Hàm gửi phản hồi (có thể kèm ảnh)
  const handleReply = async () => {
    if (!replyContent.trim() && !replyImageUrl) {
      toast.warning("Vui lòng nhập phản hồi hoặc gửi ảnh.");
      return;
    }
    if (!reviewId || !userId || !accessToken) return;
    setSubmitting(true);
    try {
      let contentToSend = replyContent.trim();
      // Thêm ảnh vào nội dung (có thể sửa backend để nhận trường imageUrl riêng)
      if (replyImageUrl) {
        contentToSend += `<br/><img src="${replyImageUrl}" alt="Ảnh phản hồi" style="max-width:200px;border-radius:8px;margin-top:4px"/>`;
      }
      await replyReview(reviewId, userId, accessToken, contentToSend);
      toast.success("Đã gửi phản hồi thành công!");
      setReplyContent("");
      setReplyImage(null);
      setReplyImageUrl(null);
      fetchReview();
    } catch (error) {
      // lỗi đã được toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chi tiết đánh giá</h1>
      {review && (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border shadow hover:scale-105 transition-transform">
                <Image
                  src={review.user?.avatar || "/avatar.png"}
                  alt={review.user?.name || "Người dùng"}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-800">
                  {review.user?.name || "Ẩn danh"}
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(Math.floor(Number(review.star) || 0))].map((_, i) => (
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

              {review.reply?.user ? (
                <div className="bg-gray-50 border-l-4 p-4 rounded-md">
                  <div className="flex items-start">
                    <Image
                      src={review.reply.user.avatar || "/default-avatar.png"}
                      alt={review.reply.user.name || "Admin"}
                      width={40}
                      height={40}
                      className="rounded-full border shadow hover:scale-105 transition-transform"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-800">
                        {review.reply.user.name || "Admin"}
                      </div>
                      <div className="mt-2 text-base text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: review.reply.content }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Textarea
                    placeholder="Nhập phản hồi từ quản trị viên..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  {/* Upload ảnh */}
<div className="flex items-center gap-2 mt-2">
  <input
    type="file"
    accept="image/*"
    disabled={uploading}
    onChange={async e => {
      const file = e.target.files?.[0] || null;
      setReplyImage(file);
      setReplyImageUrl(null);
      if (file) {
        setUploading(true);
        try {
          const url = await uploadReviewImage(file, userId, accessToken);
          setReplyImageUrl(url);
          toast.success("Upload ảnh thành công!");
        } catch {
          // lỗi đã được toast ở API
        } finally {
          setUploading(false);
        }
      }
    }}
  />
  {uploading && (
    <span className="text-sm text-gray-400">Đang upload...</span>
  )}
  {/* Hiện ảnh đã upload */}
  {replyImageUrl && (
    <img
      src={replyImageUrl}
      alt="Ảnh phản hồi"
      className="w-14 h-14 rounded border ml-2"
    />
  )}
</div>

                  <Button className="mt-2" onClick={handleReply} disabled={submitting}>
                    {submitting ? "ĐANG GỬI..." : "GỬI"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-6">
        <Button onClick={() => router.push("/dashboard/review")}>Quay lại</Button>
      </div>
    </div>
  );
}
