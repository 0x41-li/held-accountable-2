'use client';
import { SnapshotCard } from "@/components/Snapshot/SnapshotCard";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSnapshot, disableSnapshot, enableSnapshot, getSnapshots, getUserById } from "@/services/polls/polls";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import SnapshotSidebar from "@/components/Snapshot/SnapshotSidebar";
import { SingleDatePicker } from "@/components/ui/SingleDatePicker";
import { auth } from "../../../../lib/firebase";

export default function Snapshot() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [shouldShowNewButton, setShouldShowNewButton] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [start, setStart] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const categories = ["ALL", "FINANCE", "CRYPTO", "POLITICS", "AI"];
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const changeSelectedDate = (date) => {
    setStart(null);
    setHasMore(true);
    setSnapshots([]);
    setSelectedDate(date);
  }

  const changeSelectedCategory = (category) => {
    setStart(null);
    setHasMore(true);
    setSnapshots([]);
    setActiveCategory(category);
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
    // Convert category to topics array format
    const topics = activeCategory === "ALL" ? [] : [activeCategory.toLowerCase()];
    const dateStr = selectedDate ? selectedDate.toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10) : null;
    const { results, lastDoc } = await getSnapshots(from, 10, dateStr, dateStr, topics, !shouldShowNewButton);
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
  }, [loading, inView, hasMore, activeCategory, selectedDate, shouldShowNewButton]);

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
    <div className="w-full h-full">
      <div className="w-full h-full overflow-hidden flex flex-col shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start flex-1 justify-between gap-4">
            <div className="flex items-end gap-3 mt-4 flex-col md:flex-row flex-1">
              <h1 className="text-3xl font-bold text-[#2b425b]">Snapshots</h1>
              <p className="text-[#2b425b] text-base">See what were discussed in previous days.</p>
            </div>
            {shouldShowNewButton && (
              <Link 
                href="/app/new-snapshot" 
                className="hidden md:block bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                New
              </Link>
            )}
          
            <button
                className="hidden md:block gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                onClick={() => router.push("/app/subscription")}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="flex flex-col flex-1">
            {/* Category Tabs and Date Picker */}
            <div className="flex gap-1 mt-2 px-6 justify-between items-center">
              <div className="flex gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => changeSelectedCategory(category)}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      activeCategory === category
                        ? "text-blue-700 md:border border-dashed border-[#2B425B40] rounded-full px-4 py-2"
                        : "text-[#2b425b] hover:text-[#101828]"
                    }`}
                  >
                    {category}
                    {activeCategory === category && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="w-full sm:w-auto">
                <SingleDatePicker
                  selectedDate={selectedDate}
                  onDateSelect={changeSelectedDate}
                />
              </div>
            </div>
            {/* Left Column - Snapshots */}
            <div className="flex-1 overflow-auto px-10 pt-[20px]">
              <div className="flex flex-col gap-6">
                {snapshots.length > 0 ? (
                  snapshots.map((snapshot) => (
                    <Fragment key={snapshot.id}>
                      <SnapshotCard snapshot={snapshot} showManage={shouldShowNewButton} changeSnapshotStatus={handleChangeSnapshotStatus} deleteSnapshot={handleDeleteSnapshot} />
                    </Fragment>
                  ))
                ) : (
                  <p className="font-semibold text-xl mt-12 text-center text-[#98A2B3]">
                    No snapshots found
                  </p>
                )}
                <div ref={ref} className="h-10" />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:w-[400px]">
            <SnapshotSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
