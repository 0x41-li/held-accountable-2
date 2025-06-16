"use client"
import { useCallback, useEffect, useState } from 'react';
import Poll from '@/components/Poll';
import Sidebar from '@/components/Sidebar';
import { Icon } from '@iconify/react';
import { HOME_LATEST, getHomePolls, getTrendingTopics, getPollsByTopic, getUserById } from '@/services/polls/polls';
import CreatePoll from '@/components/CreatePoll';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { auth } from '../../lib/firebase';

const dummyPoll = {
  user: {
    username: "aliahlane_official",
    fullname: "Aliah Lane",

  },
  firstArticleDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?",
  firstArticleId: 123,
  totalVotes: 1590,
  activeDate: {
    from: new Date(2025, 2, 1, 0, 0),
    to: new Date(2025, 2, 31, 22, 0),
  },
  createdAt: new Date(),
  questions: [
    {
      question: "What is the best programming language in 2023?",
      options: [
        { text: "JavaScript", votes: 120 },
        { text: "Python", votes: 90 },
        { text: "Rust", votes: 50 },
        { text: "Go", votes: 30 },
      ],
      totalVotes: 290,
      category: "Technology",
    },
    {
      question: "Should governments regulate AI development?",
      options: [
        { text: "Yes", votes: 200 },
        { text: "No", votes: 150 },
        { text: "Unsure", votes: 50 },
      ],
      totalVotes: 400,
      category: "Politics",
    },
    {
      question: "Which social media platform do you use the most?",
      options: [
        { text: "Instagram", votes: 300 },
        { text: "Twitter (X)", votes: 250 },
        { text: "Facebook", votes: 200 },
        { text: "TikTok", votes: 150 },
      ],
      totalVotes: 900,
      category: "Technology",
    },
  ]
};

export default function Home() {
  const [viewType, setViewType] = useState(HOME_LATEST);
  const [addPollDialogVisible, setAddPollDialogVisible] = useState(false);
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState(["All", "Digital Assets & Crypto", "Artificial Intelligence", "Aviation"]);
  const [currentTopic, setCurrentTopic] = useState("All");

  const { ref, inView } = useInView();

  const changeTopic = useCallback((t) => {
    setCurrentTopic(t);
    setStart(null);
    setHasMore(true);
    setPolls([]);
  }, [setViewType]);

  const handleCreatePoll = () => {
    
    if (auth.currentUser) {
      getUserById(auth.currentUser.uid).then(u => {
        if (u.status === 1) {
          setAddPollDialogVisible(true);
        }
        else {
          toast.error("You are not eligible to create a poll at this time.");
        }
      });
    }
    else {
      router.push("/auth/signin");
    }
  }

  const loadPolls = async () => {
    setLoading(true);
    let poll_list = [], lastDoc;
    if (currentTopic === 'All') {
        const { result, lastDoc: last } = await getHomePolls(viewType, start);
        poll_list = result;
        lastDoc = last;
    }
    else {
        const { result, lastDoc: last } = await getPollsByTopic(currentTopic, start);
        poll_list = result;
        lastDoc = last;
    }

    if (poll_list.length === 0) {
      setLoading(false);
      setHasMore(false);
      return;
    }

    if (polls.findIndex(p => p.id === poll_list[0].id) >= 0) {
      setLoading(false);
      return;
    }

    setStart(lastDoc);
    setPolls([...polls, ...poll_list]);
    setLoading(false);
  }

  // const loadTopics = async () => {
  //   const topics = await getTrendingTopics(5);
  //   setTrendingTopics(["All", ...topics.map(topic => topic.topic)]);
  // }

  // useEffect(() => {
  //   loadTopics();
  // }, [setTrendingTopics]);

  const onRefresh = () => {
    setStart(null);
    setHasMore(true);
    setPolls([]);
  }

  useEffect(() => {
    if (!loading && inView && hasMore)
      loadPolls();
  }, [inView, loading, hasMore, currentTopic]);

  const loadNewPolls = useCallback(async () => {
      let poll_list = [];
      
      if (currentTopic === 'All') {
          const { result } = await getHomePolls(viewType);
          poll_list = result;
      }
      else {
          const { result } = await getPollsByTopic(currentTopic);
          poll_list = result;
      }

      if (poll_list.length > 0) {
        // only add new polls where same id does not exist in the polls
        const newPolls = poll_list.filter(p => !polls.find(existing => existing.id === p.id));
        if (newPolls.length > 0) {
          console.log("New polls found:", newPolls);
          // prepend new polls to the existing polls
          // so that the latest polls are shown at the top
          // and update the polls state
          setPolls([...newPolls, ...polls]);
        }
      }
    }, [currentTopic, viewType, setPolls, polls]);

  useEffect(() => {
    const interval = setInterval(loadNewPolls, 2000);
    return () => clearInterval(interval);
  }, [loadNewPolls]);

  return (<div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start flex-col md:flex-row'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>Latest Polls</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>You can see the latest polls submitted to Held Accountable </div>
            </div>
            <div className='border border-secondary rounded-md overflow-hidden flex items-center gap-[8px] p-[10px]'>
              <Icon icon="ri:search-line" className='text-[#667085]' />
              <input type="text" placeholder='Search...' className='outline-none bg-white' />
            </div>
          </div>
          <div className='flex-1 flex h-full'>
            <div className='px-[32px] w-full flex-1 pt-[24px] flex flex-col h-full'>
              <div className='w-full flex items-center justify-between flex-col md:flex-row'>
                <div className='w-full overflow-auto'>
                  <div className='flex rounded-[8px] overflow-hidden border border-primary flex-nowrap w-fit'>
                      {trendingTopics.map((topic, i) => <div key={topic + "_" + i} className={`py-[8px] px-[16px] cursor-pointer text-nowrap ${currentTopic === topic ? 'bg-[#F4F4F4]': 'bg-white'} ${i != trendingTopics.length - 1 ? ' border-r border-primary':''}`} onClick={() => changeTopic(topic)}>{topic}</div>)}
                  </div>
                </div>
                <button className='hidden md:block rounded-[8px] bg-blue text-white py-[10px] px-[14px] text-nowrap' onClick={() => handleCreatePoll()}>
                  + Create Poll
                </button>
                <button className='rounded-full block fixed right-[40px] text-xl bottom-[40px] w-[40px] h-[40px] md:hidden bg-blue text-white' onClick={() => handleCreatePoll()}>
                  +
                </button>
                <CreatePoll show={addPollDialogVisible} hideDialog={() => setAddPollDialogVisible(false)} onRefresh={onRefresh} />
              </div>
              <div className='w-full flex flex-col gap-[24px] pt-[24px] flex-1 h-full overflow-auto pb-[200px]'>
                {polls.map(poll => poll.questions ? <Poll key={poll.id + "_poll_component"} poll={poll} />: poll)}
                {/* Intersection Observer Trigger */}
                <div ref={ref} className="h-10" />
              </div>
            </div>
            <div className='border-l border-secondary px-[26px] hidden gap-[24px] flex-col md:flex'>
              <div className='flex items-center pt-[20px]'>
                <div className='text-lg leading-lg font-semibold w-[219px]'>Latest Polls</div>
                <Link href="/" className='text-[#475467] text-[14px] leading-[20px] font-semibold'>View all</Link>
              </div>
            </div>
          </div>
        </div>);
}