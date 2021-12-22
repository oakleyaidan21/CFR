import { useEffect, useState } from "react";
import { Comment, Listing } from "snoowrap";

const usePostComments = (initialData: Listing<Comment>) => {
  const [comments, setComments] = useState<Listing<Comment> | null>(null);
  const [fetchingComments, setFetchingComments] = useState<boolean>(false);

  const getComments = async () => {
    setFetchingComments(true);
    try {
      const commentList = comments ? comments : initialData;
      const c = await (commentList as any).fetchMore({
        amount: 10,
        append: true,
      });
      setComments(c);
      setFetchingComments(false);
    } catch (error) {
      console.log("Error getting comments:", error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return { comments, getComments, fetchingComments };
};

export default usePostComments;
