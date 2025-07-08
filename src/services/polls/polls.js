import { toast } from 'react-toastify';
import { db } from '../../../lib/firebase'; // Adjust the import based on your Firebase setup
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, runTransaction, serverTimestamp, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

const POLLS_COLLECTION = 'polls';
const TOPIC_COLLECTION = 'topics';
const ARTICLE_COLLECTION = 'articles';
const CONTACTS_COLLECTION = 'contacts';

export const HOME_TRENDING = "HOME_TRENDING";
export const HOME_LATEST = "HOME_LATEST";
export const HOME_MOST_ANSWERED = "HOME_MOST_ANSWERED";

// Create a new poll
export const createPoll = async (pollData) => {
  try {
    const topic = pollData.topic;
    // check if topic already exists
    const topicSnap = await getDocs(query(collection(db, TOPIC_COLLECTION), where("topic", "==", topic)));
    if (topicSnap.empty) {
      await addDoc(collection(db, TOPIC_COLLECTION), {
        topic,
        poll_count: 1,
        vote_count: 0,
        status: 1,
      });
    }
    else {
      console.log(topicSnap);
      const topicRef = doc(db, TOPIC_COLLECTION, topicSnap.docs[0].id);
      await updateDoc(topicRef, {
        poll_count: topicSnap.docs[0].data().poll_count + 1
      });
    }

    // add poll
    const docRef = await addDoc(collection(db, POLLS_COLLECTION), {
      ...pollData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...pollData };
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
};

export const isUserAlreadyVoted = async (pollId, userId, questionId) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);
    const pollSnap = await getDoc(pollRef);
    if (!pollSnap.exists()) throw new Error('Poll not found');

    let questions = pollSnap.data().questions;
  
    if (questions[questionId].users.filter(u => u === userId).length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error fetching poll:', error);
    throw error;
  }
}

export const votePoll = async (pollId, userId, questionId, answer) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);

    await runTransaction(db, async (transaction) => {
      const pollSnap = await transaction.get(pollRef);
      if (!pollSnap.exists()) throw new Error('Poll not found');

      let pollData = pollSnap.data();
      let questions = pollData.questions;

      if (!questions[questionId]) throw new Error('Question not found');
      if (!questions[questionId].options[answer]) throw new Error('Invalid answer choice');

      // Ensure users array exists
      if (!questions[questionId].users) questions[questionId].users = [];

      // Prevent duplicate votes
      if (questions[questionId].users.includes(userId)) {
        throw new Error('User has already voted on this question');
      }

      // Update vote count & add user to voters list
      questions[questionId].options[answer].votes += 1;
      questions[questionId].totalVotes ++;
      questions[questionId].users.push(userId);

      const startDate = pollData.activeDate.from?.toDate?.() || new Date(); // Firestore Timestamp to JS Date
      const currentDate = new Date();
      const daysPassed = Math.max(1, Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24))); // Avoid division by zero
      const totalVotes = (pollData.totalVotes || 0) + 1;
      const trendScore = totalVotes / daysPassed;

      // Commit transaction update
      transaction.update(pollRef, {
        totalVotes,
        questions,
        trendScore
      });
    });

    console.log("Vote recorded successfully");
    return true;
  } catch (error) {
    toast.error(error);
    return false;
  }
};

// Get all polls
export const getPolls = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, POLLS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
};

export const getPollsByUserId = async (userId) => {
  try {
    const querySnapshot = await getDocs(query(collection(db, POLLS_COLLECTION), where('user.id', '==', userId)));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
};

export const getHomePolls = async (type, start = null, length = 10) => {
  try {
    let q;
    const pollsCollection = collection(db, POLLS_COLLECTION);

    switch (type) {
      case HOME_TRENDING:
        // Trending polls: Order by trendScore (descending)
        q = query(pollsCollection, orderBy("trendScore", "desc"), limit(length));
        break;

      case HOME_LATEST:
        // Latest polls: Order by creation date (descending)
        q = query(pollsCollection, orderBy("createdAt", "desc"), limit(length));
        break;

      case HOME_MOST_ANSWERED:
        // Most answered polls: Order by totalVotes (descending)
        q = query(pollsCollection, orderBy("totalVotes", "desc"), limit(length));
        break;

      default:
        throw new Error("Invalid poll type");
    }

    // Apply pagination if `start` is provided
    if (start) {
      q = query(q, startAfter(start));
    }

    q = query (q, where('status', '==', 1));
    const querySnapshot = await getDocs(q);
    let lastDoc = null;
    if (querySnapshot.docs.length > 0)
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
    return {result: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })), lastDoc};
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
};


export const getLatestPolls = async (start = null, length = 10) => {
  try {
    let q;
    const pollsCollection = collection(db, POLLS_COLLECTION);
    q = query(pollsCollection, orderBy("createdAt", "desc"), limit(length));
    
    // Apply pagination if `start` is provided
    if (start) {
      q = query(q, startAfter(start));
    }

    const querySnapshot = await getDocs(q);
    let lastDoc = null;
    if (querySnapshot.docs.length > 0)
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
    return {result: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })), lastDoc};
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
};

// Get a single poll by ID
export const getPollById = async (pollId) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);
    const pollSnap = await getDoc(pollRef);
    if (!pollSnap.exists()) throw new Error('Poll not found');
    return { id: pollSnap.id, ...pollSnap.data() };
  } catch (error) {
    console.error('Error fetching poll:', error);
    throw error;
  }
};

// Update a poll
export const updatePoll = async (pollId, updatedData) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);
    await updateDoc(pollRef, updatedData);
  } catch (error) {
    console.error('Error updating poll:', error);
    throw error;
  }
};

// Delete a poll
export const deletePoll = async (pollId) => {
  try {
    await deleteDoc(doc(db, POLLS_COLLECTION, pollId));
  } catch (error) {
    console.error('Error deleting poll:', error);
    throw error;
  }
};

export const getTrendingTopics = async (length = 10) => {
  try {
    const topicsCollection = collection(db, TOPIC_COLLECTION);
    const q = query(topicsCollection, orderBy("vote_count", "desc"), limit(length));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    throw error;
  }
};


export const getPollsByTopic = async (topicName, start = null, length = 10) => {
  try {
    const pollsCollection = collection(db, POLLS_COLLECTION);
    let q = query(pollsCollection, where("topic", "==", topicName), orderBy("createdAt", "desc"), limit(length));

    if (start) {
      q = query(q, startAfter(start));
    }
    q = query (q, where('status', '==', 1));

    const querySnapshot = await getDocs(q);
    let lastDoc = null;
    if (querySnapshot.docs.length > 0)
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
    return {result: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })), lastDoc};
  } catch (error) {
    console.error("Error fetching polls by topic:", error);
    throw error;
  }
};


export const addArticleToPoll = async (pollId, articleData) => {
  try {
    const data = {
      pollId,
      ...articleData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, ARTICLE_COLLECTION), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
};

export const getArticlesByPollId = async (pollId) => {
  try {
    const q = query(collection(db, ARTICLE_COLLECTION), where("pollId", "==", pollId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const updateArticle = async (articleId, updatedData) => {
  try {
    const articleRef = doc(db, ARTICLE_COLLECTION, articleId);
    await updateDoc(articleRef, updatedData);
    return { id: articleId, ...updatedData };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const articleRef = doc(db, ARTICLE_COLLECTION, articleId);
    await deleteDoc(articleRef);
    return true;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const getArticlesByTopic = async (topic, start = null, limitCount = 10) => {
  try {
    let q = query(
      collection(db, ARTICLE_COLLECTION),
    );

    if (topic) {
      q = query(q, where("topic", "==", topic));
    }

    q = query(q, orderBy("createdAt", "desc"),
      limit(limitCount));
    // Apply pagination if a start point exists
    if (start) {
      q = query(q, startAfter(start));
    }

    q = query (q, where('status', '==', 1));

    const querySnapshot = await getDocs(q);
    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      result: articles,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null, // Save last doc for pagination
    };
  } catch (error) {
    console.error("Error fetching articles by topic:", error);
    throw error;
  }
};

export const getArticleById = async (id) => {
  try {
    const articleRef = doc(db, ARTICLE_COLLECTION, id);
    const articleSnap = await getDoc(articleRef);
    await updateArticle(id, {
      view_count: articleSnap.data().view_count + 1
    });
    return articleSnap.data();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}


export const createTippingHistory = async (data) => {
  try {

    const docRef = await addDoc(collection(db, TIPPING_HISTORY_COLLECTION), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating tipping history:", error);
    throw error;
  }
};

export const getTippingHistory = async ({ userId = null, start = null, limitCount = 10 }) => {
  try {
    let q = collection(db, TIPPING_HISTORY_COLLECTION);

    if (userId) {
      q = query(q, where("userId", "==", userId));
    }

    q = query(q, orderBy("createdAt", "desc"), limit(limitCount));

    if (start) {
      q = query(q, startAfter(start));
    }

    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      history,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Error fetching tipping history:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  if (!userId) return null; // Ensure userId is provided

  try {
    const userRef = doc(db, "users", userId); // Directly reference the user document
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserById = async (userId, data) => {
  if (!userId) return null; // Ensure userId is provided

  try {
    const userRef = doc(db, "users", userId); // Directly reference the user document
    await updateDoc(userRef, data);
    return { id: userId, data };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUsers = async (start = null, length = 10) => {
  try {
    let q;
    const usersCollection = collection(db, "users");
    q = query(usersCollection, limit(length));
    
    // Apply pagination if `start` is provided
    if (start) {
      q = query(q, startAfter(start));
    }

    const querySnapshot = await getDocs(q);
    let lastDoc = null;
    if (querySnapshot.docs.length > 0)
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
    return {result: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })), lastDoc};
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export const sendContact = async (data) => {
  try {
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
}

export async function getWikipediaSummary(title) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.extract); // Summary of the topic
        return data.extract;
    } catch (error) {
        console.error("Error fetching Wikipedia summary:", error);
        return null;
    }
}

export async function getDescriptionUsingGPT(question) {
  const openai_api_key = "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";
  const url = "https://api.openai.com/v1/responses";

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
            "Authorization": "Bearer " + openai_api_key,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "gpt-4.1",
            "instructions": "Please write wiki description about question's keyword in 2~3 sentences. don't mention like keyword in the response.",
            "input": question
          })
      });
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.output[0].content[0].text;
  } catch (error) {
      console.error("Error fetching Wikipedia summary:", error);
      return null;
  }
}

// subscription apis
export async function updateSubscription(userId, subscription) {
  
}

// narrative apis


export async function generatePoll(topic, headlines) {
  const openai_api_key = "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";
  const url = "https://api.openai.com/v1/responses";
  let previous_headlines = "";
  
  if (headlines) {
    previous_headlines = " Lastly, the source news should not be one of following.\n" + headlines.join("\n");
  }

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
            "Authorization": "Bearer " + openai_api_key,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
                  "model": "gpt-4.1",
                  "tools": [{"type": "web_search_preview"}],
                  "input": `Please create a poll with the topic: \"${topic}\" using one current news article from one of the following sources ONLY: The Weather Channel, BBC News, PBS NewsHour, Reuters, NPR, Financial Times, Wall Street Journal, ABC News (Australia), CBC News (Canada), Bloomberg, Agence France-Presse (AFP), Deutsche Presse-Agentur (dpa), ProPublica, or Mongabay.\n\nRules:\n1. Only use articles published within the last **5 hours**.\n2. The **headline** must end with the outlet in parentheses (e.g., (Reuters, publisher verified)). If it does not, discard it.\n3. **Strictly avoid duplicate headlines or poll topics.** No exceptions.\n4. Cycle through the approved news sources to ensure outlet diversity — do not repeatedly use the same outlet back-to-back.\n\nOutput Format:\n1. **headline**: One-sentence summary in your own words, ending with the outlet name in parentheses.\n2. **question**: Balanced, non-leading poll question based on the article’s core issue.\n3. **answers**: 2 to 4 multiple choice options.\n4. **wiki_summary**: A brief Wikipedia-style explanation of the topic (no article references).\n5. **blog_title**: Clear, compelling title.\n6. **blog_content**: 250–500 words of original, professional analysis based only on Wikipedia and open data. No paraphrasing or summarizing the article. Maintain a neutral, journalistic tone — no editorializing or rhetorical questions.\n\nDo not continue if any requirement fails. If no valid article is found, return nothing.
${previous_headlines}`,
                  "text": { 
                      "format": { 
                          "name": "poll",
                          "type": "json_schema", 
                          "strict": true, 
                          "schema": {
                              "type": "object",
                              "properties": {
                                  "headline": { "type": "string" },
                                  "question": { "type": "string" },
                                  "options": {
                                      "type": "array",
                                      "items": { "type": "string" }
                                  },
                                  "wiki_summary": { "type": "string" },
                                  "blog_title": { "type": "string" },
                                  "blog_content": { "type": "string" }
                              },
                              "required": ["headline", "question", "options", "wiki_summary", "blog_title", "blog_content"],
                              "additionalProperties": false
                          }
                      }
                  }
                })
      });
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.parse(data.output[1].content[0].text);
  } catch (error) {
      console.error("Error fetching Wikipedia summary:", error);
      return null;
  }
}

export async function getExistingSubscriptionLogForIntentId(intentId) {
  const logs = await getDocs(query(collection(db, "subscription_logs"), where("intentId", "==", intentId)));
  return logs.docs.map(doc => doc.data());
}

export async function addSubscriptionLog(userId, amount, intentId) {
  const log = {
      userId,
      amount,
      intentId,
      createdAt: new Date()
  };
  await addDoc(collection(db, "subscription_logs"), log);
}

export async function updateUserSubscription(userId, amount, intentId) {
  let logs = await getExistingSubscriptionLogForIntentId(intentId);
  if (logs.length > 0) {
    console.log("already exists");
    return;
  }
  const user = await getUserById(userId);
  let duration = 1;
  if (amount == 5000) {
    duration = 12;
  }
  // extend one month
  if (user.subscripted_at) {
      user.subscripted_at = new Date(user.subscripted_at);
      user.subscripted_at.setMonth(user.subscripted_at.getMonth() + duration);
      await updateUserById(userId, { subscripted_at: user.subscripted_at.getTime() });
  }
  else {
    user.subscripted_at = new Date();
    console.log(user.subscripted_at);
    user.subscripted_at.setMonth(user.subscripted_at.getMonth() + duration);
    await updateUserById(userId, { subscripted_at: user.subscripted_at.getTime() });
  }
  await addSubscriptionLog(userId, amount, intentId);
}