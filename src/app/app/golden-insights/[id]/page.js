"use client";
import GoldenInsightDetail from "@/components/GoldenInsightDetail";
import { getPollById } from "@/services/polls/polls";
import { useEffect, useState } from "react";

export default function GoldenInsightDetailPage({ params, data }) {
  const [id, setId] = useState(-1);
  const [poll, setPoll] = useState(null);

  const loadPoll = async () => {
    await getPollById(id)
    .then((receivedPoll) => {
      let article = receivedPoll.golden_insights[0];
      let selectedOptions = receivedPoll.questions.map((q) =>
        q.users
          ? q.users.findIndex((u) => u === auth.currentUser.uid) >= 0
            ? 1
            : -1
          : -1
      );

      let voted = receivedPoll.questions.map((q) => -1);
      setPoll({
        ...receivedPoll,
        createdAt: receivedPoll.createdAt?.seconds,
        article,
        selectedOptions,
        voted
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (params) {
      setId(params.id);
    }
    else {
      setId(data.id);
    }
  }, []);

  useEffect(() => {
    if (id !== -1) {
      loadPoll();
    }
  }, [id]);
  
  if (id == -1 || !poll) {
    return <></>;
  }

  return (
    <GoldenInsightDetail
      id={id}
      article={poll.article}
      poll={poll}
      selectedOptions={poll.selectedOptions}
      voted={poll.voted}
      back={data?.back}
    />
  );
}
