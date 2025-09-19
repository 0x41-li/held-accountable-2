import GoldenInsightDetail from "@/components/GoldenInsightDetail";
import { getPollById } from "@/services/polls/polls";

export default async function Page({ params }) {
  const { id } = await params;

  let article = null;
  let poll = null;
  let selectedOptions = [];
  let voted = [];

  await getPollById(id)
    .then((receivedPoll) => {
      article = receivedPoll.golden_insights[0];
      poll = {
        ...receivedPoll,
        createdAt: receivedPoll.createdAt?.seconds
          ? new Date(receivedPoll.createdAt.seconds * 1000).toISOString()
          : null,
      };
      selectedOptions = receivedPoll.questions.map((q) =>
        q.users
          ? q.users.findIndex((u) => u === auth.currentUser.uid) >= 0
            ? 1
            : -1
          : -1
      );

      voted = receivedPoll.questions.map((q) => -1);
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <GoldenInsightDetail
      id={id}
      article={article}
      poll={poll}
      selectedOptions={selectedOptions}
      voted={voted}
    />
  );
}
