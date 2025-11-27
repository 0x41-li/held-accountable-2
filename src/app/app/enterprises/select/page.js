// based on other pages in the project, generate a page of company list defined in /src/services/const.js and able to add/remove them to favorites
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import { FAMOUS_COMPANIES_DATA } from "@/services/const";
import { addCompanyToFavorites, removeCompanyFromFavorites, getUserById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import Link from "next/link";

function CompanyCard({ company, isFavorite, onAdd, onRemove, loading }) {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 border rounded-lg p-4 flex flex-col shadow bg-white">
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center gap-3 flex-col justify-center">
          <div className="flex items-center justify-center rounded-lg">
            <Icon 
              icon={company.logo}
              className="w-24 h-24"
            />
          </div>
          <h3 className="text-lg font-semibold">{company.name}</h3>
        </div>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{company.description}</p>
      <div className="mt-auto flex items-center justify-center gap-2">
        {isFavorite ? (
          <button
            className="px-3 py-2 bg-[#3b88e3] text-white rounded text-sm flex items-center justify-center gap-2 border"
            onClick={onRemove}
            disabled={loading}
          >
            <Icon icon="mdi:check" />
            Followed
          </button>
        ) : (
          <button
            className="px-3 py-2 bg-blue-500 rounded text-sm flex items-center justify-center gap-2 border"
            onClick={onAdd}
            disabled={loading}
          >
            <Icon icon="mdi:plus" />
            Follow
          </button>
        )}
      </div>
    </div>
  );
}

export default function SelectEnterprisePage() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [favorites, setFavorites] = useState([]);
  const [uid, setUid] = useState(null);
  const [loadingCompanyIds, setLoadingCompanyIds] = useState([]);

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
    });
    return () => unsub();
  }, [router]);

  // Add to favorite
  const handleAddFavorite = async (companyId) => {
    if (!uid) return;
    setLoadingCompanyIds((ids) => [...ids, companyId]);
    const result = await addCompanyToFavorites(uid, companyId);
    if (result) setFavorites((prev) => [...prev, companyId]);
    setLoadingCompanyIds((ids) => ids.filter(id => id !== companyId));
  };

  // Remove from favorite
  const handleRemoveFavorite = async (companyId) => {
    if (!uid) return;
    setLoadingCompanyIds((ids) => [...ids, companyId]);
    const result = await removeCompanyFromFavorites(uid, companyId);
    if (result) setFavorites((prev) => prev.filter(favId => favId !== companyId));
    setLoadingCompanyIds((ids) => ids.filter(id => id !== companyId));
  };

  return (
    <div className="w-full h-full overflow-hidden md:rounded-tl-[2.5rem] pt-8 border border-secondary flex flex-col bg-[#FCFCFD] overflow-y-auto pb-8">
      <div className="flex px-4 md:px-6 pb-5 border-b border-secondary items-start">
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-2xl md:text-[1.875rem] leading-[2.375rem] font-semibold">
            Enterprise Radar
          </div>
          <div className="text-sm md:text-base leading-6 text-[#7C7C7C]">
            Follow the most popular users and companies here.
          </div>
        </div>
        <Link href="/app/enterprises">
          <button className="px-3 py-2 bg-blue-500 rounded text-sm flex items-center justify-center gap-2 border">
            <Icon icon="mdi:arrow-left" />
            Back
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-6 mt-6 w-full px-4 md:w-[95%] lg:w-[85%] lg:max-w-[85%] md:mx-auto">
        {FAMOUS_COMPANIES_DATA.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            isFavorite={favorites.includes(company.id)}
            onAdd={() => handleAddFavorite(company.id)}
            onRemove={() => handleRemoveFavorite(company.id)}
            loading={loadingCompanyIds.includes(company.id)}
          />
        ))}
      </div>
    </div>
  );
}
