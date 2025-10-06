'use client';
import { getUsers, updateUserById } from "@/services/polls/polls";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function usersAdminPage() {
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

    const changeRole = (uid, role) => {
        setUsers(users.map(user => user.id === uid ? {...user, role}: user));
        updateUserById(uid, {
            ...users.find(user => user.id === uid),
            role
        });
    }
  
    useEffect(() => {
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
                        Role
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map(user => <tr key={user.id} className="hover:bg-slate-50">
                        <td className="p-4">{user.fullname}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.username}</td>
                        <td className="p-4">
                            <select onChange={(e) => changeRole(user.id, e.target.value)} value={user.role ?? "user"}>
                                <option value="admin">Admin</option>
                                <option value="writer">Write Manager</option>
                                <option value="snapshot-writer">Snapshot Writer</option>
                                <option value="through-my-eyes-writer">Thought Leadership Writer</option>
                                <option value="user">User</option>
                            </select>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>
        <div ref={ref} className="h-10" />
    </div>;
}