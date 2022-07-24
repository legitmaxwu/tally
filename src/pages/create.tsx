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
  const [description, setDescription] = useState("");

  const { mutate, isLoading } = useMutation(postQuestion, {
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
        <Input
          className="w-full"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        <div className="h-4"></div>
        <div className="mb-1">Description</div>
        <Textarea
          className="w-full"
          onValueChange={setDescription}
          value={description}
        />
      </div>
      <div className="h-8"></div>

      <Button
        loading={isLoading}
        className="mx-auto"
        onClick={() => {
          mutate({
            title,
            description,
          });
        }}
      >
        Create
      </Button>
    </>
  );
}

export default CreatePage;
