'use client';
import { getUsers, updateUserById } from "@/services/polls/polls";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function usersAdminPage() {
    const [preview, setPreview] = useState(null);
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
  
    const { ref, inView } = useInView();
  
    const loadusers = async () => {
      setLoading(true);
      const { result: user_list, lastDoc } = await getUsers(start);
  
      if (user_list.length === 0) {
        setLoading(false);
        setHasMore(false);
        return;
      }
  
      if (users.findIndex(p => p.id === user_list[0].id) >= 0) {
        setLoading(false);
        return;
      }
  
      setStart(lastDoc);
      setUsers([...users, ...user_list]);
      setLoading(false);
    }

    const getStatusText = (status) => {
        if (status == 1) {
            return "Enabled";
        }
        else
            return "Disabled";
    }

    const changeStatus = (p) => {
        let status = p.status;
        if (status == 1)
            status = 0;
        else
            status = 1;
        setUsers(users.map(user => user.id === p.id ? {...p, status}: user));
        updateUserById(p.id, {
            ...p,
            status
        });
    }
  
    useEffect(() => {
      console.log(loading, inView)
      if (!loading && inView && hasMore)
        loadusers();
    }, [inView, loading, hasMore]);

    return <div className="mx-auto max-w-[1280px] flex flex-col gap-[20px] h-full">
        <table className="table-auto flex-1 h-full">
            <thead>
                <tr className="text-slate-500 border-b border-slate-300 bg-slate-50">
                    <th className="p-4">
                        Full Name
                    </th>
                    <th className="p-4">
                        Email
                    </th>
                    <th className="p-4">
                        Username
                    </th>
                    <th className="p-4">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map(user => <tr key={user.id} className="hover:bg-slate-50">
                        <td className="p-4">{user.fullname}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.username}</td>
                        <td className="p-4"><button onClick={() => changeStatus(user)} className={"rounded-full px-2 py-1 text-white text-xs " + (user.status == 1 ? ' bg-[#00ff00]': 'bg-[#ff0000]')}>{getStatusText(user.status)}</button></td>
                    </tr>)
                }
            </tbody>
        </table>
        <div ref={ref} className="h-10" />
    </div>;
}