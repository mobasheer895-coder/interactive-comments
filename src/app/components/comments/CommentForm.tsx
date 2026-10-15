"use client";
import { FormEvent, useState } from "react";

interface CommentFormProps {
    initialContent?: string
    submitText: string
    placeholder : string
    onSubmit : (content: string) => Promise<void>
    onSuccess?: () => void
}

const CommentForm = ({initialContent = "", submitText , placeholder , onSuccess , onSubmit}: CommentFormProps) => {
    // ادارة حالة النص المدخل 
    const [content, setContent] = useState(initialContent);
    // ادارة الحالة اثناء ارسال البيانات
    const [loading, setLoading] = useState(false);
    // ادارة حالة وجود خطأ
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        // منع تحديث الصفحة
        event.preventDefault();
        // التحقق من وجود محتوى قبل الإرسال
        if (!content.trim()) return;

        try {
            // تفعيل حالة التحميل أثناء تنفيذ العملية
            setLoading(true);
            // مسح الخطأ السابق
            setError("");
            // إرسال المحتوى وتنفيذ العملية
            await onSubmit(content);
            // تفريغ محتوى النموذج بعد نجاح العملية
            setContent("");
            // استدعاء الدالة التي يمررها المكوّن بعد نجاح العملية
            onSuccess?.();
            // حفظ رسالة الخطأ لعرضها للمستخدم
        } catch (error) {
            setError((error as Error).message);
            // إنهاء حالة التحميل بعد انتهاء العملية
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                // تحديث المحتوى عند الكتابة
                onChange={(event) => setContent(event.target.value)}
                placeholder={placeholder}
            />
            {/* عرض رسالة الخطأ عند وجودها */}
            {error && <p>{error}</p>}

            <button type="submit"
            // منع إرسال النموذج أثناء تنفيذ العملية
            disabled={loading} className="hover:bg-blue-600 hover:text-white p-2 rounded-xl cursor-pointer bg-blue-400 transition-all">
                {/* عرض حالة التحميل أو نص الزر */}
                {loading ? "Loading..." : submitText}
            </button>
        </form>
    );
};

export default CommentForm;