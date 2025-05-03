import { Icon } from "@iconify/react";
import { useState } from "react";
import CreateArticle from "./CreateArticle";
import { addArticleToPoll, createPoll, getDescriptionUsingGPT, getWikipediaSummary, updatePoll } from "@/services/polls/polls";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

export default function CreatePoll({show, hideDialog, onRefresh}) {
    const [data, setData] = useState({ topic: "Digital Assets & Crypto", activeDate: {
            from: "2025-01-01",
            to: "2025-01-01",
        },
        totalVotes: 0,
        questions: [{
            question: "",
            options: [
                { text: "", votes: 0},
                { text: "", votes: 0} 
            ],
            totalVotes: 0,
        }],
    });
    const [addArticleDialogVisible, setAddArticleDialogVisible] = useState(false);
    const [articles, setArticles] = useState([]);
    const [curQueId, setCurQueId] = useState(0);

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
        questions[curQueId].question = value;
        setData({
            ...data,
            questions
        });
    }

    const handleAddQuestion = () => {
        setCurQueId(data.questions.length);
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
        let questions = data.questions = data.questions.filter((_, i) => i !== curQueId)
        setData({
            ...data,
            questions
        });
        setCurQueId(curQueId - 1 < 0 ? 0: curQueId - 1);
    }

    const handleAddOption = () => {
        let questions = data.questions;
        questions[curQueId].options.push({ text: "", votes: 0});
        setData({
            ...data,
            questions
        });
    }

    const handleRemoveOption = () => {
        let questions = data.questions;
        questions[curQueId].options = questions[curQueId].options.filter((_, i) => i < questions[curQueId].options.length - 1 );
        setData({
            ...data,
            questions
        });
    }

    const handleChangeOption = (optionId, value) => {
        let questions = data.questions;
        questions[curQueId].options[optionId].text = value;
        setData({
            ...data,
            questions
        });
    }
    
    const handleAddArticle = () => {
        setAddArticleDialogVisible(true);
    }

    const handleRemoveArticle = (index) => {
        setArticles(articles.filter((_, i) => i !== index));
    }

    const handleCreatePoll = async () => {
        const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", auth.currentUser.email)));
        if (userDoc.empty) {
            return;
        }

        if (userDoc.docs[0].data().status != 1) {
            toast.error("You are not eligible to create a poll at this time.");
            return;
        }

        let dataWithSummary = data;

        for (let i = 0; i < data.questions.length; i ++) {
            try {
                const summary = await getDescriptionUsingGPT(data.questions[i].question);
                if (summary)
                    dataWithSummary.questions[i].summary = summary;
            }
            catch (e) {
    
            }
        }

        // return;
        const createdPoll = await createPoll({
            ...dataWithSummary,
            status: 1,
            user: {
                id: auth.currentUser.uid,
                fullname: auth.currentUser.displayName,
                username: userDoc.docs[0].data().username,
                avatar: userDoc.docs[0].data().avatar ?? "" 
            }
        });

        let firstArticleId, firstArticleDescription;
        for (let article of articles) {

            const createdArticle = await addArticleToPoll(createdPoll.id, {
                ...article,
                topic: data.topic,
                user: {
                    id: auth.currentUser.uid,
                    fullname: auth.currentUser.displayName,
                    username: userDoc.docs[0].data().username,
                    avatar: userDoc.docs[0].data().avatar ?? "" 
                },
                view_count: 0,
                status:1
            });
            
            if (!firstArticleId) {
                firstArticleId = createdArticle.id;
                firstArticleDescription = createdArticle.content;
            }
        }

        if (articles.length > 0)
            await updatePoll(createdPoll.id, {
                dataWithSummary,
                firstArticleId,
                firstArticleDescription
            });
        hideDialog();
        onRefresh();
    }

    if (!show) {
        return "";
    }

    return <div>
        <div id="default-modal" className="flex bg-[#000000cc] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <div className="flex gap-[16px] items-center">
                            <img src="/images/modal_icon.png" />
                            <div className="flex flex-col gap-[4px]">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Create New Poll
                                </h3>
                                <div className="text-[#475467] text-[14px] leading-[20px]">Add one or more questions.</div>
                            </div>
                        </div>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal" onClick={() => hideDialog()}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Topic Name</span>
                                
                                <select className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px]" placeholder="Enter the topic name" value={data.topic} onChange={(e) => handleChangeTopicName(e.target.value)} >
                                    <option>Digital Assets & Crypto</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Aviation</option>
                                </select>
                            </div>
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Active Date</span>
                                <div className="w-[448px] flex gap-[32px] items-center">
                                <input className="border border-primary outline-none rounded-[8px] py-[10px] px-[14px] flex-1"  type="date" value={data.activeDate.from} onChange={(e) => handleChangeActiveDateFrom(e.target.value)} />
                                <span className=" text-[14px] leading-[20px]">To</span>
                                <input className="border border-primary outline-none rounded-[8px] py-[10px] px-[14px] flex-1"  type="date" value={data.activeDate.to} onChange={(e) => handleChangeActiveDateTo(e.target.value)} />
                                </div>
                            </div>
                            <hr />
                            {curQueId < data.questions.length ? 
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Type a Question</span>
                                <textarea className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px]" placeholder="Type the question of the polls here" value={data.questions[curQueId].question} onChange={(e) => handleChangeQuestion(e.target.value)}>
                                </textarea>
                            </div>: ""}
                            
                            {curQueId < data.questions.length ? 
                            data.questions[curQueId].options.map((option, i) => 
                            <div className="flex gap-[32px] items-center" key={"option" + i}>
                                <span className="w-[160px] text-[14px] leading-[20px]">Option {i + 1}</span>
                                <input className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px]" placeholder={`Option ${i + 1}`} type="text" value={data.questions[curQueId].options[i].text} onChange={(e) => handleChangeOption(i, e.target.value)} />
                            </div>): ""}
                            {curQueId < data.questions.length ?
                            <div className="flex gap-[10px] text-[14px] leading-[20px]">
                                <button className="text-blue" onClick={() => handleAddOption()}>+ Add Option</button>
                                <button className="text-[#ff0000]" onClick={() => handleRemoveOption()}>- Remove Option</button>
                            </div>: ""}
                        </div>
                        <div className="flex items-center justify-center text-sm leading-sm gap-[8px]">
                            <span>Questions:</span>
                            {data.questions.map((question, i) => <button key={question.question + i} onClick={() => setCurQueId(i)} className={`rounded-full p-[8px] w-[36px] text-center border border-primary ${curQueId === i ? 'bg-blue text-white': ''}`}>{i + 1}</button>)}
                            <button onClick={() => handleAddQuestion()} className={`rounded-full p-[8px] w-[36px] text-center border border-primary`}> + </button>
                            <button onClick={() => handleRemoveQuestion()} className={`rounded-full p-[8px] w-[36px] text-center border border-primary`}> - </button>
                        </div>
                        <div className="flex flex-col gap-[13px]">
                            {articles.map((article, i) => <div className="flex gap-[20px]">
                                    <button className="text-[#ff0000] text-[20px]" onClick={() => handleRemoveArticle(i)}><Icon icon="mdi:trash-outline" /></button>
                                    <div className="text-[14px] leading-[20px] flex-1">{article.title}</div>
                                </div>
                            )}
                        </div>
                        {/* <div className="flex items-center gap-[10px] justify-center">
                            <button className="bg-blue rounded-[8px] py-[9px] px-[12px] text-white" onClick={() => handleAddArticle()}>+ Add Article</button>
                        </div> */}
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px]" onClick={hideDialog}> Close </button>
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px] text-white bg-blue" onClick={() => handleCreatePoll()}> Create Poll </button>
                    </div>
                </div>
            </div>
        </div>
        <CreateArticle show={addArticleDialogVisible} hideDialog={() => setAddArticleDialogVisible(false)} onSave={(data) => {
            setAddArticleDialogVisible(false);
            setArticles([...articles, data]);
        }} />
    </div>;    
}