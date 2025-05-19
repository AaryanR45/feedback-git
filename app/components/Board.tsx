import { useEffect, useRef, useState } from "react";
import Feedbackitem from "@/app/components/Feedbackitem";
import FeedbackFormPopup from "@/app/components/FeedbackFormPopup";
import Button from "@/app/components/Button";
import FeedbackItemPopup from "@/app/components/FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";
import Search from "@/app/components/icons/Search";
import Filter from "@/app/components/icons/Filter";
import { debounce } from "lodash";

interface User {
  email: string;
  name?: string;
}

interface Feedback {
  _id: string;
  title: string;
  description: string;
  image?: string;
  user?: User;
}

interface Vote {
  feedbackId: string;
  userEmail: string;
}

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] =
    useState<Feedback | null>(null);
  const fetchingFeedbacks = useRef(false);
  const waitingRef = useRef(false);
  const [waiting, setWaiting] = useState(false);
  const [sort, setSort] = useState("votes");
  const sortRef = useRef("votes");
  const loadedRows = useRef(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [votesData, setVotesData] = useState<Vote[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const everythingLoadedRef = useRef(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const searchPhraseRef = useRef("");
  const debouncedFetchFeedbacksRef = useRef(debounce(fetchFeedbacks, 300));

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      fetchVotes();
    }
  }, [feedbacks]);

  useEffect(() => {
    loadedRows.current = 0;
    sortRef.current = sort;
    searchPhraseRef.current = searchPhrase;
    everythingLoadedRef.current = false;
    if (feedbacks?.length > 0) {
      setFeedbacks([]);
    }
    setWaiting(true);
    waitingRef.current = true;
    debouncedFetchFeedbacksRef.current();
  }, [sort, searchPhrase]);

  useEffect(() => {
    if (session?.user?.email) {
      const feedbackToVote = localStorage.getItem("vote_after_login");
      if (feedbackToVote) {
        axios.post("/api/vote", { feedbackId: feedbackToVote }).then(() => {
          localStorage.removeItem("vote_after_login");
          fetchVotes();
        });
      }
      const feedbackToPost = localStorage.getItem("post_after_login");
      if (feedbackToPost) {
        const feedbackData = JSON.parse(feedbackToPost);
        axios
          .post<Feedback>("/api/feedback", feedbackData)
          .then(async (res) => {
            await fetchFeedbacks();
            setShowFeedbackPopupItem(res.data);
            localStorage.removeItem("post_after_login");
          });
      }
      const commentToPost = localStorage.getItem("comment_after_login");
      if (commentToPost) {
        const commentData = JSON.parse(commentToPost);
        axios.post("/api/comment", commentData).then(() => {
          axios
            .get<Feedback>("/api/feedback?id=" + commentData.feedbackId)
            .then((res) => {
              setShowFeedbackPopupItem(res.data);
              localStorage.removeItem("comment_after_login");
            });
        });
      }
    }
  }, [session?.user?.email]);

  function handleScroll() {
    const html = window.document.querySelector("html");
    if (!html) return;
    const howMuchScrolled = html?.scrollTop;
    const howMuchIsToScroll = html?.scrollHeight;
    const leftToScroll =
      howMuchIsToScroll - howMuchScrolled - html?.clientHeight;
    if (leftToScroll <= 100) {
      fetchFeedbacks(true);
    }
  }
  function registerScrollListener() {
    window.addEventListener("scroll", handleScroll);
  }
  function unregisterScrollListener() {
    window.removeEventListener("scroll", handleScroll);
  }
  useEffect(() => {
    registerScrollListener();
    return () => {
      unregisterScrollListener();
    };
  }, []);

  async function fetchFeedbacks(append = false) {
    if (fetchingFeedbacks.current || loading) return;
    if (everythingLoadedRef.current) return;
    fetchingFeedbacks.current = true;
    setLoading(true);

    const res = await axios.get<Feedback[]>(
      `/api/feedback?sort=${sortRef.current}&loadedRows=${loadedRows.current}&search=${searchPhraseRef.current}`
    );

    if (append) {
      setFeedbacks((currentFeedbacks) => {
        const existingIds = new Set(currentFeedbacks.map((f) => f._id));
        const newFeedbacks = res.data.filter((f) => !existingIds.has(f._id));
        return [...currentFeedbacks, ...newFeedbacks];
      });
    } else {
      setFeedbacks(res.data);
    }

    if (res.data?.length > 0) {
      loadedRows.current += res.data.length;
    }
    if (res.data?.length === 0) {
      everythingLoadedRef.current = true;
    }
    fetchingFeedbacks.current = false;
    setLoading(false);
    waitingRef.current = false;
    setWaiting(false);
  }

  function fetchVotes() {
    if (feedbacks.length === 0) return;
    const ids = feedbacks.map((f) => f._id);
    axios.get<Vote[]>("/api/vote?feedbackIds=" + ids.join(",")).then((res) => {
      setVotesData(res.data);
    });
  }

  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback: Feedback) {
    setShowFeedbackPopupItem(feedback);
  }

  const handleFeedbackItemUpdate = (updatedItemData: Feedback) => {
    setFeedbacks((currentFeedbacks) =>
      currentFeedbacks.map((item) =>
        item._id === updatedItemData._id
          ? { ...item, ...updatedItemData }
          : item
      )
    );
    if (
      showFeedbackPopupItem &&
      showFeedbackPopupItem._id === updatedItemData._id
    ) {
      setShowFeedbackPopupItem((prevItem) =>
        prevItem ? { ...prevItem, ...updatedItemData } : null
      );
    }
    console.log("Feedback updated locally (from Board.tsx):", updatedItemData);
  };

  const getVotesForFeedback = (feedbackId: string): Vote[] => {
    return votesData.filter((vote) => vote.feedbackId === feedbackId);
  };

  function handleDeleteFeedback(id: string) {
  setFeedbacks((prev) => prev.filter((item) => item._id !== id));
}


  return (
    <main className="bg-white max-w-4xl mx-auto shadow-lg rounded-lg mt-4 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <h1
          className="font-bold text-xl cursor-pointer"
          onClick={() => {
            setSort("votes");
            setSearchPhrase("");
            loadedRows.current = 0;
            everythingLoadedRef.current = false;
            setFeedbacks([]);
            debouncedFetchFeedbacksRef.current();
          }}
        >
          Feedboard
        </h1>
        <p className="text-white text-opacity-80">
          A portal where you can submit feedbacks and ideas for the products.
        </p>
      </div>

      <div className="bg-gray-100 px-8 py-4 flex border-b items-center">
        <div className="grow flex items-center gap-4 text-gray-600">
          <Filter className="w-5 h-5" />
          <select
            value={sort}
            onChange={(ev) => {
              setSort(ev.target.value);
            }}
            className="bg-transparent py-2 "
          >
            <option value="votes">Most Voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className="relative">
            <Search className="w-5 h-5 absolute top-3 left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={searchPhrase}
              onChange={(ev) => setSearchPhrase(ev.target.value)}
              className="bg-transparent p-2 pl-8"
            />
          </div>
        </div>
        <div>
          <Button primary onClick={openFeedbackPopupForm} disabled={false}>
            Make a suggestion
          </Button>
        </div>
      </div>

      <div className="px-8">
        {feedbacks?.length === 0 && !loading && !waiting && searchPhrase !== '' && (
          <div className="py-8 text-4xl text-gray-500">Result Not Found :(</div>
        )}
        {feedbacks.map((feedback) => (
          <Feedbackitem
            key={feedback._id}
            _id={feedback._id}
            title={feedback.title}
            description={feedback.description}
            votes={getVotesForFeedback(feedback._id)}
            onOpen={() => openFeedbackPopupItem(feedback)}
            onVotesChange={fetchVotes}
            image={feedback.image}
            onDelete={handleDeleteFeedback}
          />
        ))}
        {(loading || waiting) && (
          <div className="p-4">
            <div className="loader mx-auto"></div>
          </div>
        )}
      </div>

      {showFeedbackPopupForm && (
        <FeedbackFormPopup
          onCreate={() => {
            fetchFeedbacks();
          }}
          setShow={setShowFeedbackPopupForm}
        />
      )}

      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          key={showFeedbackPopupItem._id}
          _id={showFeedbackPopupItem._id}
          title={showFeedbackPopupItem.title}
          description={showFeedbackPopupItem.description}
          image={showFeedbackPopupItem.image}
          user={showFeedbackPopupItem.user}
          votes={getVotesForFeedback(showFeedbackPopupItem._id)}
          setShow={() => setShowFeedbackPopupItem(null)}
          onVotesChange={fetchVotes}
          onUpdateFeedback={handleFeedbackItemUpdate}
        />
      )}

      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #3b82f6;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
