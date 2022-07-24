import { useMutation, useQuery } from "@tanstack/react-query";
import { format, formatRelative } from "date-fns";
import { ChevronUpIcon, DocumentIcon } from "@heroicons/react/solid";
import { DocumentAddIcon, MinusIcon } from "@heroicons/react/outline";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Textarea } from "../../components/atomic";
import { db } from "../../lib/firebase";
import { Answer, Question } from "../../types";
import clsx from "clsx";

type AnswerWithId = Answer & { id: string };

async function postAnswer(answer: Answer) {
  if (!answer.text) {
    throw new Error("Text is required");
  }
  return addDoc(collection(db, "answers"), answer);
}

type SortMode = "newest" | "upvotes";
interface SelectSortModeProps {
  selected: SortMode;
  onChange: (value: SortMode) => void;
}
function SelectSortMode(props: SelectSortModeProps) {
  const { selected, onChange } = props;
  return (
    <div className="flex gap-2 text-sm text-slate-600">
      <button
        className={selected === "newest" ? "underline" : ""}
        onClick={() => {
          onChange("newest");
        }}
      >
        New
      </button>
      <button
        className={selected === "upvotes" ? "underline" : ""}
        onClick={() => {
          onChange("upvotes");
        }}
      >
        Top
      </button>
    </div>
  );
}

async function toggleUpvote(answerId: string, currentUpvotes: number) {
  // Keep track of whether the user has upvoted or downvoted in localstorage
  const hasUpvoted = localStorage.getItem(`hasUpvoted-${answerId}`);
  const answerRef = doc(db, "answers", answerId);

  if (hasUpvoted === "true") {
    localStorage.setItem(`hasUpvoted-${answerId}`, "false");

    return updateDoc(answerRef, {
      upvotes: currentUpvotes - 1,
    });
  } else {
    localStorage.setItem(`hasUpvoted-${answerId}`, "true");

    return updateDoc(answerRef, {
      upvotes: currentUpvotes + 1,
    });
  }
}

function QuestionPage() {
  const router = useRouter();
  const questionId = (router.query.questionId as string) ?? "";
  const { data: tally } = useQuery<any, any, Question, any>(
    [questionId],
    async (data) => {
      return (await getDoc(doc(db, "questions", data.queryKey[0]))).data();
    }
  );

  const [answers, setAnswers] = useState<AnswerWithId[]>([]);
  useEffect(() => {
    const q = query(
      collection(db, "answers"),
      where("questionId", "==", questionId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAnswers((prevAnswers) => {
        snapshot.docChanges().forEach((change) => {
          const answerId = change.doc.id;
          const answer = change.doc.data() as Answer;
          const answerWithId = { ...answer, id: answerId };

          if (change.type === "added") {
            prevAnswers = [...prevAnswers, answerWithId];
          }
          if (change.type === "modified") {
            prevAnswers = prevAnswers.map((entry) => {
              if (entry.id === answerId) {
                return answerWithId;
              }
              return entry;
            });
          }
          if (change.type === "removed") {
            prevAnswers = prevAnswers.filter((entry) => entry.id !== answerId);
          }
        });
        return prevAnswers;
      });
    });
    return () => {
      unsubscribe();
    };
  }, [questionId]);

  const [newAnswer, setNewAnswer] = useState("");
  const { mutate: submitAnswer } = useMutation(postAnswer, {
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: async (doc) => {
      localStorage.setItem(`hasUpvoted-${doc.id}`, "true");
      localStorage.setItem(`posted-${doc.id}`, "true");
      toast.success("Answer submitted");

      setNewAnswer("");
      setShowSubmit(false);
    },
  });

  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const sortedAnswers = useMemo(() => {
    if (sortMode === "upvotes") {
      return answers.sort((a, b) => b.upvotes - a.upvotes);
    }
    return answers.sort((a, b) => b.timestamp - a.timestamp);
  }, [answers, sortMode]);

  const handleSubmitAnswer = useCallback(() => {
    submitAnswer({
      questionId,
      text: newAnswer,
      upvotes: 1,
      timestamp: Date.now(),
    });
  }, [newAnswer, questionId, submitAnswer]);

  const [showSubmit, setShowSubmit] = useState(false);

  return (
    <div className="w-120 max-w-full">
      <div className="h-16"></div>
      <div className="font-bold text-center text-3xl">{tally?.title}</div>
      <div className="h-8"></div>

      {showSubmit ? (
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => {
              setShowSubmit(false);
            }}
            className="text-sm text-center flex gap-1 items-center text-slate-600 font-semibold hover:underline"
          >
            - Hide
          </button>
          <Textarea
            placeholder="Enter response here..."
            className="w-full shrink-0"
            value={newAnswer}
            onValueChange={setNewAnswer}
          />
          <Button onClick={handleSubmitAnswer}>Submit</Button>
        </div>
      ) : (
        <button
          onClick={() => {
            setShowSubmit(true);
          }}
          className="text-sm text-center flex gap-1 items-center text-slate-600 font-semibold hover:underline"
        >
          + Submit a response
        </button>
      )}

      <div className="h-8"></div>
      <SelectSortMode selected={sortMode} onChange={setSortMode} />
      <div className="h-4"></div>

      {answers.length === 0 && (
        <div className="text-slate-400">
          No answers yet. Submit a response to appear here!
        </div>
      )}
      <div className="flex flex-col gap-2">
        {sortedAnswers?.map((answer, idx) => {
          const hasUpvoted =
            localStorage.getItem(`hasUpvoted-${answer.id}`) === "true";
          const isPoster =
            localStorage.getItem(`posted-${answer.id}`) === "true";

          const upvoteStyles = clsx({
            "bg-slate-100 self-stretch flex flex-col items-center font-bold pt-5":
              true,
            "text-green-400": hasUpvoted,
            "text-slate-400": !hasUpvoted,
          });

          const arrowStyles = clsx({
            "h-8 w-8 p-2 -m-2 cursor-pointer transition": true,
            "hover:text-green-300": hasUpvoted,
            "hover:text-slate-300": !hasUpvoted,
          });

          return (
            <div
              key={idx}
              className="flex items-center shadow-sm border border-slate-200"
            >
              <div className={upvoteStyles}>
                <ChevronUpIcon
                  onClick={() => {
                    toggleUpvote(answer.id, answer.upvotes);
                  }}
                  className={arrowStyles}
                />
                <div className="select-none">{answer.upvotes}</div>
                <div className="h-4 w-4 mx-2 pointer-events-none"></div>
              </div>

              <div className="p-4">
                <div className="whitespace-pre-line text-sm text-slate-800">
                  {answer.text}
                </div>
                <div className="h-2"></div>

                <div className="text-xs text-gray-400">
                  {formatRelative(new Date(answer.timestamp), new Date())}
                  {/* {format(new Date(answer.timestamp), "MMM dd, yyyy h:mm a")} */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionPage;
