'use client';
import { getPollById, updatePoll } from "@/services/polls/polls";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ManageDetails() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [tab, setTab] = useState(0);
    const [curSubQueId, setCurSubQueId] = useState(0);
    const [curEditQueId, setCurEditQueId] = useState(0);
    const [ data, setData ] = useState(null);

    const handleChangeTopicName = (value) => setData({
        ...data,
        topic: value
    });

    const handleChangeActiveDateFrom = (from) => setData({
        ...data,
        activeDate: {
            ...data.activeDate,
            from
        }
    });

    const handleChangeActiveDateTo = (to) => setData({
        ...data,
        activeDate: {
            ...data.activeDate,
            to
        }
    });

    const handleChangeQuestion = (value) => {
        let questions = data.questions;
        questions[curEditQueId].question = value;
        setData({
            ...data,
            questions
        });
    }

    const handleAddQuestion = () => {
        setCurEditQueId(data.questions.length);
        setData({
            ...data,
            questions: [
                ...data.questions,
                {
                    question: "",
                    options: [
                        { text: "", votes: 0},
                        { text: "", votes: 0} 
                    ],
                    totalVotes: 0,
                }
            ]
        });
    }

    const handleRemoveQuestion = () => {
        let questions = data.questions = data.questions.filter((_, i) => i !== curEditQueId)
        setData({
            ...data,
            questions
        });
        setCurEditQueId(curEditQueId - 1 < 0 ? 0: curEditQueId - 1);
    }

    const handleAddOption = () => {
        let questions = data.questions;
        questions[curEditQueId].options.push({ text: "", votes: 0});
        setData({
            ...data,
            questions
        });
    }

    const handleRemoveOption = () => {
        let questions = data.questions;
        questions[curEditQueId].options = questions[curEditQueId].options.filter((_, i) => i < questions[curEditQueId].options.length - 1 );
        setData({
            ...data,
            questions
        });
    }

    const handleChangeOption = (optionId, value) => {
        let questions = data.questions;
        questions[curEditQueId].options[optionId].text = value;
        setData({
            ...data,
            questions
        });
    }

    const handleSave = () => {
      updatePoll(id, data).then(() => {
        toast.success("Changes saved successfully!");
      }).catch(e => {
        console.log(e);
        toast.error("Errors met during save");
      });
    }

    useEffect(() => {
      getPollById(id).then(p => {
        setPoll(p);
        setData(p);
      });
    }, [id]);

    if (!poll || !data) {
      return <></>;
    }

    return (
      <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>{poll.topic}</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Topic details and reports</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px]'>
            <div className="flex px-[60px] gap-[60px]">
              <div className='px-[32px] flex-1 pt-[24px] flex flex-col h-full items-start'>
                <div className="w-full flex items-center justify-center">
                  <div className='flex rounded-[8px] overflow-hidden border border-primary'>
                    <div className={`py-[8px] px-[16px] cursor-pointer border-r border-primary ${tab === 0 ? 'bg-[#F4F4F4]': 'bg-white'}`} onClick={() => setTab(0)}>Submissions</div>
                    <div className={`py-[8px] px-[16px] cursor-pointer ${tab === 1 ? 'bg-[#F4F4F4]': 'bg-white'}`} onClick={() => setTab(1)}>Edit Poll</div>
                  </div>
                </div>
                {tab === 0 && <div className="flex flex-col gap-[16px] w-full pt-[24px]">
                  <div className="w-full text-center text-[16px] leading-[28px] text-blue">{poll.totalVotes} Votes</div>
                  {
                    curSubQueId < poll.questions.length && <div className="text-[16px] leading-[28px]">
                      {poll.questions[curSubQueId].question}
                    </div>
                  }
                  {
                    curSubQueId < poll.questions.length && (
                        poll.questions[curSubQueId].options.map((option, i) => {
                            const percentage = option.votes ? (option.votes / poll.questions[curSubQueId].totalVotes) * 100 : 0;
    
                            return (
                                <div key={i} className="relative border-secondary border p-[16px] w-full rounded-[12px] flex items-center">
                                    {/* Progress Bar */}
                                    <div className="absolute inset-0 bg-[#3B88E357] rounded-[12px]" style={{ width: `${percentage}%` }}></div>
    
                                    <div className="relative flex-1">{option.text}</div>
                                    <div className="relative font-bold">{Math.round(percentage)}%</div>
                                </div>
                            );
                        })
                    )
                  }
                  {poll.questions.length > 0 ?
                  <div className="flex items-center justify-center text-sm leading-sm gap-[17px]">
                      <span>Questions:</span>
                      {poll.questions.map((question, i) => <button key={question.question + i} onClick={() => setCurSubQueId(i)} className={`rounded-full p-[8px] w-[36px] text-center border border-primary ${curSubQueId === i ? 'bg-blue text-white': ''}`}>{i + 1}</button>)}
                  </div>: ""}
                </div>}
                {tab === 1 && <div className="flex flex-col gap-[16px] w-full pt-[24px]">
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex gap-[32px] items-center">
                        <span className="w-[160px] text-[14px] leading-[20px]">Topic Name</span>
                        <input className="border border-primary outline-none rounded-[8px] flex-1 py-[10px] px-[14px]" placeholder="Enter the topic name" type="text" value={data.topic} onChange={(e) => handleChangeTopicName(e.target.value)} />
                    </div>
                    <div className="flex gap-[32px] items-center">
                        <span className="w-[160px] text-[14px] leading-[20px]">Active Date</span>
                        <div className="flex-1 flex gap-[32px] items-center">
                        <input className="border border-primary outline-none rounded-[8px] py-[10px] px-[14px] flex-1"  type="date" value={data.activeDate.from} onChange={(e) => handleChangeActiveDateFrom(e.target.value)} />
                        <span className=" text-[14px] leading-[20px]">To</span>
                        <input className="border border-primary outline-none rounded-[8px] py-[10px] px-[14px] flex-1"  type="date" value={data.activeDate.to} onChange={(e) => handleChangeActiveDateTo(e.target.value)} />
                        </div>
                    </div>
                    <hr />
                    {curEditQueId < data.questions.length ? 
                    <div className="flex gap-[32px] items-center">
                        <span className="w-[160px] text-[14px] leading-[20px]">Type a Question</span>
                        <textarea className="border border-primary outline-none rounded-[8px] flex-1 py-[10px] px-[14px]" placeholder="Type the question of the polls here" value={data.questions[curEditQueId].question} onChange={(e) => handleChangeQuestion(e.target.value)}>
                        </textarea>
                    </div>: ""}
                    
                    {curEditQueId < data.questions.length ? 
                    data.questions[curEditQueId].options.map((option, i) => 
                    <div className="flex gap-[32px] items-center" key={"option" + i}>
                        <span className="w-[160px] text-[14px] leading-[20px]">Option {i + 1}</span>
                        <input className="border border-primary outline-none rounded-[8px] flex-1 py-[10px] px-[14px]" placeholder={`Option ${i + 1}`} type="text" value={data.questions[curEditQueId].options[i].text} onChange={(e) => handleChangeOption(i, e.target.value)} />
                    </div>): ""}
                    {curEditQueId < data.questions.length ?
                    <div className="flex gap-[10px] text-[14px] leading-[20px]">
                        <button className="text-blue" onClick={() => handleAddOption()}>+ Add Option</button>
                        <button className="text-[#ff0000]" onClick={() => handleRemoveOption()}>- Remove Option</button>
                    </div>: ""}
                  </div>
                  <div className="flex items-center justify-center text-sm leading-sm gap-[8px]">
                      <span>Questions:</span>
                      {data.questions.map((question, i) => <button key={question.question + i} onClick={() => setCurEditQueId(i)} className={`rounded-full p-[8px] w-[36px] text-center border border-primary ${curEditQueId === i ? 'bg-blue text-white': ''}`}>{i + 1}</button>)}
                      <button onClick={() => handleAddQuestion()} className={`rounded-full p-[8px] w-[36px] text-center border border-primary`}> + </button>
                      <button onClick={() => handleRemoveQuestion()} className={`rounded-full p-[8px] w-[36px] text-center border border-primary`}> - </button>
                  </div>
                  <div className="flex justify-end">
                    <button className="rounded-[8px] bg-blue text-white px-4 py-2 text-sm" onClick={() => handleSave()}>Apply Changes</button>
                  </div>
                </div>}
              </div>
              <div className='border-l border-secondary px-[26px] hidden gap-[24px] flex-col md:flex'>
                <div className='flex items-center pt-[20px]'>
                  <div className='text-lg leading-lg font-semibold w-[219px]'>Recent Topic Activity</div>
                </div>
              </div>
            </div>
          </div>
        </div>);
}