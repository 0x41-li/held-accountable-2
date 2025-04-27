"use client"
import { useCallback, useEffect, useState } from 'react';
import { shuffleArray } from '../utils/shuffle';
import Poll from '@/components/Poll';
import Sidebar from '@/components/Sidebar';
import { Icon } from '@iconify/react';
import { HOME_MOST_ANSWERED, HOME_LATEST, HOME_TRENDING, getHomePolls, getUserById } from '@/services/polls/polls';
import CreatePoll from '@/components/CreatePoll';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Home() {
  const [viewType, setViewType] = useState(HOME_LATEST);
  const [addPollDialogVisible, setAddPollDialogVisible] = useState(false);
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const changeViewType = useCallback((t) => {
    setViewType(t);
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
    const { result: poll_list, lastDoc } = await getHomePolls(viewType, start);

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

  useEffect(() => {
    console.log(loading, inView)
    if (!loading && inView && hasMore)
      loadPolls();
  }, [inView, loading, hasMore]);

  return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
      <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start flex-col md:flex-row gap-[10px]'>
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
        <div className='px-[32px] flex-1 pt-[24px] flex flex-col h-full'>
          <div className='flex items-center justify-between'>
            <div className='flex rounded-[8px] overflow-hidden border border-primary'>
              <div className={`py-[8px] px-[16px] cursor-pointer border-r border-primary ${viewType === HOME_TRENDING ? 'bg-[#F4F4F4]': 'bg-white'}`} onClick={() => changeViewType(HOME_TRENDING)}>Trending</div>
              <div className={`py-[8px] px-[16px] cursor-pointer border-r border-primary ${viewType === HOME_LATEST ? 'bg-[#F4F4F4]': 'bg-white'}`} onClick={() => changeViewType(HOME_LATEST)}>Latest</div>
              <div className={`py-[8px] px-[16px] cursor-pointer border-primary ${viewType === HOME_MOST_ANSWERED ? 'bg-[#F4F4F4]': 'bg-white'}`} onClick={() => changeViewType(HOME_MOST_ANSWERED)}>Most Answered</div>
            </div>
            <button className='hidden md:block rounded-[8px] bg-blue text-white py-[10px] px-[14px] text-nowrap' onClick={() => handleCreatePoll()}>
              + Create Poll
            </button>
            <button className='rounded-full block fixed right-[40px] text-xl bottom-[40px] w-[40px] h-[40px] md:hidden bg-blue text-white' onClick={() => handleCreatePoll()}>
              +
            </button>
            <CreatePoll show={addPollDialogVisible} hideDialog={() => setAddPollDialogVisible(false)} />
          </div>
          <div className='flex flex-col gap-[24px] pt-[24px] flex-1 h-full overflow-auto pb-[200px]'>
            {polls.map(poll => poll.questions ? <Poll key={poll.id + "_poll_component"} poll={poll} />: poll)}
            {/* Intersection Observer Trigger */}
            <div ref={ref} className="h-10" />
          </div>
        </div>
        <div className='border-l border-secondary px-[26px] hidden gap-[24px] flex-col md:flex'>
          <div className='flex items-center pt-[20px]'>
            <div className='text-lg leading-lg font-semibold w-[219px]'>Popular Topics</div>
            <Link href="/trending" className='text-[#475467] text-[14px] leading-[20px] font-semibold'>View all</Link>
          </div>
        </div>
      </div>
    </div>
  );
}