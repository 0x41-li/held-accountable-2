// get data from /api/enterprise for user's favorite companies and show them
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getUserById } from "@/services/polls/polls";
import { FAMOUS_COMPANIES_DATA } from "@/services/const";
import { Icon } from "@iconify/react";
import { auth } from "../../../lib/firebase";
import Link from "next/link";
import Label from "@/components/ui/Label";

function ArticleCard({ article }) {
    const router = useRouter();
    return (
        <div className="w-[300px] border rounded-lg p-4 flex flex-col shadow bg-white items-start gap-4 cursor-pointer" onClick={() => router.push(`/enterprises/${article.id}`)}>
            <h3 className="text-lg font-semibold">{article.title}</h3>
            <p className="text-gray-600 mb-4 flex-grow text-sm">{article.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 100)}...</p>
            {article.category && (
                <Label
                    text={article.category}
                    className="bg-[#FDF2FA] border border-[#FCCEEE] !text-[#C11574] !py-[2px]"
                />
            )}
        </div>
    );
}


function EnterpriseCard({ enterprise }) {
    return (
        <div className="w-full border rounded-lg p-8 flex flex-col shadow bg-white">
            <div className="flex flex-col items-start gap-8 justify-center mb-3">
                <div className="flex items-center gap-3 justify-center">
                    <div className="flex items-center justify-center rounded-lg">
                        <Icon icon={FAMOUS_COMPANIES_DATA.find(company => company.id === enterprise.company_id).logo} className="w-12 h-12" />
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{enterprise.company_name}</h3>
                    </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{enterprise.description}</p>
            </div>
            <div className="overflow-auto w-full">
                <div className="flex gap-6 mt-6 px-4 w-max">
                    {enterprise.articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function EnterprisesPage() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [favorites, setFavorites] = useState([]);
    const [uid, setUid] = useState(null);
    const [enterprises, setEnterprises] = useState([]);
    const [followingCompanies, setFollowingCompanies] = useState(new Set());

    useEffect(() => {
        const fetchEnterprises = async () => {
            const response = await fetch(`/api/enterprise?company_ids=${favorites.join(',')}&limit=5`);
            const data = await response.json();
            setEnterprises(data.data);
        };
        fetchEnterprises();
    }, [favorites]);

  // Auth effect
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) {
        router.replace("/login");
        return;
      }
      setUid(userAuth.uid);

      // Fetch user info from your backend to get favorites
      const userData = await getUserById(userAuth.uid);
      setUser(userData);
      setFavorites(userData?.favorites || []);
      setFollowingCompanies(new Set(userData?.favorites || []));
    });
    return () => unsub();
  }, [router]);

    return (
        <div className="w-full h-full overflow-hidden md:rounded-tl-[2.5rem] pt-8 border border-secondary flex flex-col bg-[#FCFCFD] overflow-y-auto pb-8">
            <div className="flex px-4 md:px-6 pb-5 border-b border-secondary items-start md:flex-row flex-col">
                <div className="flex flex-col gap-1 flex-1">
                    <div className="text-2xl md:text-[1.875rem] leading-[2.375rem] font-semibold">
                        Enterprise Radar
                    </div>
                    <div className="text-sm md:text-base leading-6 text-[#7C7C7C]">
                        Follow the most popular users and companies here.
                    </div>
                </div>
                <Link href="/enterprises/select">
                    <button className="px-3 py-2 bg-blue-500 rounded text-sm flex items-center justify-center gap-2 border">
                        <Icon icon="mdi:plus" />
                        Manage Favorites
                    </button>
                </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-6 w-full px-4 md:w-[95%] lg:w-[85%] lg:max-w-[85%] md:mx-auto">
                {enterprises.map((enterprise) => (
                    <EnterpriseCard 
                        key={enterprise.company_id} 
                        enterprise={enterprise} 
                    />
                ))}
            </div>
        </div>
    );
}