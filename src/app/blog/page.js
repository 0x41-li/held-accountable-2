"use client"
import { useCallback, useEffect, useState } from 'react';
import Poll from '@/components/Poll';
import Sidebar from '@/components/Sidebar';
import { Icon } from '@iconify/react';
import { HOME_LATEST, getHomePolls, getTrendingTopics, getPollsByTopic, getArticlesByTopic, getUserById } from '@/services/polls/polls';
import CreatePoll from '@/components/CreatePoll';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/firebase';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Blog from '@/components/Blog';

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
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState();
  const [shouldShowNewButton, setShouldShowNewButton] = useState(false);

  const [trendingTopics, setTrendingTopics] = useState([
    "All", 
    "AI", 
    "Finance",
    "Politics",
    "Crypto", 
  ]);
  const [currentTopic, setCurrentTopic] = useState("All");

  const { ref, inView } = useInView();

  const changeTopic = useCallback((t) => {
    setCurrentTopic(t);
    setStart(null);
    setHasMore(true);
    setBlogs([]);
  }, [setCurrentTopic]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
        let blogList = [], lastDoc;
        if (currentTopic === 'All') {
            const { result, lastDoc: last } = await getArticlesByTopic(null, start);
            blogList = result;
            lastDoc = last;
        }
        else {
            const { result, lastDoc: last } = await getArticlesByTopic(currentTopic, start);
            blogList = result;
            lastDoc = last;
        }
        console.log(blogList);

        if (blogList.length === 0) {
            setLoading(false);
            setHasMore(false);
            return;
        }

        if (blogs.findIndex(p => p.id === blogList[0].id) >= 0) {
        setLoading(false);
        return;
        }

        setStart(lastDoc);
        setBlogs([...blogs, ...blogList]);
    }
    catch (e) {
        console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log(loading, inView)
    if (!loading && inView && hasMore)
      loadBlogs();
  }, [inView, loading, hasMore, currentTopic]);
  
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
    if (user.role && user.role != 'user' && user.role != "snapshot-writer") {
      setShouldShowNewButton(true);
    }
  }

  return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>Through My Eyes</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>User perspectives on Breaking News.</div>
            </div>
            {shouldShowNewButton && <div className="flex gap-[10px]  items-center">
              <Link href="/new-blog" className="text-center bg-blue rounded-[10px] text-white  w-[200px] py-[14px]">New</Link>
            </div>}
          </div>
          <div className='flex-1 flex h-full'>
            <div className='px-[32px] flex-1 pt-[24px] flex flex-col h-full w-full'>
              <div className='w-full overflow-auto'>
                <div className='flex rounded-[8px] overflow-hidden border border-primary flex-nowrap w-fit'>
                    {trendingTopics.map((topic, i) => <div key={topic + "_" + i} className={`py-[8px] px-[16px] cursor-pointer text-nowrap ${currentTopic === topic ? 'bg-[#F4F4F4]': 'bg-white'} ${i != trendingTopics.length - 1 ? ' border-r border-primary':''}`} onClick={() => changeTopic(topic)}>{topic}</div>)}
                </div>
              </div>
              <div className='flex flex-col gap-[24px] pt-[24px] flex-1 h-full overflow-auto pb-[200px]'>
                {blogs.map((blog, i) => <Blog key={blog.title + i} blog={blog} />)}
                {/* Intersection Observer Trigger */}
                <div ref={ref} className="h-10" />
              </div>
            </div>
            <div className='border-l border-secondary px-[26px] hidden gap-[24px] flex-col md:flex'>
              <div className='flex items-center pt-[20px]'>
                <div className='text-lg leading-lg font-semibold w-[219px]'>Popular Posts</div>
              </div>
            </div>
          </div>
        </div>);
}