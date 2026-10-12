import { DOMAIN } from "@/utils/constant";

export async function getComments() {
  try {
    const response = await fetch(`${DOMAIN}/api/coments`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return []; // إرجاع مصفوفة فارغة بدلاً من رمي خطأ يُسقط الصفحة
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; // إرجاع مصفوفة فارغة عند حدوث خطأ في الشبكة
  }
}

// اعدادات اضافة البوست
interface addCommentData {
content:string
}
// دالة اضافة البوست
export async function addComment(comment: { content: string }) {
    const response = await fetch(`${DOMAIN}/api/coments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to add comment");
    }

    return result;
}

interface editCommentData {
content?:string
}
export async function editComment(comment : editCommentData , id :string) {
    //  ارسال المعلومات الى الباك (response واستلام request ارسال)
    try {
        const response = await fetch(DOMAIN + "/api/coments/" + id , {
            method:"PUT",
            body: JSON.stringify(comment),
            headers: {
        "Content-Type": "application/json",
        },
        })
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Failed to edit comment.")
        }

        return data

        // اذا يوجد خطأ يعيده
    } catch (error : any) {
        throw new Error (error)
    }
}

export async function deleteComment(id : string) {
    try {
        const response = await fetch(DOMAIN + "/api/coments/" + id , {
            method : "DELETE"
        })
        const result = await response.json();

if (!response.ok) {
    throw new Error(result.message || "Failed to delete comment");
}
        return result
    } catch (error : any) {
        throw new Error (error)
    }
}


export async function getReplies(comentId: string) {
    const response = await fetch(
        `${DOMAIN}/api/coments/${comentId}/replies`,
        { cache: "no-store" }
    );

    const result = await response.json();

    if (!response.ok) {
        console.error("Get replies API error:", result);
        throw new Error(result.message || "Failed to load replies");
    }

    return result;
}

// اعدادات اضافة البوست
interface addReplyData {
content:string
}
// دالة اضافة البوست
export async function addReply(coment: addReplyData, comentId: string) {
    try {
        const response = await fetch(
            `${DOMAIN}/api/coments/${comentId}/replies`,
            {
                method: "POST",
                body: JSON.stringify(coment),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add reply.");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Something went wrong.");
    }
}

interface editReplyData {
content?:string
}
export async function editReply(reply: addReplyData,comentId: string,replyId: string) {
    const response = await fetch(
        `${DOMAIN}/api/coments/${comentId}/replies/${replyId}`,
        {
            method: "PUT",
            body: JSON.stringify(reply),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to edit reply");
    }

    return result;
}

export async function deleteReply(comentId: string, replyId: string) {
    try {
        const response = await fetch(`${DOMAIN}/api/coments/${comentId}/replies/${replyId}`, {
            method : "DELETE"
        })
        return response.json()
    } catch (error : any) {
        throw new Error (error)
    }
}

// دالة إضافة التصويت
export async function addVote(comentId: number) {
    try {
    const response = await fetch(`${DOMAIN}/api/coments/${comentId}/vote`, {
        method: "POST",
        }
    );

    return response.json();
    } catch (error: any) {
        throw new Error(error);
    }
}

// دالة حذف التصويت
export async function deleteVote(comentId: number) {
    try {
        const response = await fetch(
        `${DOMAIN}/api/coments/${comentId}/vote`,
        {
            method: "DELETE",
        }
        );

        return response.json();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getVote(comentId: number) {
    try {
        const response = await fetch(`${DOMAIN}/api/coments/${comentId}/vote`, {
                cache: "no-store"
            }
        );

        return response.json();
    } catch (error: any) {
        throw new Error(error);
    }
}

// إضافة Vote للـ Reply
export async function addReplyVote(comentId: number, replyId: number) {
    try {
        const response = await fetch(
            `${DOMAIN}/api/coments/${comentId}/replies/${replyId}/vote`,
            {
                method: "POST",
            }
        );

        return response.json();
    } catch (error: any) {
        throw new Error(error);
    }
}

// حذف Vote من الـ Reply
export async function deleteReplyVote(comentId: number, replyId: number) {
    try {
        const response = await fetch(
            `${DOMAIN}/api/coments/${comentId}/replies/${replyId}/vote`,
            {
                method: "DELETE",
            }
        );

        return response.json();
    } catch (error: any) {
        throw new Error(error);
    }
}

// معرفة هل المستخدم الحالي صوّت على الـ Reply
export async function getReplyVote(comentId: number, replyId: number) {
    try {
        const response = await fetch(
            `${DOMAIN}/api/coments/${comentId}/replies/${replyId}/vote`,
            {
                cache: "no-store",
            }
        );

        return response.json();
    } catch (error: any) {
        throw new Error(error);
    }
}