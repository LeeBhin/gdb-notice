import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createCommentToPost,
  createReply,
  deleteComment,
  deletePost,
  getBoardPostById,
  getComments,
} from "../utils/api";
import { LuSend } from "react-icons/lu";
import { PiArrowElbowDownRight } from "react-icons/pi";
import { useNavigate } from "react-router";

const Detail = () => {
  const { postId } = useParams();
  const [detail, setDetail] = useState();
  const [comments, setComments] = useState();
  const [content, setContent] = useState();
  const [password, setPassword] = useState();
  const [replyTo, setReplyTo] = useState(null);
  const [borderClass, setBorderClass] = useState("border-gray-300");
  const navigate = useNavigate();
  const focusRef = useRef();

  useEffect(() => {
    if (replyTo) {
      setBorderClass("border-2 border-blue-500");

      const timeout = setTimeout(() => {
        setBorderClass("border-gray-300");
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      setBorderClass("border-gray-300");
    }
  }, [replyTo]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBoardPostById(postId);
        setDetail(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [postId]);

  const getchComments = useCallback(async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [postId]);

  useEffect(() => {
    getchComments();
  }, [getchComments]);

  const formatDate = (isoDate) => {
    if (!isoDate) return;
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(
      date
    );
    return formattedDate.replace(
      /(\d{4})\/(\d{2})\/(\d{2}), (\w+) (\d{1,2}):(\d{2})/,
      "$1. $2. $3. $4 $5:$6"
    );
  };

  const handleDeleteComment = async (commentId) => {
    const passwordInput = prompt("비밀번호를 입력해주세요");
    if (passwordInput) {
      try {
        const result = await deleteComment(commentId, passwordInput);
        const updatedComments = await getComments(postId);
        setComments(updatedComments);
        alert(result);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("비밀번호가 입력되지 않았습니다.");
    }
  };

  const handleDeletePost = async () => {
    const passwordInput = prompt("비밀번호를 입력해주세요");
    if (passwordInput) {
      try {
        const result = await deletePost(postId, passwordInput);
        alert(result);
        navigate("/");
      } catch (error) {
        alert(error);
      }
    } else {
      alert("비밀번호가 입력되지 않았습니다.");
    }
  };

  const handleReply = (comment) => {
    setReplyTo(replyTo?.id === comment.id ? null : comment);
    focusRef.current.focus();
  };

  const renderComment = (comment) => {
    return (
      <div key={comment.id} style={{ marginLeft: `${comment.depth * 25}px` }}>
        <div className={`mt-2 p-3 border border-gray-300 rounded-md`}>
          <div className="flex flex-col md:flex-row md:justify-between gap-2">
            <div className="flex gap-2">
              {comment.reply && (
                <PiArrowElbowDownRight className="text-xl flex-shrink-0" />
              )}
              <div className="break-all truncate max-w-40 text-gray-300">
                {comment.replyTo}
              </div>
              <div className="break-all">{comment.content}</div>
            </div>
            <div
              className="text-gray-400 text-sm md:text-base whitespace-nowrap"
              title={formatDate(comment.createdAt)}
            >
              {formatTime(comment.createdAt)}
            </div>
          </div>

          <div className="flex justify-between mt-3">
            <div
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => handleReply(comment)}
            >
              {replyTo?.id === comment.id ? "취소" : "답글"}
            </div>
            <div
              className="text-red-400 cursor-pointer hover:underline"
              onClick={() => handleDeleteComment(comment.id)}
            >
              삭제
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 86400) {
      if (diffInSeconds < 60) {
        return `${diffInSeconds}초 전`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}분 전`;
      } else {
        return `${Math.floor(diffInSeconds / 3600)}시간 전`;
      }
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "오후" : "오전";
      const hour = hours % 12 || 12;
      return `어제 ${period} ${hour}시 ${minutes}분`;
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const hour = hours % 12 || 12;

    return `${year}.${month}.${day}. ${period} ${hour}시 ${minutes}분`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white py-4 text-center font-bold text-xl md:text-2xl relative">
        <Link
          to="/"
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <FaArrowLeftLong className="text-lg md:text-xl" />
        </Link>
        GDB 게시판
      </header>

      <div className="flex-1 px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border w-full relative">
          <div
            className="float-right m-3 text-red-400 cursor-pointer hover:bg-red-400 hover:text-white p-1 rounded-md duration-150 absolute right-0"
            onClick={() => handleDeletePost(postId)}
          >
            게시물 삭제
          </div>
          <div className="p-4 md:p-6 mt-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="font-medium text-xl md:text-2xl break-all">
                {detail?.title}
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                {formatDate(detail?.createdAt)}
              </div>
            </div>

            <div className="mt-4">
              <div className="p-3 h-48 border border-gray-300 rounded-md overflow-auto break-all">
                {detail?.content}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg md:text-xl mb-3">댓글</h2>
              <div className="overflow-y-auto max-h-[calc(100vh-32rem)] md:max-h-[30rem] p-2">
                {comments?.map((comment) => renderComment(comment))}
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (replyTo) {
                      await createReply(
                        replyTo.id,
                        content,
                        password,
                        replyTo.content
                      );
                    } else {
                      await createCommentToPost(postId, content, password);
                    }

                    await getchComments();
                    setContent("");
                    setPassword("");
                    setReplyTo(null);
                  } catch (error) {
                    console.error(
                      "Error creating comment or fetching comments:",
                      error
                    );
                  }
                }}
                className="mt-6 space-y-2"
              >
                <div
                  className={`p-2 border rounded-md flex items-center gap-2 transition-all duration-800 ${borderClass}`}
                >
                  <input
                    ref={focusRef}
                    placeholder={
                      replyTo
                        ? `${replyTo.content.slice(0, 10)}에 답글 입력...`
                        : "댓글 입력..."
                    }
                    className="flex-1 outline-none min-w-0"
                    value={content}
                    required
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <button type="submit" className="text-blue-500 p-2">
                    <LuSend />
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="비밀번호..."
                  className="w-full outline-none p-2 border border-gray-300 rounded-md"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
