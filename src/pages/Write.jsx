import React, { useState } from "react";
import { createBoardPost } from "../utils/api";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createBoardPost(title, content, password);
      setSuccess("게시물이 성공적으로 작성되었습니다!");
      setTitle("");
      setContent("");
      setPassword("");
    } catch (err) {
      setError("게시물 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-gray-800 text-white py-4 text-center font-bold text-2xl">
        <Link to="/">
          <FaArrowLeftLong className="absolute left-10" />
        </Link>
        게시물 작성
      </header>
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border w-full mb-40">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mt-1 p-2 w-full h-48 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 text-white rounded-md ${
                  loading ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {loading ? "작성 중..." : "게시물 작성"}
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mt-4">{success}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WritePage;
