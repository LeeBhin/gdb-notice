import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { getBoardPosts } from "../utils/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBoardPosts(currentPage, postsPerPage);

        const sortedPosts = data.posts.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setPosts(sortedPosts);
        setTotalPages(Math.ceil(data.totalCount / postsPerPage));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    <>
      <header className="bg-gray-800 text-white py-4 text-center font-bold text-2xl">
        GDB 게시판
      </header>

      <div className="pt-20 pb-10 w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-end mb-4">
          <Link to="/post">
            <button className="flex gap-2 items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <HiOutlinePencilAlt />
              작성하기
            </button>
          </Link>
        </div>

        <div className="space-y-4 h-auto min-h-[43rem] w-full">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Link to={`/detail/${post.id}`} key={index}>
                <div
                  key={index}
                  className="border p-4 rounded shadow-sm cursor-pointer hover:bg-sky-100 mb-5"
                >
                  <div className="font-semibold text-xl truncate">
                    {post.title}
                  </div>
                  <div className="text-gray-600 text-lg truncate">
                    {post.content.length > 30
                      ? post.content.slice(0, 30) + "..."
                      : post.content}
                  </div>
                  <div className="text-gray-400 text-sm mt-2 truncate">
                    {formatTime(post.createdAt)}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>게시물이 없습니다.</div>
          )}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`py-2 px-4 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
