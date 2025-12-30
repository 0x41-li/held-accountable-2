import { toast } from "react-toastify";
import { db } from "../../../lib/firebase"; // Adjust the import based on your Firebase setup
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  runTransaction,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { FAMOUS_COMPANIES_DATA } from "../const";

const POLLS_COLLECTION = "polls";
const TOPIC_COLLECTION = "topics";
const ARTICLE_COLLECTION = "articles";
const CONTACTS_COLLECTION = "contacts";
const USERS_COLLECTION = "users";
const SNAPSHOT_COLLECTION = 'snapshots';
const VIRAL_DETECTIONS_COLLECTION = 'viral_detections';

export const HOME_TRENDING = "HOME_TRENDING";
export const HOME_LATEST = "HOME_LATEST";
export const HOME_MOST_ANSWERED = "HOME_MOST_ANSWERED";

// Create a new poll
export const createPoll = async (pollData) => {
  try {
    const category = pollData.category;
    // check if topic already exists
    const topicSnap = await getDocs(
      query(collection(db, TOPIC_COLLECTION), where("topic", "==", topic))
    );
    if (topicSnap.empty) {
      await addDoc(collection(db, TOPIC_COLLECTION), {
        category,
        poll_count: 1,
        vote_count: 0,
        status: 1,
      });
    } else {
      const topicRef = doc(db, TOPIC_COLLECTION, topicSnap.docs[0].id);
      await updateDoc(topicRef, {
        poll_count: topicSnap.docs[0].data().poll_count + 1,
      });
    }

    // add poll
    const docRef = await addDoc(collection(db, POLLS_COLLECTION), {
      ...pollData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...pollData };
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};

export const isUserAlreadyVoted = async (pollId, userId, questionId) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);
    const pollSnap = await getDoc(pollRef);
    if (!pollSnap.exists()) throw new Error("Poll not found");

    let questions = pollSnap.data().questions;

    if (questions[questionId].users.filter((u) => u === userId).length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching poll:", error);
    throw error;
  }
};

export const votePoll = async (pollId, userId, questionId, answer) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);

    await runTransaction(db, async (transaction) => {
      const pollSnap = await transaction.get(pollRef);
      if (!pollSnap.exists()) throw new Error("Poll not found");

      let pollData = pollSnap.data();
      let questions = pollData.questions;

      if (!questions[questionId]) throw new Error("Question not found");
      if (!questions[questionId].options[answer])
        throw new Error("Invalid answer choice");

      // Ensure users array exists
      if (!questions[questionId].users) questions[questionId].users = [];

      // Prevent duplicate votes
      if (questions[questionId].users.includes(userId)) {
        throw new Error("User has already voted on this question");
      }

      // Update vote count & add user to voters list
      questions[questionId].options[answer].votes += 1;
      questions[questionId].totalVotes++;
      questions[questionId].users.push(userId);

      const startDate = pollData.activeDate.from?.toDate?.() || new Date(); // Firestore Timestamp to JS Date
      const currentDate = new Date();
      const daysPassed = Math.max(
        1,
        Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24))
      ); // Avoid division by zero
      const totalVotes = (pollData.totalVotes || 0) + 1;
      const trendScore = totalVotes / daysPassed;

      // Commit transaction update
      transaction.update(pollRef, {
        totalVotes,
        questions,
        trendScore,
      });
    });
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
    console.error("Error fetching polls:", error);
    throw error;
  }
};

export const getPollsByUserId = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, POLLS_COLLECTION), where("user.id", "==", userId))
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
};

export const getHomePolls = async (type, start = null, length = 10) => {
  try {
    let q;
    let countQ;
    const pollsCollection = collection(db, POLLS_COLLECTION);

    switch (type) {
      case HOME_TRENDING:
        // Trending polls: Order by trendScore (descending)
        q = query(
          pollsCollection,
          orderBy("trendScore", "desc"),
          limit(length)
        );
        countQ = query(
          pollsCollection,
          orderBy("trendScore", "desc")
        );
        break;

      case HOME_LATEST:
        // Latest polls: Order by creation date (descending)
        q = query(pollsCollection, orderBy("createdAt", "desc"), limit(length));
        countQ = query(pollsCollection, orderBy("createdAt", "desc"));
        break;

      case HOME_MOST_ANSWERED:
        // Most answered polls: Order by totalVotes (descending)
        q = query(
          pollsCollection,
          orderBy("totalVotes", "desc"),
          limit(length)
        );
        countQ = query(
          pollsCollection,
          orderBy("totalVotes", "desc")
        );
        break;

      default:
        throw new Error("Invalid poll type");
    }

    // Apply pagination if `start` is provided
    if (start) {
      q = query(q, startAfter(start));
    }

    q = query(q, where("status", "==", 1));
    q = query(q, where("topic", "!=", "Politics"));
    
    countQ = query(countQ, where("status", "==", 1));
    countQ = query(countQ, where("topic", "!=", "Politics"));
    
    const querySnapshot = await getDocs(q);
    const countSnapshot = await getCountFromServer(countQ);
    const totalCount = countSnapshot.data().count;
    
    let lastDoc = null;
    if (querySnapshot.docs.length > 0)
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return {
      result: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        golden_insights: doc.data().golden_insights?.map((item) => ({
          ...item
        })),
        likes: doc.data().likes ?? 0,
        like_users: doc.data().like_users ?? [],
        dislikes: doc.data().dislikes ?? 0,
        dislike_users: doc.data().dislike_users ?? []
      })),
      lastDoc,
      totalCount,
    };
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
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return {
      result: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastDoc,
    };
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
    if (!pollSnap.exists()) throw new Error("Poll not found");
    return { id: pollSnap.id, ...pollSnap.data() };
  } catch (error) {
    console.error("Error fetching poll:", error);
    throw error;
  }
};

// Update a poll
export const updatePoll = async (pollId, updatedData) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);
    await updateDoc(pollRef, updatedData);
  } catch (error) {
    console.error("Error updating poll:", error);
    throw error;
  }
};

// Delete a poll
export const deletePoll = async (pollId) => {
  try {
    await deleteDoc(doc(db, POLLS_COLLECTION, pollId));
  } catch (error) {
    console.error("Error deleting poll:", error);
    throw error;
  }
};

export const getTrendingTopics = async (length = 10) => {
  try {
    const topicsCollection = collection(db, TOPIC_COLLECTION);
    const q = query(
      topicsCollection,
      orderBy("vote_count", "desc"),
      limit(length)
    );

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
    let q = query(
      pollsCollection,
      where("topic", "==", topicName),
      orderBy("createdAt", "desc"),
      limit(length)
    );

    let countQ = query(
      pollsCollection,
      where("topic", "==", topicName),
      orderBy("createdAt", "desc")
    );

    if (start) {
      q = query(q, startAfter(start));
    }
    q = query(q, where("status", "==", 1));
    countQ = query(countQ, where("status", "==", 1));

    const querySnapshot = await getDocs(q);
    const countSnapshot = await getCountFromServer(countQ);
    const totalCount = countSnapshot.data().count;
    
    let lastDoc = null;
    if (querySnapshot.docs.length > 0)
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return {
      result: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes ?? 0,
        like_users: doc.data().like_users ?? [],
        dislikes: doc.data().dislikes ?? 0,
        dislike_users: doc.data().dislike_users ?? []
      })),
      lastDoc,
      totalCount,
    };
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
    const q = query(
      collection(db, ARTICLE_COLLECTION),
      where("pollId", "==", pollId)
    );

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

export const getArticlesByTopic = async (
  topic,
  start = null,
  limitCount = 10
) => {
  try {
    let q = query(collection(db, ARTICLE_COLLECTION));

    if (topic) {
      q = query(q, where("topic", "==", topic));
    }

    q = query(q, orderBy("createdAt", "desc"), limit(limitCount));
    // Apply pagination if a start point exists
    if (start) {
      q = query(q, startAfter(start));
    }

    q = query(q, where("status", "==", 1));

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
      view_count: articleSnap.data().view_count + 1,
    });
    return articleSnap.data();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const createTippingHistory = async (data) => {
  try {
    const docRef = await addDoc(
      collection(db, TIPPING_HISTORY_COLLECTION),
      data
    );
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating tipping history:", error);
    throw error;
  }
};

export const getTippingHistory = async ({
  userId = null,
  start = null,
  limitCount = 10,
}) => {
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
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    return {
      result: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastDoc,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const sendContact = async (data) => {
  try {
    const FORMSPREE_LINK = "https://formspree.io/f/mpwldrar";
    let res = await fetch(FORMSPREE_LINK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    res = await res.json();
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export async function getWikipediaSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.extract;
  } catch (error) {
    console.error("Error fetching Wikipedia summary:", error);
    return null;
  }
}

export async function getDescriptionUsingGPT(question) {
  const openai_api_key =
    "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";
  const url = "https://api.openai.com/v1/responses";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + openai_api_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        instructions:
          "Please write wiki description about question's keyword in 2~3 sentences. don't mention like keyword in the response.",
        input: question,
      }),
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
export async function updateSubscription(userId, subscription) {}

// narrative apis

export async function getNewsFromNewsAi(condition) {
  const url = "https://eventregistry.org/api/v1/article/getArticles";
  const today = (new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);

  try {
    const body = JSON.stringify({
      articlesCount: "100",
      includeArticleImage: "true",
      includeArticleShares: "true",
      includeArticleSentiment: "true",
      query: `{\"$query\":{\"$and\":[{\"dateStart\":\"${today}\",\"dateEnd\":\"${today}\"}, ${condition},{\"$or\":[{\"sourceUri\":\"hosted.ap.org\"},{\"sourceUri\":\"reuters.com\"},{\"sourceUri\":\"feeds.bbci.co.uk\"},{\"sourceUri\":\"bbc.com\"},{\"sourceUri\":\"pbs.org\"},{\"sourceUri\":\"bloomberg.com\"},{\"sourceUri\":\"npr.org\"},{\"sourceUri\":\"economist.com\"},{\"sourceUri\":\"theguardian.com\"},{\"sourceUri\":\"afp.com\"},{\"sourceUri\":\"euronews.com\"},{\"sourceUri\":\"dpa-international.com\"},{\"sourceUri\":\"propublica.org\"},{\"sourceUri\":\"news.mongabay.com\"},{\"sourceUri\":\"bbc24news.com\"},{\"sourceUri\":\"ft.com\"},{\"sourceUri\":\"wsj.com\"},{\"sourceUri\":\"technologyreview.com\"},{\"sourceUri\":\"techcrunch.com\"},{\"sourceUri\":\"artificialintelligence-news.com\"},{\"sourceUri\":\"analyticsinsight.net\"},{\"sourceUri\":\"kdnuggets.com\"},{\"sourceUri\":\"ai-magazine.com\"},{\"sourceUri\":\"emerj.com\"},{\"sourceUri\":\"r-bloggers.com\"},{\"sourceUri\":\"sciencedaily.com\"},{\"sourceUri\":\"syncedreview.com\"},{\"sourceUri\":\"towardsdatascience.com\"},{\"sourceUri\":\"venturebeat.com\"},{\"sourceUri\":\"coindesk.com\"},{\"sourceUri\":\"cointelegraph.com\"},{\"sourceUri\":\"theblock.co\"},{\"sourceUri\":\"u.today\"},{\"sourceUri\":\"coingape.com\"},{\"sourceUri\":\"decrypt.co\"},{\"sourceUri\":\"bankless.com\"},{\"sourceUri\":\"beincrypto.com\"},{\"sourceUri\":\"bitcoinmagazine.com\"},{\"sourceUri\":\"cryptoslate.com\"},{\"sourceUri\":\"coinmarketcap.com\"},{\"sourceUri\":\"cryptobriefing.com\"},{\"sourceUri\":\"cryptopotato.com\"},{\"sourceUri\":\"newsbtc.com\"},{\"sourceUri\":\"coinjournal.net\"},{\"sourceUri\":\"coincheckup.com\"},{\"sourceUri\":\"blockworks.co\"},{\"sourceUri\":\"forbes.com\"},{\"sourceUri\":\"cnn.com\"},{\"sourceUri\":\"cnbc.com\"},{\"sourceUri\":\"fool.com\"},{\"sourceUri\":\"businessinsider.com\"},{\"sourceUri\":\"theglobeandmail.com\"},{\"sourceUri\":\"moneymorning.com\"},{\"sourceUri\":\"investing.com\"},{\"sourceUri\":\"foxbusiness.com\"},{\"sourceUri\":\"finance.yahoo.com\"},{\"sourceUri\":\"marketwatch.com\"},{\"sourceUri\":\"barrons.com\"},{\"sourceUri\":\"fnlondon.com\"}]}]},\"$filter\":{\"forceMaxDataTimeWindow\":\"31\",\"isDuplicate\":\"skipDuplicates\",\"dataType\":[\"news\",\"blog\"]}}`,
      resultType: "articles",
      articlesSortBy: "date",
      apiKey: process.env.NEWSAPI_KEY,
      articlesConceptLang: "eng",
      includeArticleConcepts: "true",
      _origin: "sandbox",
      articlesPage: "1",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

export async function generatePoll(article_url, article_title, article_body) {
  const openai_api_key =
    "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";
  const url = "https://api.openai.com/v1/responses";

  const message = `Create a short "Breaking News" card from this url: ${article_url}

If you can not access please reference following content:

### Article Title ###
${article_title}

### Article Body Start ###
${article_body}
### Article Body End ###

### Non-negotiable rules (internal; do not print):
- Parse ONLY from the article's own page:
  - outlet_name (must match URL domain), publish_datetime (ISO), location, the main H1 headline text, and the first 1–2 sentences.
  - If the H1 contains a hard number (e.g., casualties, % move, count), KEEP the same number (or "at least X" if that is how it appears).

- Dates:
  - Prefer the article's publish date UNLESS the H1 explicitly includes an absolute event date (e.g., "on Sept. 28, 2025"). Do NOT invent or convert relative dates (e.g., "Sunday")—omit the date from the headline if you can't resolve it to an absolute date on the page.

- Leaders/administrations (U.S. guardrail by event date):
  - 2017-01-20 → 2021-01-20 = Trump
  - 2021-01-20 → 2025-01-20 = Biden
  - 2025-01-20 → present = Trump
  If uncertain, use neutral phrasing ("the U.S. administration"). Never guess.

- Outlet lock: The parenthetical MUST match the URL's news brand (e.g., reuters.com → Reuters; bbc.com → BBC News; abcnews.go.com → ABC News).

- No embellishment or inference. If a number/date is unclear, omit it rather than inventing it.

- Content should be html not markdown.

- All results should be English.

- Anti-repetition constraint:
  - Each section must contribute NEW information (new mechanism, stakeholder, timeframe, example, or metric).
  - Do not restate the headline beyond the "Explain It Like I'm New" section.
  - Avoid repeating the same key claim in more than TWO sections.
  - No verbatim sentence reuse across sections.
  - If a point is already explained, reference it briefly rather than re-explaining it.

### Output:
1. **company**: Company wikipedia url (e.g. http://en.wikipedia.org/wiki/Apple)
2. **company_name**: Company name (e.g. Apple)
3. **title**: Clear and compelling title. Closely mirror the article H1 and preserve all hard facts.
4. **content**: 250–500 words of professional, company-focused analysis. Should be html not markdown. Use only Wikipedia and open data sources (e.g., government or NGO reports). Provide deeper context — such as causes, historical/regional trends, or policy implications. Avoid generic definitions or rhetorical questions. Maintain a neutral, PhD-level tone.

   The content must read like a legitimate published article and include the following sections, in this order. Each section must use proper HTML heading tags (e.g., h2) and each heading must include a unique id attribute.

   Section-specific scope (do not overlap):
   - What People Are Noticing = observable signals only (market reaction, user behavior, executive actions, policy signals). No causes.
   - Why This Is Happening = underlying drivers (macro, industry, technology, regulation). No timing discussion.
   - What Changed to Make This Matter Now = recent catalysts and why timing shifted. No long-term history.
   - How Institutions Respond = institutional behavior only (allocations, governance, compliance, procurement).
   - What This Tends to Lead To Over Time = historical patterns and second-order effects.
   - What Does This Mean for Me? = practical implications for individuals. No institutional analysis.
   - Where This Eventually Shows Up = downstream effects in markets, products, pricing, jobs, or regulation.
   - The Question This Raises = one forward-looking question only; do not answer it.

   Length caps:
   - Explain It Like I'm New: 3–4 sentences MAX.
   - Each main section: 2–4 sentences MAX.
   - Analytics & Data: 3–6 bullets MAX.
   - Sources: 3–6 bullets.

   Uniqueness requirement:
   - Each section must include at least ONE unique anchor not used elsewhere (a statistic, stakeholder group, mechanism, concrete example, or timeframe).

   **Explain It Like I'm New**
   - Add a section titled **"Explain It Like I'm New"**.
   - Explain the entire news headline in extremely simple terms.
   - 3–4 sentences MAX.
   - No jargon. Assume zero prior knowledge.

   **What People Are Noticing**

   **Why This Is Happening**

   **What Changed to Make This Matter Now**

   **How Institutions Respond**
   - Focus on how large companies, institutions, or major organizations are responding.

   **What This Tends to Lead To Over Time**

   **What Does This Mean for Me?**
   - Explain implications for individuals, workers, consumers, or everyday investors.
   - No personalized or prescriptive financial advice.

   **Where This Eventually Shows Up**
   - Markets, products, pricing, regulation, jobs, or daily life.

   **The Question This Raises**
   - One clear forward-looking question implied by the situation.

   **Analytics & Data**
   - Always include analytics (stats, trends, or charts).
   - Use only open data sources (e.g., World Bank, IMF, OECD, UN, national statistical agencies, FRED).
   - Clearly state years, regions, and units.

   New — Investment Impact Section:
   - Add a clearly labeled subsection titled **":dollar: If you invested X dollars, what would that mean?"** whenever the topic is **Crypto, AI, Finance, or Politics** that specifically mentions a company or a high-level person involved with a company.
   - Use only open data (e.g., index/sector returns from FRED, World Bank, IMF, OECD) and Wikipedia for background.
   - If precise asset-level open data are unavailable, use a transparent index-level proxy (state the proxy and timeframe) or provide a formulaic illustration (e.g., compound growth at an open-data CAGR).
   - Default **X = $1,000** unless a different amount is explicitly provided by the user or the article context; state all assumptions.
   - Present outcomes numerically and label as a hypothetical illustration, **not financial advice**.

   **NEW — Enterprise Adoption Add-on (must accompany the Investment Impact subsection):**
   - Immediately after the ":dollar: If you invested X dollars..." subsection, add a second subsection titled **":office: How large companies leverage this today"**.
   - Summarize how major firms (e.g., Fortune 500 or sector leaders) are adopting, deploying, or monetizing the technology/policy/asset discussed.
   - Use only open sources and Wikipedia company pages for background.
   - Prefer 2–4 concise examples; keep neutral, avoid marketing language.

   **Sources**
   - At the end of the article, add a sources list with 3–6 bullet points.
   - Name the organization and the dataset/report/page title actually used.
   - Use only open sources.
   - Place the Wikipedia source as the last bullet.
   - Do NOT include the news article itself.

   - The whole content should be outputed as html not markdown.
   - Headings and subheadings should use proper HTML tags (h1, h2, etc.).
   - Each section must include a unique id attribute.

5. **sections_ids**: array of section ids so that we can scroll to those sections in the article using a tag like <a href="#what-people-are-noticing">What People Are Noticing</a>
6. **sections_titles**: array of section names
7. **category**: category of the article. It should be one of these values - ["AI", "Finance", "Crypto"]

### Final self-audit (internal; do not print):

- Company is the primary analytical subject.
- Outlet parenthetical matches URL domain.
- No invented dates.
- If H1 has a number, identical number appears in the title.
- No administration mislabel; if uncertain → neutral phrasing.
- Title length ≤ 160 characters; no duplicate with existing items.`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + openai_api_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        tools: [{ type: "web_search_preview" }],
        input: message,
        text: {
          format: {
            name: "poll",
            type: "json_schema",
            strict: true,
            schema: {
              type: "object",
              properties: {
                company: { type: "string" },
                company_name: { type: "string" },
                title: { type: "string" },
                content: { type: "string" },
                sections_ids: { type: "array", items: { type: "string" } },
                sections_titles: { type: "array", items: { type: "string" } },
                category: {
                  type: "string",
                  enum: ["AI", "Finance", "Crypto"],
                },
              },
              required: [
                "company",
                "company_name",
                "title",
                "content",
                "sections_ids",
                "sections_titles",
                "category",
              ],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.output.length > 1
      ? JSON.parse(data.output[1].content[0].text)
      : JSON.parse(data.output[0].content[0].text);
  } catch (error) {
    console.error("Error fetching Wikipedia summary:", error);
    return null;
  }
}

export async function addNewsArticle(article) {
  await addDoc(collection(db, "news_articles"), { ...article, used: false });
}

export async function getExistingArticles(url) {
  const articles = await getDocs(
    query(collection(db, "news_articles"), where("url", "==", url))
  );
  return articles.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function getUnusedNewsArticles() {
  const articles = await getDocs(
    query(
      collection(db, "news_articles"),
      where("used", "==", false),
      orderBy("dateTime", "desc")
    )
  );
  return articles.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function updateNewsArticle(articleId, updatedData) {
  const articleRef = doc(collection(db, "news_articles"), articleId);
  await updateDoc(articleRef, updatedData);
}

export async function getExistingSubscriptionLogForIntentId(intentId) {
  const logs = await getDocs(
    query(
      collection(db, "subscription_logs"),
      where("intentId", "==", intentId)
    )
  );
  return logs.docs.map((doc) => doc.data());
}

export async function addSubscriptionLog(userId, amount, intentId) {
  const log = {
    userId,
    amount,
    intentId,
    createdAt: new Date(),
  };
  await addDoc(collection(db, "subscription_logs"), log);
}

export async function updateUserSubscription(userId, amount, intentId) {
  let logs = await getExistingSubscriptionLogForIntentId(intentId);
  if (logs.length > 0) {
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
    await updateUserById(userId, {
      subscripted_at: user.subscripted_at.getTime(),
    });
  } else {
    user.subscripted_at = new Date();
    user.subscripted_at.setMonth(user.subscripted_at.getMonth() + duration);
    await updateUserById(userId, {
      subscripted_at: user.subscripted_at.getTime(),
    });
  }
  await addSubscriptionLog(userId, amount, intentId);
}

export async function getEventsFromNewsAi() {
  const url = "https://eventregistry.org/api/v1/event/getEvents";

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const formattedNextMonth = nextMonth.toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);

    const body = JSON.stringify({
      query: `{\"$query\":{\"$and\":[{\"lang\":\"eng\"},{\"$or\":[{\"categoryUri\":\"dmoz/Computers/Artificial_Intelligence\"},{\"categoryUri\":\"news/Politics\"}]},{\"locationUri\":\"http://en.wikipedia.org/wiki/United_States\"},{\"dateStart\":\"${formattedTomorrow}\",\"dateEnd\":\"${formattedNextMonth}\"}]}}`,
      eventsSortBy: "date",
      eventsConceptLang: "eng",
      eventsSortByAsc: true,
      apiKey: process.env.NEWSAPI_KEY,
      _origin: "sandbox",
      eventsPage: "1",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
}

export const createSnapshot = async (snapshotData) => {
  try {
    const data = {
      ...snapshotData,
      enabled: true,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, SNAPSHOT_COLLECTION), data);
    return { id: docRef.id, ...data, enabled: true };
  } catch (error) {
    console.error("Error adding snapshot:", error);
    throw error;
  }
};

export const getSnapshots = async (start = null, length = 10, date_start = null, date_end = null, tag_filter = [], enabled_filter = true) => {
  try {
    const constraints = [];
    const countConstraints = [];

    // ✅ Tag filter
    if (tag_filter.length > 0) {
      constraints.push(where("tags", "array-contains-any", tag_filter));
      countConstraints.push(where("tags", "array-contains-any", tag_filter));
    }

    // ✅ Date range filter (optional)
    if (date_start) {
      constraints.push(where("post_date", ">=", date_start));
      countConstraints.push(where("post_date", ">=", date_start));
    }
    if (date_end) {
      constraints.push(where("post_date", "<=", date_end));
      countConstraints.push(where("post_date", "<=", date_end));
    }

    constraints.push(orderBy("post_date", "desc"));
    constraints.push(limit(length));

    if (enabled_filter) {
      constraints.push(where("enabled", "==", true));
      countConstraints.push(where("enabled", "==", true));
    }

    if (start) {
      constraints.push(startAfter(start));
    }

    // Get paginated results
    const q = query(collection(db, SNAPSHOT_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    // Get total count (without pagination)
    const countQuery = query(collection(db, SNAPSHOT_COLLECTION), ...countConstraints);
    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return {
      results,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      totalCount
    };
  } catch (error) {
    console.error("Error fetching snapshots:", error);
    throw error;
  }
};

export async function enableSnapshot(snapshotId) {
  const ref = doc(db, SNAPSHOT_COLLECTION, snapshotId);
  await updateDoc(ref, { enabled: true });
}

export async function disableSnapshot(snapshotId) {
  const ref = doc(db, SNAPSHOT_COLLECTION, snapshotId);
  await updateDoc(ref, { enabled: false });
}

export async function deleteSnapshot(snapshotId) {
  const ref = doc(db, SNAPSHOT_COLLECTION, snapshotId);
  await deleteDoc(ref);
}

export async function updateSnapshot(snapshotId, data) {
  const ref = doc(db, SNAPSHOT_COLLECTION, snapshotId);
  await updateDoc(ref, data);
}

export const getSnapshotById = async (id) => {
  try {
    const articleRef = doc(db, SNAPSHOT_COLLECTION, id);
    const articleSnap = await getDoc(articleRef);
    await updateSnapshot(id, {
      view_count: articleSnap.data().view_count + 1,
    });
    return articleSnap.data();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const createViralDetection = async (data) => {
  try {
    const docRef = await addDoc(collection(db, VIRAL_DETECTIONS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating viral detection:", error);
    throw error;
  }
}

export const getViralDetections = async (start_date = null, end_date = null) => {
  try {
    const constraints = [];
    if (start_date) {
      constraints.push(where("post_date", ">=", start_date));
    }
    if (end_date) {
      constraints.push(where("post_date", "<=", end_date));
    }

    const q = query(collection(db, VIRAL_DETECTIONS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching viral detections:", error);
    throw error;
  }
}

export async function getEventsWithSocialScoreFromNewsAi(condition) {
  const url = "https://eventregistry.org/api/v1/event/getEvents";
  const today = (new Date(Date.now() - 24*60*60*1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);

  try {
    const body = JSON.stringify({
      query: `{\"$query\":{\"$and\":[${condition}, {\"locationUri\":\"http://en.wikipedia.org/wiki/United_States\"},{\"lang\": \"eng\"},{\"dateStart\":\"${today}\",\"dateEnd\":\"${today}\"}]}}`,
      eventsConceptLang: "eng",
      eventsCount: "5",
      eventsPage: "1",
      eventsSortBy: "socialScore",
      includeEventInfoArticle: "true",
      includeEventSentiment: "true",
      includeEventSocialScore: "true",
      apiKey: process.env.NEWSAPI_KEY,
      _origin: "sandbox",
      resultType: "events",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
}

export async function generateViralDetectionUsingGPT(event) {
  const openai_api_key =
    "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";
  const url = "https://api.openai.com/v1/responses";

  const message = `Please create an professional analysis article based on following event.

### Event Details ###

Event Title:
${event.title.eng}
Event Summary:
${event.summary.eng}

### Output:
1. **title**: Clear and compelling title.
2. **content**: 250–500 words of professional analysis. Use only Wikipedia and open data sources (e.g., government or NGO reports). Do not paraphrase the article. Provide deeper context — such as causes, historical/regional trends, or policy implications. Avoid generic definitions or rhetorical questions. Maintain a neutral tone.
Style whole blog content well with headings, subheadings, and bullet points for better readability. And also some words that need to be bolded for emphasis.
3. **category**: category of the article. It should be one of these values - ["AI", "Finance", "Politics", "Crypto]`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + openai_api_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        tools: [{ type: "web_search_preview" }],
        input: message,
        text: {
          format: {
            name: "poll",
            type: "json_schema",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                category: {
                  type: "string",
                  enum: ["AI", "Finance", "Politics", "Crypto"],
                },
              },
              required: [
                "title",
                "content",
                "category",
              ],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return data.output.length > 1
      ? JSON.parse(data.output[1].content[0].text)
      : JSON.parse(data.output[0].content[0].text);
  } catch (error) {
    console.error("Error generating article using gpt:", error);
    return null;
  }
}

export async function clearTodayEvents() {
  const today = (new Date(Date.now() - 24 * 60 * 60 * 1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
  const data = await getViralDetections(today, today);
  for (const ev of data){
    const ref = doc(db, VIRAL_DETECTIONS_COLLECTION, ev.id);
    await deleteDoc(ref);
  }
}

export const getViralDetectionById = async (id) => {
  try {
    const articleRef = doc(db, VIRAL_DETECTIONS_COLLECTION, id);
    const articleSnap = await getDoc(articleRef);
    return articleSnap.data();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function deleteViralDetection(id) {
  try {
    const articleRef = doc(db, VIRAL_DETECTIONS_COLLECTION, id);
    await deleteDoc(articleRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function addCompanyToFavorites(user_id, company_id) {
  try {
    const userRef = doc(db, USERS_COLLECTION, user_id);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const favorites = userData.favorites || [];
    if (favorites.includes(company_id)) {
      throw new Error("Company already in favorites");
    }
    favorites.push(company_id);
    await updateDoc(userRef, { favorites });
    return true;
  } catch (error) {
    console.error("Error adding company to favorites:", error);
    return false;
  }
}

export async function removeCompanyFromFavorites(user_id, company_id) {
  try {
    const userRef = doc(db, USERS_COLLECTION, user_id);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const favorites = userData.favorites || [];
    if (!favorites.includes(company_id)) {
      throw new Error("Company not in favorites");
    }
    favorites.splice(favorites.indexOf(company_id), 1);
    await updateDoc(userRef, { favorites });
    return true;
  } catch (error) {
    console.error("Error removing company from favorites:", error);
    return false;
  }
}

export async function getCompanyNewsFromNewsAi(company_id) {
  const url = "https://eventregistry.org/api/v1/article/getArticles";
  const today = (new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
  const company = FAMOUS_COMPANIES_DATA.find(company => company.id === company_id);
  if (!company) {
    throw new Error("Company not found");
  }
  try {
    const body = JSON.stringify({
      articlesCount: "100",
      includeArticleImage: "true",
      includeArticleShares: "true",
      includeArticleSentiment: "true",
      query: JSON.stringify({
        "$query":
        {
          "$and": 
          [
            {
              "dateStart": today,
              "dateEnd":today
            },
            {"sourceGroupUri":"business/top100"},
            {
              "conceptUri": company.search
            }
          ]
        },
        "$filter": {
          "forceMaxDataTimeWindow": "31",
          "isDuplicate": "skipDuplicates",
          "dataType": ["news", "blog"]
        }
      }),
      resultType: "articles",
      articlesSortBy: "date",
      apiKey: process.env.NEWSAPI_KEY,
      articlesConceptLang: "eng",
      includeArticleConcepts: "true",
      _origin: "sandbox",
      articlesPage: "1",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}


export async function generateComapnyArticleUsingGPT(news_title, news_body) {
  const openai_api_key =
    "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";
  const url = "https://api.openai.com/v1/responses";

  const message = `Please create an professional analysis article based on following news.

### News Details ###

News Title:
${news_title}
News Content:
${news_body}

### Output:
1. **title**: Clear and compelling title.
2. **content**: 250–500 words of professional analysis. Use only Wikipedia and open data sources (e.g., government or NGO reports). Do not paraphrase the article. Provide deeper context — such as causes, historical/regional trends, or policy implications. Avoid generic definitions or rhetorical questions. Maintain a neutral tone.
Style whole blog content well with headings, subheadings, and bullet points for better readability. And also some words that need to be bolded for emphasis.
3. **category**: category of the article. It should be one of these values - ["AI", "Finance", "Politics", "Crypto]`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + openai_api_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        tools: [{ type: "web_search_preview" }],
        input: message,
        text: {
          format: {
            name: "poll",
            type: "json_schema",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                category: {
                  type: "string",
                  enum: ["AI", "Finance", "Politics", "Crypto"],
                },
              },
              required: [
                "title",
                "content",
                "category",
              ],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return data.output.length > 1
      ? JSON.parse(data.output[1].content[0].text)
      : JSON.parse(data.output[0].content[0].text);
  } catch (error) {
    console.error("Error generating article using gpt:", error);
    return null;
  }
}

export async function getBusinessNewsForCompaniesFromNewsAi() {
  const url = "https://eventregistry.org/api/v1/article/getArticles";
  const today = (new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
  const companies = FAMOUS_COMPANIES_DATA;
  const body = JSON.stringify({
    "articlesCount": "100",
    "includeArticleImage": "true",
    "includeArticleShares": "true",
    "includeArticleSentiment": "true",
    "query": JSON.stringify({
        "$query":
        {
          "$and": 
          [
            {"categoryUri": "news/Business"},
            {"sourceGroupUri":"business/top100"},
            {"lang": "eng"}
          ]
        },
        "$filter": {
          "forceMaxDataTimeWindow": "31",
          "isDuplicate": "skipDuplicates",
          "dataType": ["news", "blog"]
        }
      }),
    "resultType": "articles",
    "articlesSortBy": "date",
    "apiKey": process.env.NEWSAPI_KEY,
    "articlesConceptLang": "eng",
    "includeArticleConcepts": "true",
    "_origin": "sandbox"
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching business news:", error);
    return null;
  }
}

