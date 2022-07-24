import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { addDoc, collection, doc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Textarea } from "../components/atomic";
import { db } from "../lib/firebase";
import { Question } from "../types";

async function postQuestion(question: Question) {
  if (!question.title) {
    throw new Error("Title is required");
  }
  return addDoc(collection(db, "questions"), question);
}
function CreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");

  const { mutate } = useMutation(postQuestion, {
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: async (doc) => {
      router.push(`/t/${doc.id}`);
    },
  });

  return (
    <>
      <div className="text-2xl">Create a Tally</div>
      <div className="h-8"></div>
      <div className="w-96 max-w-full">
        <div className="mb-1">Title</div>
        <Textarea minRows={1} className="w-full" onValueChange={setTitle} />
      </div>
      <div className="h-8"></div>

      <Button
        className="mx-auto"
        onClick={() => {
          mutate({
            title,
            descriptionHtml: "",
          });
        }}
      >
        Create
      </Button>
    </>
  );
}

export default CreatePage;
