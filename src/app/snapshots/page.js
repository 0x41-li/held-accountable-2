'use client';
import { SnapshotFilters } from "@/components/Snapshot/SnaphotFilters";
import { SnapshotCard } from "@/components/Snapshot/SnapshotCard";
import { Fragment, useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { deleteSnapshot, disableSnapshot, enableSnapshot, getSnapshots, getUserById } from "@/services/polls/polls";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const snapshot = {
  id: 1,
  createdAt: { seconds: 1672531199 },
  user: {
    fullname: "Aliah Lane",
    username: "aliahlane",
  },
  snapshotUrl: "/images/snapshot/SnapshotCardImage.png",
  title: "Building your API stack",
  subtitle:
    "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
  topics: [
    { title: "Design", type: 0 },
    { title: "Research", type: 1 },
  ],
};

export default function Snapshot() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [shouldShowNewButton, setShouldShowNewButton] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [start, setStart] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    startDate: null,
    endDate: null,
  });

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const changeSelectedDate = (d) => {
    setStart(null);
    setHasMore(true);
    setSnapshots([]);
    setSelectedDate(d);
  }
  const changeSelectedTopics = (d) => {
    setStart(null);
    setHasMore(true);
    setSnapshots([]);
    setSelectedTopics(d);
  }

  const handleChangeSnapshotStatus = async (snapshot) => {
    if (snapshot.enabled) {
      await disableSnapshot(snapshot.id);
      setSnapshots(snapshots.map(snap => snap.id === snapshot.id ? { ...snap, enabled: false } : snap));
      return;
    }
    await enableSnapshot(snapshot.id);
    setSnapshots(snapshots.map(snap => snap.id === snapshot.id ? { ...snap, enabled: true } : snap));
  }

  const handleDeleteSnapshot = async (snapshotId) => {
    await deleteSnapshot(snapshotId);
    setSnapshots(snapshots.filter(snap => snap.id != snapshotId));
  }

  const loadData = async (from) => {
    setLoading(true);
    const { results, lastDoc } = await getSnapshots(from, 10, selectedDate.startDate ? selectedDate.startDate.toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10) : null, selectedDate.endDate ? selectedDate.endDate.toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10) : null, selectedTopics, !shouldShowNewButton);
    if (results.length == 0) {
      setHasMore(false);
    }
    setStart(lastDoc);
    setSnapshots([...snapshots, ...results.filter(snap => !snapshots.some(s => s.id === snap.id))]);
    setLoading(false);
  };

  useEffect(() => {
    if (!loading && inView && hasMore)
      loadData(start);
  }, [loading, inView, hasMore, selectedTopics, selectedDate, shouldShowNewButton]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth/signin");
        return;
      }
      if (currentUser) {
        getUserById(auth.currentUser.uid).then((u) => setUser(u));
      }
    });
    return () => unsubscribe();
  }, []);

  if (user && !shouldShowNewButton) {
    if (user.role && user.role != 'user' && user.role != "through-my-eyes-writer") {
      setShouldShowNewButton(true);
    }
  }

  return (
    <div className="w-full h-full overflow-hidden md:rounded-tl-[2.5rem] pt-8 border border-secondary flex flex-col bg-[#FCFCFD] overflow-y-auto pb-8">
      <div className="flex px-4 md:px-6 pb-5 border-b border-secondary items-start">
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-2xl md:text-[1.875rem] leading-[2.375rem] font-semibold">
            Snapshots
          </div>
          <div className="text-sm md:text-base leading-6 text-[#7C7C7C]">
            See what were discussed in previous days.
          </div>
        </div>
        {shouldShowNewButton && <div className="flex gap-[10px]  items-center">
          <Link href="/new-snapshot" className="text-center bg-blue rounded-[10px] text-white  w-[200px] py-[14px]">New</Link>
        </div>}
      </div>
      <div className="flex flex-col gap-6 mt-6 w-full px-4 md:w-[95%] lg:w-[85%] lg:max-w-[85%] md:mx-auto">
        <SnapshotFilters selectedDate={selectedDate} selectedTopics={selectedTopics} setSelectedDate={changeSelectedDate} setSelectedTopics={changeSelectedTopics} />
        {snapshots.map((snapshot) => (
          <Fragment key={snapshot.id}>
            <SnapshotCard snapshot={snapshot} showManage={shouldShowNewButton} changeSnapshotStatus={handleChangeSnapshotStatus} deleteSnapshot={handleDeleteSnapshot} />
          </Fragment>
        ))}
        <div ref={ref} className="h-10" />
      </div>
    </div>
  );
}
